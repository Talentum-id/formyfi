import router from '@/router';
import axiosService from '@/services/axiosService';
import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, user_index } from '~/user_index';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';
import { decodeCredential } from 'vue3-google-login';
import { useStatsStore } from '@/store/stats';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal, readFile } from '@/util/helpers';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { PostMessageTransport } from '@slide-computer/signer-web';
import { Signer } from '@slide-computer/signer';
import { SignerClient } from '@slide-computer/signer-client';
import { externalWeb3IdentityProviders } from '@/constants/externalIdentityProviders';

const INTERNET_IDENTITY_TITLE = 'Linked';
const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: process.env.II_URI,
    maxTimeToLive: BigInt(process.env.II_LIFETIME),
  },
};

const createActorFromIdentity = (identity) => {
  return createActor(process.env.CANISTER_ID_USER_INDEX, {
    agentOptions: { identity },
  });
};

export const useAuthStore = defineStore('auth', {
  id: 'auth',
  state: () => {
    return {
      actor: null,
      admins: [],
      authClient: null,
      extraIdentities: [],
      isReady: false,
      isAuthenticated: false,
      identity: null,
      principal: null,
      user: null,
      isQuest: false,
      profile: null,
      signer: null,
      signerClient: null,
      stats: 0,
      usersList: null,
    };
  },
  actions: {
    async init() {
      const authenticationProvider = localStorage.authenticationProvider;
      const IIIdentification = ['ii', undefined, ''];

      if (IIIdentification.indexOf(authenticationProvider) !== -1) {
        await this.initII();
      } else if (authenticationProvider === 'siwe') {
        await this.initSIWE();
      } else if (authenticationProvider === 'siws') {
        await this.initSIWS();
      } else if (authenticationProvider === 'nfid') {
        await this.initNFID();
      } else {
        await this.initWeb2Auth();
      }

      if (this.isAuthenticated) {
        await this.findUser(this.getPrincipal)
          .then(async (res) => {
            await this.initStores();

            if (res.length) {
              await this.fetchExtraIdentities(res[0].extraIdentities ?? []);
              await this.setUser(res[0]);
            } else {
              this.isAuthenticated = false;

              this.setAuthenticationStorage(false);

              if (!this.isQuest) {
                await router.push('/sign-up');
              }
            }
          })
          .catch(async () => await this.logout());
      } else {
        if (!this.isQuest && !localStorage.socialProvider) {
          await router.push('/sign-up');
        }

        if (this.isQuest) {
          await this.initStores();
        }
      }

      this.isReady = true;
    },
    async initSIWE(walletAddress = null) {
      const address = walletAddress ?? localStorage.getItem('address');

      if (address) {
        if (walletAddress !== null) {
          localStorage.setItem('address', walletAddress);
        }

        try {
          const { Ok: principal } = await ic_siwe_provider.get_principal(address);

          if (principal !== undefined) {
            await this.generateWeb3WalletIdentity(principal, 'siwe', address);
          }
        } catch (e) {
          console.error(e);

          await this.logout();
        }
      } else {
        await this.logout();
      }
    },
    async initSIWS(walletAddress = null) {
      const address = walletAddress ?? localStorage.getItem('address');

      if (address) {
        if (walletAddress !== null) {
          localStorage.setItem('address', walletAddress);
        }

        try {
          const { Ok: principal } = await ic_siws_provider.get_principal(address);

          if (principal !== undefined) {
            await this.generateWeb3WalletIdentity(principal, 'siws', address);
          }
        } catch (e) {
          console.error(e);

          await this.logout();
        }
      } else {
        await this.logout();
      }
    },
    async initWeb2Auth() {
      this.actor = user_index;

      await this.initStores();

      this.isAuthenticated = true;
      this.principal = localStorage.extraCharacter;
    },
    async initII(isProfile = false) {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = authClient;

      const isAuthenticated = await authClient.isAuthenticated();
      const identity = isAuthenticated ? authClient.getIdentity() : null;

      await this.initIdentityDependencies(identity, isAuthenticated, isProfile);
    },
    async initNFID() {
      const transport = new PostMessageTransport({
        url: process.env.NFID_URL,
      });
      const signer = new Signer({
        transport,
      });
      let signerClient = await SignerClient.create({
        signer,
        idleOptions: defaultOptions.createOptions,
      });

      if (signerClient.getIdentity().getPrincipal().isAnonymous()) {
        signerClient = await SignerClient.create({
          signer,
          identity: Ed25519KeyIdentity.generate(),
          idleOptions: defaultOptions.createOptions,
        });
      }

      const isAuthenticated = signerClient.isAuthenticated();
      const identity = isAuthenticated ? signerClient.getIdentity() : null;

      this.signer = await signer;
      this.signerClient = await signerClient;

      await this.initIdentityDependencies(identity, isAuthenticated);
    },
    async initIdentityDependencies(identity, isAuthenticated, isProfile = false) {
      const agent = identity ? new HttpAgent({ identity }) : null;

      if (agent !== null) {
        await agent.syncTime();
      }

      if (isProfile) {
        this.actor
          .addExtraIdentity(
            (await agent.getPrincipal()).toText(),
            'ii',
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            INTERNET_IDENTITY_TITLE,
            'ii',
          )
          .then(async () => await this.getProfile())
          .catch((e) => console.error(e));

        return;
      }

      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.actor = identity ? createActorFromIdentity(identity) : null;
      this.principal = identity ? await agent.getPrincipal() : null;
    },
    async initStores() {
      await useQAStore().init();
      await useResponseStore().init();
      await useStatsStore().init();
    },
    async loginWithII(isProfile = false) {
      if (this.authClient === null) {
        await this.initII(isProfile);
      }

      const authClient = toRaw(this.authClient);

      await authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          const isAuthenticated = await authClient.isAuthenticated();
          const identity = isAuthenticated ? authClient.getIdentity() : null;

          await this.initIdentityDependencies(identity, isAuthenticated, isProfile);

          if (isProfile) return;

          this.setAuthenticationStorage(this.isAuthenticated, 'ii');
          await this.initStores();

          if (!this.isQuest) {
            await router.push('/sign-up');
          }
        },
      });
    },
    async loginWithNFID() {
      if (this.signerClient === null) {
        await this.initNFID();
      }

      const signerClient = toRaw(this.signerClient);

      await signerClient.login({
        maxTimeToLive: BigInt(process.env.II_LIFETIME),
        onSuccess: async () => {
          const isAuthenticated = signerClient.isAuthenticated();
          const identity = this.isAuthenticated ? signerClient.getIdentity() : null;

          await this.initIdentityDependencies(identity, isAuthenticated);
          this.setAuthenticationStorage(this.isAuthenticated, 'nfid');

          await this.initStores();

          if (!this.isQuest) {
            await router.push('/sign-up');
          }
        },
      });
    },
    async loginWithGoogle(credential, isProfile = false) {
      const { email } = decodeCredential(credential);
      if (isProfile) {
        this.actor
          .addExtraIdentity(
            email,
            'google',
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            email,
            'google',
          )
          .then(async () => {
            await this.getProfile();
          });
        return;
      }
      this.actor = user_index;

      this.setAuthenticationStorage(true, 'google', email);

      this.principal = localStorage.extraCharacter;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      if (!this.isQuest) {
        await router.push('/sign-up');
      }
    },
    async prepareSIWELogin(address) {
      const data = await ic_siwe_provider.siwe_prepare_login(address);

      return data?.Ok || null;
    },
    async loginWithSIWE(address, signature, connectorName = false) {
      try {
        const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

        await ic_siwe_provider.siwe_login(signature, address, new Uint8Array(sessionKey));

        const { Ok: principal } = await ic_siwe_provider.get_principal(address);

        await this.generateWeb3WalletIdentity(principal, 'siwe', address, connectorName);

        if (connectorName) return;

        localStorage.setItem('address', address);

        await this.initStores();

        if (!this.isQuest) {
          await router.push('/sign-up');
        }
      } catch (e) {
        console.error(e);
      }
    },
    async prepareSIWSLogin(address) {
      const data = await ic_siws_provider.siws_prepare_login(address);

      return data?.Ok || null;
    },
    async loginWithSIWS(address, signature, connectorName = false) {
      try {
        const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

        await ic_siws_provider.siws_login(signature, address, new Uint8Array(sessionKey));

        const { Ok: principal } = await ic_siws_provider.get_principal(address);
        await this.generateWeb3WalletIdentity(principal, 'siws', address, connectorName);

        if (connectorName) return;

        localStorage.setItem('address', address);

        await this.initStores();

        if (!this.isQuest) {
          await router.push('/sign-up');
        }
      } catch (e) {
        console.error(e);
      }
    },
    async logout() {
      const authClient = toRaw(this.authClient);
      const signerClient = toRaw(this.signerClient);

      await authClient?.logout();
      await signerClient?.logout();

      this.setAuthenticationStorage(false);

      this.isAuthenticated = false;
      this.identity = this.actor = this.principal = null;

      await this.setUser();
      await router.push('/login');
      window.location.reload();
    },
    async fetchStats() {
      return await this.actor
        ?.getUsersAmount()
        .then((res) => (this.stats = res))
        .catch((e) => console.error(e));
    },
    async fetchExtraIdentities(identities) {
      let extraIdentities = identities;
      if (identities.length !== 0) {
        extraIdentities = identities[0];
      }

      await this.actor
        .getExtraIdentities(extraIdentities)
        .then(
          (data) =>
            (this.extraIdentities = data.map((item, index) => {
              const identity = extraIdentities[index];

              return {
                identity,
                ...item[0],
              };
            })),
        )
        .catch((e) => console.error(e));
    },
    async fetchAdmins() {
      return await this.actor
        ?.fetchAdmins()
        .then((res) => (this.admins = res))
        .catch((e) => console.error(e));
    },
    async addAdmin(username) {
      return await this.actor?.addAdmin(username, {
        character: localStorage.extraCharacter,
        identity: process.env.DFX_ASSET_PRINCIPAL,
      });
    },
    async deleteAdmin(username) {
      return await this.actor?.deleteAdmin(username, {
        character: localStorage.extraCharacter,
        identity: process.env.DFX_ASSET_PRINCIPAL,
      });
    },
    getTitleByProvider() {
      const provider = localStorage.authenticationProvider;
      let title = INTERNET_IDENTITY_TITLE;

      if (externalWeb3IdentityProviders.indexOf(provider) !== -1) {
        title = localStorage.getItem('address');
      }

      if (provider === 'google') {
        title = this.getPrincipal;
      }

      return title.toString();
    },
    register({ username, fullName }) {
      return this.actor?.register(
        {
          username,
          fullName,
          title: [this.getTitleByProvider()],
          provider: localStorage.authenticationProvider,
          avatar: [],
          banner: [],
          forms_created: 0,
          extraIdentities: [],
        },
        {
          character: localStorage.extraCharacter,
          identity: process.env.DFX_ASSET_PRINCIPAL,
        },
      );
    },
    setAuthenticationStorage(isAuthenticated, provider = '', character = '') {
      if (isAuthenticated) {
        localStorage.isAuthenticated = isAuthenticated;
        localStorage.extraCharacter = character;
        localStorage.authenticationProvider = provider;
      } else if (!localStorage.socialProvider) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('extraCharacter');
        localStorage.removeItem('authenticationProvider');
        localStorage.removeItem('address');
      }
    },
    async setUser(user = null, extraIdentities = []) {
      if (user == null) {
        this.profile = null;
        this.user = null;
      } else {
        if (!user.title.length) {
          const title = this.getTitleByProvider();
          await this.actor.addTitle(title, {
            character: localStorage.extraCharacter,
            identity: process.env.DFX_ASSET_PRINCIPAL,
          });

          user.title = [title];
        }

        user.title = user.title[0];
        if (user.avatar.length) {
          user.avatarUri = await readFile(user.avatar[0]);
        } else {
          user.avatarUri = null;
        }

        if (user.banner.length) {
          user.bannerUri = await readFile(user.banner[0]);
        } else {
          user.bannerUri = null;
        }

        if (user.extraIdentities.length) {
          user.extraIdentities = user.extraIdentities[0];
        }

        if (extraIdentities.length) {
          this.extraIdentities = extraIdentities.map((item) => item[0]);
        }

        this.profile = user;
        this.user = user;
      }
    },
    async getProfile() {
      return await this.actor
        ?.me({
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        })
        .then(async ({ user }) => {
          await this.fetchExtraIdentities(user.extraIdentities ?? []);
          await this.setUser(user);
        });
    },
    async findUserByUsername(string) {
      return this.actor?.findUsername(string);
    },
    async findUser(principal, isLoginProcess = true) {
      let user = await this.actor?.findUser(principal);
      if (!user.length && isLoginProcess) {
        let userByIdentity = await this.actor?.findByExtraIdentity(principal);
        if (!!userByIdentity.length && [null, []].indexOf(userByIdentity[0]?.user) === -1) {
          user = userByIdentity[0].user;
          const identityUser = user[0];
          if (identityUser.provider === 'google') {
            localStorage.setItem('extraCharacter', identityUser.title[0]);
            await this.initWeb2Auth(identityUser.provider);
            this.setAuthenticationStorage(true, identityUser.provider, identityUser.title[0]);
          } else if (identityUser.provider === 'siwe') {
            await this.initSIWE(identityUser.title[0]);
          } else if (identityUser.provider === 'siws') {
            await this.initSIWS(identityUser.title[0]);
          } else {
            //
          }
          user[0].reload = true;
        }
      }

      return user;
    },
    async getUsers(list) {
      try {
        const users = await this.actor?.getUsers(list);

        this.usersList = await Promise.all(
          users.map(async (item) => {
            let user = item[0];
            let avatar = null;

            if (user?.avatar?.[0]) {
              try {
                avatar = await readFile(user.avatar[0]);
              } catch (e) {
                console.error(e);
              }
            }

            return {
              ...user,
              avatar,
            };
          }),
        );
      } catch (e) {
        console.error(e);
      }
    },
    async saveProfile(data) {
      return await this.actor?.updateMe(
        {
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        },
        {
          provider: localStorage.authenticationProvider,
          fullName: data.fullName,
          username: data.username,
          avatar: data.avatar,
          forms_created: data.forms_created,
          banner: data.banner,
        },
      );
    },
    async connectSocial(provider) {
      axiosService
        .get(`${process.env.API_URL}auth/redirect/${provider}`)
        .then((res) => {
          localStorage.socialProvider = provider;
          window.open(res.data.url, '_blank');
        })
        .catch((e) => console.error(e));
    },
    async generateWeb3WalletIdentity(principal, provider, address, connectorName = false) {
      const identity = generateIdentityFromPrincipal(principal);

      const agent = identity ? new HttpAgent({ identity }) : null;
      const actor = identity ? createActorFromIdentity(identity) : null;
      if (connectorName) {
        this.actor
          .addExtraIdentity(
            (await agent.getPrincipal()).toText(),
            provider,
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            address,
            connectorName,
          )
          .then(async () => await this.getProfile());
        return;
      }

      this.identity = identity;
      this.actor = actor;
      this.principal = this.identity ? await agent.getPrincipal() : null;
      this.isAuthenticated = true;

      this.setAuthenticationStorage(true, provider);
    },
    async removeExtraIdentity(provider) {
      await this.actor
        .deleteExtraIdentity(provider.identity, {
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        })
        .then(async () => await this.getProfile());
    },
  },
  getters: {
    getAdmins: ({ admins }) => admins,
    getStats: ({ stats }) => stats,
    getExtraIdentities: ({ extraIdentities }) => extraIdentities,
    getIdentity: ({ identity }) => identity,
    getPrincipal: ({ principal }) => localStorage.extraCharacter || principal?.toText() || null,
    getUser: ({ user }) => user,
    getProfileData: ({ profile }) => profile,
    getUsersList: ({ usersList }) => usersList,
    getAuthState: ({ isAuthenticated }) => isAuthenticated,
  },
});
