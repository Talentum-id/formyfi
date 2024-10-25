import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, user_index } from '~/user_index';
import router from '@/router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';
import { decodeCredential } from 'vue3-google-login';
import { useStatsStore } from '@/store/stats';
import axiosService from '@/services/axiosService';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal, readFile } from '@/util/helpers';
import { Ed25519KeyIdentity } from '@dfinity/identity';

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
      } else if (authenticationProvider === 'siwe') {
        await this.initSIWE();
      } else if (authenticationProvider === 'siws') {
        await this.initSIWS();
      } else {
        await this.initWeb2Auth();
      }

      if (this.isAuthenticated) {
        await this.findUser(this.getPrincipal)
          .then(async (res) => {
            await this.initStores();

            if (res.length) {
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
    async initSIWE() {
      const address = localStorage.getItem('address');

      if (address) {
        try {
          const { Ok: principal } = await ic_siwe_provider.get_principal(address);

          if (principal !== undefined) {
            await this.generateWeb3WalletIdentity(principal, 'siwe');
          }
        } catch (e) {
          console.error(e);

          await this.logout();
        }
      } else {
        await this.logout();
      }
    },
    async initSIWS() {
      const address = localStorage.getItem('address');

      if (address) {
        try {
          const { Ok: principal } = await ic_siws_provider.get_principal(address);

          if (principal !== undefined) {
            await this.generateWeb3WalletIdentity(principal, 'siws');
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
    async initII() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = authClient;

      const isAuthenticated = await authClient.isAuthenticated();
      const identity = isAuthenticated ? authClient.getIdentity() : null;
      const agent = identity ? new HttpAgent({ identity }) : null;
      console.log(identity);
      if (agent !== null) {
        await agent.syncTime();
      }

      const actor = identity ? createActorFromIdentity(identity) : null;
      const principal = identity ? await agent.getPrincipal() : null;

      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.actor = actor;
      this.principal = principal;
    },
    async initStores() {
      await useQAStore().init();
      await useResponseStore().init();
      await useStatsStore().init();
      console.log(5);
    },
    async loginWithII() {
      if (this.authClient === null) {
        await this.initII();
      }

      const authClient = toRaw(this.authClient);

      await authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated ? authClient.getIdentity() : null;

          const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

          this.actor = this.identity ? createActorFromIdentity(this.identity) : null;
          this.principal = this.identity ? await agent.getPrincipal() : null;

          this.setAuthenticationStorage(this.isAuthenticated, 'ii');

          await this.initStores();

          if (!this.isQuest) {
            await router.push('/sign-up');
          }
        },
      });
    },
    async loginWithGoogle(credential) {
      const { email } = decodeCredential(credential);

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
    async loginWithSIWE(address, signature) {
      try {
        const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

        await ic_siwe_provider.siwe_login(signature, address, new Uint8Array(sessionKey));

        const { Ok: principal } = await ic_siwe_provider.get_principal(address);

        await this.generateWeb3WalletIdentity(principal, 'siwe');

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
    async loginWithSIWS(address, signature) {
      try {
        const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

        await ic_siws_provider.siws_login(signature, address, new Uint8Array(sessionKey));

        const { Ok: principal } = await ic_siws_provider.get_principal(address);

        await this.generateWeb3WalletIdentity(principal, 'siws');

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

      await authClient?.logout();

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
    register({ username, fullName }) {
      const provider = localStorage.authenticationProvider;

      return this.actor?.register(
        { username, fullName, provider, avatar: [], banner: [], forms_created: 0 },
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
    async setUser(user = null) {
      if (user == null) {
        this.profile = null;
        this.user = null;
      } else {
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
        .then(async ({ user }) => await this.setUser(user));
    },
    async findUser(principal) {
      return this.actor?.findUser(principal);
    },
    async getUsers(list) {
      try {
        const users = await this.actor?.getUsers(list);

        this.usersList = await Promise.all(
          users.map(async ({ user, stats }) => {
            let avatar = null;
            let stat = stats[0] || null;

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
              forms_completed: Number(stat?.forms_completed || 0),
              forms_created: Number(stat?.forms_created || 0),
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
    async generateWeb3WalletIdentity(principal, provider) {
      const identity = generateIdentityFromPrincipal(principal);

      const agent = identity ? new HttpAgent({ identity }) : null;
      const actor = identity ? createActorFromIdentity(identity) : null;

      this.identity = identity;
      this.actor = actor;
      this.principal = this.identity ? await agent.getPrincipal() : null;
      this.isAuthenticated = true;
      console.log(this.identity);
      console.log(this.principal);
      this.setAuthenticationStorage(true, provider);
    },
    async setCustomUser(par) {
      this.identity = par.identity;
      this.actor = par.actor;

      this.isAuthenticated = true;
      this.setAuthenticationStorage(this.isAuthenticated, 'NFID');
      console.log(1321321);
      await this.initStores();
      await router.push('/sign-up');
    },
  },
  getters: {
    getAdmins: ({ admins }) => admins,
    getStats: ({ stats }) => stats,
    getIdentity: ({ identity }) => identity,
    getPrincipal: ({ principal }) => localStorage.extraCharacter || principal?.toText() || null,
    getUser: ({ user }) => user,
    getProfileData: ({ profile }) => profile,
    getUsersList: ({ usersList }) => usersList,
    getAuthState: (state) => state.isAuthenticated,
  },
});
