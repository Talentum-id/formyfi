import router from '@/router';
import axiosService from '@/services/axiosService';
import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, user_index } from '~/user_index';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';
import { useStatsStore } from '@/store/stats';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal, readFile, shortenAddress } from '@/util/helpers';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { useCollectionsStore } from '@/store/collections';
import { ic_sis_provider } from '~/ic_sis_provider';

const WHITELIST = [
  process.env.CANISTER_ID_USER_INDEX,
  process.env.CANISTER_ID_FORM_INDEX,
  process.env.CANISTER_ID_SUBMISSIONS_INDEX,
  process.env.CANISTER_ID_METRICS_INDEX,
];
const HOST = process.env.DFX_NETWORK === 'local' ? window.location.origin : 'https://ic0.app';
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
      } else {
        switch (authenticationProvider) {
          case 'siwe':
            await this.initSIWE();
            break;
          case 'siws':
            await this.initSIWS();
            break;
          case 'sis':
            await this.initSIS();
            break;
          case 'plug':
            await this.initPlug();
            break;
          default:
            await this.initWeb2Auth();
        }
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
          .catch(async (e) => {
            console.error(e);
            await this.logout();
          });
      } else {
        if (!this.isQuest && router.currentRoute.value.path !== '/login') {
          await router.push('/login');
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
    async initSIS(walletAddress = null) {
      const address = walletAddress ?? localStorage.getItem('address');

      if (address) {
        if (walletAddress !== null) {
          localStorage.setItem('address', walletAddress);
        }

        try {
          const { Ok: principal } = await ic_sis_provider.get_principal(address);

          if (principal !== undefined) {
            await this.generateWeb3WalletIdentity(principal, 'siws', address);
          } else {
            this.initWeb2Auth();
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
      const principal = localStorage.getItem('extraCharacter');
      if (!principal || isProfile) {
        const authClient = await AuthClient.create(defaultOptions.createOptions);
        this.authClient = authClient;

        const isAuthenticated = await authClient.isAuthenticated();
        const identity = isAuthenticated ? authClient.getIdentity() : null;

        if ((isProfile && isAuthenticated) || !isProfile) {
          await this.initIdentityDependencies(identity, isAuthenticated, isProfile);
        }
      } else {
        this.isAuthenticated = true;
        this.identity = null;
        this.actor = user_index;
        this.setAuthenticationStorage(true, 'ii', principal);
      }
    },
    async initPlug() {
      const plug = window?.ic?.plug;
      const connected = await plug?.isConnected();

      if (plug === undefined) {
        await this.logout();
      }

      if (!connected) {
        await plug.requestConnect({
          whitelist: WHITELIST,
          host: HOST,
        });
      }

      if (plug?.agent === undefined) {
        await this.logout();
      }

      const principal = await plug?.agent.getPrincipal();
      const identity = generateIdentityFromPrincipal(principal);
      this.actor = createActorFromIdentity(identity);
      this.identity = identity;
      this.principal = identity.getPrincipal();
      this.isAuthenticated = !this.principal.isAnonymous();

      this.setAuthenticationStorage(this.isAuthenticated, 'plug');
    },
    async initIdentityDependencies(identity, isAuthenticated, isProfile = false) {
      const agent = identity ? new HttpAgent({ identity }) : null;
      await agent?.syncTime();

      if (isProfile) {
        const principal = (await agent.getPrincipal()).toText();
        await this.actor
          .addExtraIdentity(
            principal,
            'ii',
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            shortenAddress(principal),
            'ii',
          )
          .then(async () => await this.getProfile())
          .catch((e) => {
            console.error(e);
            throw e;
          });

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
      await useCollectionsStore().init();
    },
    async loginWithII(isProfile = false) {
      if (this.authClient === null) {
        await this.initII(isProfile);
      }

      const authClient = toRaw(this.authClient);

      return new Promise((resolve, reject) => {
        authClient.login({
          ...defaultOptions.loginOptions,
          onSuccess: async () => {
            try {
              const isAuthenticated = await authClient.isAuthenticated();
              const identity = isAuthenticated ? authClient.getIdentity() : null;

              await this.initIdentityDependencies(identity, isAuthenticated, isProfile);

              if (isProfile) {
                await authClient.logout();
                resolve(true);
                return;
              }

              this.setAuthenticationStorage(this.isAuthenticated, 'ii');
              await this.initStores();

              if (!this.isQuest) {
                await router.push('/sign-up');
              }

              resolve(true);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            reject(error);
            return false;
          },
        });
      });
    },
    async loginWithPlug() {
      try {
        const plug = window?.ic?.plug;
        if (plug === undefined) {
          throw new Error('Plug wallet extension not installed');
        }

        const result = await plug.requestConnect({
          whitelist: WHITELIST,
          host: HOST,
        });

        if (result) {
          localStorage.connector = 'plug';
          await this.initPlug();
          if (this.isAuthenticated) {
            await this.initStores();

            if (!this.isQuest) {
              await router.push('/sign-up');
            }
          } else {
            await this.logout();
          }
        } else {
          await this.logout();
        }
      }
      catch (e) {
        console.error(e);
        await this.logout();
      }
    },
    async loginWithGoogle(email, address = null, isProfile = false) {
      if (isProfile) {
        await this.actor
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

      localStorage.setItem('connector', 'google');
      localStorage.setItem('zkLoginAddress', address);
      this.setAuthenticationStorage(true, 'google', email);

      this.principal = localStorage.extraCharacter;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      if (!this.isQuest) {
        await router.push('/sign-up');
      }
    },
    async loginWithSui(address, provider, isProfile = false) {
      if (isProfile) {
        await this.actor
          .addExtraIdentity(
            address,
            provider,
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            address,
            provider,
          )
          .then(async () => {
            await this.getProfile();
          });
        return;
      }
      this.actor = user_index;

      this.setAuthenticationStorage(true, provider, address);

      this.principal = localStorage.extraCharacter;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      if (!this.isQuest) {
        await router.push('/sign-up');
      }
    },
    async loginWithWeb2(id, nickname, provider, isProfile = false) {
      if (isProfile) {
        await this.actor
          .addExtraIdentity(
            id,
            provider,
            {
              identity: process.env.DFX_ASSET_PRINCIPAL,
              character: localStorage.extraCharacter,
            },
            nickname,
            provider,
          )
          .then(async () => {
            await this.getProfile();
          });
        return;
      }
      this.actor = user_index;

      this.setAuthenticationStorage(true, provider, id);

      this.principal = localStorage.extraCharacter;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      if (!this.isQuest) {
        await router.push('/sign-up');
      }
    },
    async prepareSISLogin(address) {
      const data = await ic_sis_provider.sis_prepare_login(address);

      return data?.Ok || null;
    },
    async loginWithSIS(address, signature, nonce, provider, connectorName = false) {
      try {
        const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

        await ic_sis_provider.sis_login(signature, address, new Uint8Array(sessionKey), nonce);
        const { Ok: principal } = await ic_sis_provider.get_principal(address);

        if (principal) {
          await this.generateWeb3WalletIdentity(principal, 'sis', address, connectorName);
        } else {
          await this.loginWithSui(address, provider)
        }

        if (connectorName) return;

        localStorage.setItem('address', address);

        await this.initStores();

        if (!this.isQuest) {
          await router.push('/sign-up');
        }
      } catch (e) {
        console.error(e);
        throw e;
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
        throw e;
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
        throw e;
      }
    },
    async logout() {
      const authClient = toRaw(this.authClient);
      await authClient?.logout();
      await window?.ic?.plug?.disconnect();

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
      switch (localStorage.authenticationProvider) {
        case 'siwe':
        case 'siws':
        case 'sis':
          return localStorage.getItem('address');
        case 'plug':
          return window.ic?.plug?.accountId;
        case 'google':
          return this.getPrincipal.toString();
        case 'sui':
        case 'suiet':
          return localStorage.getItem('globalAddress');
        case 'twitter':
        case 'discord':
          return localStorage.socialInfo;
        default:
          return shortenAddress(this.getPrincipal);
      }
    },
    register({ username, fullName }) {
      const zkLoginAddress = localStorage.getItem('zkLoginAddress');

      return this.actor
        ?.register(
          {
            username,
            fullName,
            connector: [localStorage.connector],
            title: [this.getTitleByProvider()],
            provider: localStorage.authenticationProvider,
            avatar: [],
            banner: [],
            forms_created: 0,
            extraIdentities: [],
            zkLoginAddress: zkLoginAddress ? [zkLoginAddress] : [],
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
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('indirectInternetIdentity');
        localStorage.removeItem('extraCharacter');
        localStorage.removeItem('authenticationProvider');
        localStorage.removeItem('address');
        localStorage.removeItem('connector');
        localStorage.removeItem('socialSignIn');
        localStorage.removeItem('globalAddress');
        localStorage.removeItem('socialInfo');
        localStorage.removeItem('zkLoginAddress');
      }
    },
    async setUser(user = null, extraIdentities = []) {
      if (user == null) {
        this.profile = null;
        this.user = null;
      } else {
        if (!user.connector.length) {
          if (localStorage.connector === undefined) {
            await this.logout();
          }

          await this.actor.addConnector(localStorage.connector, {
            character: localStorage.extraCharacter,
            identity: process.env.DFX_ASSET_PRINCIPAL,
          });
          user.connector = [localStorage.connector];
        }

        if (user.provider === 'ii' || !user.title.length) {
          const title = this.getTitleByProvider();
          await this.actor.addTitle(title, {
            character: localStorage.extraCharacter,
            identity: process.env.DFX_ASSET_PRINCIPAL,
          });

          user.title = [title];
        }

        user.title = user.title[0];
        user.connector = user.connector[0];
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
            localStorage.setItem('connector', 'google');
            await this.initWeb2Auth(identityUser.provider);
            this.setAuthenticationStorage(true, identityUser.provider, identityUser.title[0]);
          } else if (identityUser.provider === 'siwe') {
            localStorage.setItem('connector', identityUser.connector[0]);
            await this.initSIWE(identityUser.title[0]);
          } else if (identityUser.provider === 'siws') {
            localStorage.setItem('connector', 'siws');
            await this.initSIWS(identityUser.title[0]);
          } else if (identityUser.provider === 'twitter') {
            localStorage.setItem('extraCharacter', identityUser.title[0]);
            localStorage.setItem('connector', 'twitter');
            localStorage.setItem('authenticationProvider', 'twitter')
            await this.initWeb2Auth();
          } else if (identityUser.provider === 'discord') {
            localStorage.setItem('extraCharacter', identityUser.title[0]);
            localStorage.setItem('connector', 'discord');
            localStorage.setItem('authenticationProvider', 'discord')
            await this.initWeb2Auth();
          } else if (identityUser.provider === 'suiet' || identityUser.provider === 'sui') {
            localStorage.setItem('extraCharacter', identityUser.title[0]);
            localStorage.setItem('globalAddress', identityUser.title[0]);
            localStorage.setItem('connector', identityUser.provider);
            localStorage.setItem('authenticationProvider', identityUser.provider);
            await this.initWeb2Auth();
          } else {
            localStorage.setItem('connector', 'ii');
            localStorage.setItem('extraCharacter', userByIdentity[0].identity);
            await this.initII();
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
          extraIdentities: [data.extraIdentities],
          title: [data.title],
          connector: [data.connector],
          zkLoginAddress: data.zkLoginAddress,
        },
      );
    },
    async connectSocial(provider, isLogin = false) {
      axiosService
        .get(`${process.env.API_URL}auth/redirect/${provider}`)
        .then((res) => {
          localStorage.socialProvider = provider;
          window.open(res.data.url, isLogin ? '_self' : '_blank');
          if (isLogin) {
            localStorage.socialSignIn = true;
          }
        })
        .catch((e) => console.error(e));
    },
    async generateWeb3WalletIdentity(principal, provider, address, connectorName = false) {
      const identity = generateIdentityFromPrincipal(principal);

      const agent = identity ? new HttpAgent({ identity }) : null;
      const actor = identity ? createActorFromIdentity(identity) : null;
      if (connectorName) {
        await this.actor
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
    async deleteAccount() {
      await this.actor.deleteIdentity({
        identity: process.env.DFX_ASSET_PRINCIPAL,
        character: localStorage.extraCharacter,
      }).then(async () => await this.logout());
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
