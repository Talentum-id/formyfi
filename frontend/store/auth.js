import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, user_index } from '~/user_index';
import router from '@/router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useUserStorageStore } from './user-storage';
import { useResponseStorageStore } from './response-storage';
import { useQaStorageStore } from './qa-storage';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';
import { decodeCredential } from 'vue3-google-login';
import { useStatsStore } from '@/store/stats';
import axiosService from '@/service/axiosService';

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

function createActorFromIdentity(identity) {
  return createActor(process.env.USER_INDEX_CANISTER_ID, {
    agentOptions: {
      identity,
    },
  });
}

export const useAuthStore = defineStore('auth', {
  id: 'auth',
  state: () => {
    return {
      actor: null,
      authClient: null,
      isReady: false,
      isAuthenticated: false,
      identity: null,
      principal: null,
      user: null,
      isQuest: false,
      profile: null,
      usersList: null,
    };
  },
  actions: {
    async init() {
      if (
        localStorage.authenticationProvider !== '' &&
        localStorage.authenticationProvider !== undefined
      ) {
        await this.initWeb2Auth();
      } else {
        await this.initII();
      }

      if (this.isAuthenticated) {
        await this.actor
          ?.findUser(this.getPrincipal)
          .then(async (res) => {
           await this.initStorageStores();

            if (res.length) {
              await this.setUser(res[0]);
            } else {
              this.isAuthenticated = false;

              this.setAuthenticationStorage(false);

              await this.initStores();

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
          await this.initStorageStores();
          await this.initStores();
        }
      }

      this.isReady = true;
    },
    async initWeb2Auth() {
      this.actor = user_index;

      await this.initStorageStores();
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
    },
    async initStorageStores() {
      await useUserStorageStore().init();
      await useQaStorageStore().init();
      await useResponseStorageStore().init();
    },
    async loginWithII() {
      if (this.authClient === null) {
        await this.initII();
      }

      const authClient = toRaw(this.authClient);

      await authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          await this.initStorageStores();

          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated ? authClient.getIdentity() : null;

          const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

          this.actor = this.identity ? createActorFromIdentity(this.identity) : null;
          this.principal = this.identity ? await agent.getPrincipal() : null;

          this.setAuthenticationStorage(this.isAuthenticated);

          await this.initStores();

          if (!this.isQuest) {
            await router.push('/sign-up');
          }
        },
      });
    },
    async loginWithGoogle(credential) {
      const { email } = decodeCredential(credential);

      await this.initStorageStores();

      this.actor = user_index;

      this.setAuthenticationStorage(true, 'google', email);

      this.principal = localStorage.extraCharacter;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      if (!this.isQuest) {
        await router.push('/sign-up');
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
      }
    },
    async setUser(user = null) {
      if (user == null) {
        this.profile = null;
        this.user = null;
      } else {
        if (user.avatar.length) {
          await useUserStorageStore()
            .getFile(user.avatar[0])
            .then(res => user.avatarUri = res)
            .catch(error => {
              console.error(error);

              user.avatarUri = null;
            });
        } else {
          user.avatarUri = null
        }

        if (user.banner.length) {
          await useUserStorageStore()
            .getFile(user.banner[0])
            .then(res => user.bannerUri = res)
            .catch(() => user.bannerUri = null);
        } else {
          user.bannerUri = null
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
    async getUsers(list) {
      try {
        const users = await this.actor?.getUsers(list);

        this.usersList = await Promise.all(
          users.map(async (item) => {
            let user = item[0];
            let avatar = null;

            if (user?.avatar?.[0]) {
              try {
                avatar = await useQaStorageStore().getFile(user.avatar[0]);
              } catch (e) {
                console.error(e);
              }
            }

            return {
              fullName: user.fullName,
              username: user.username,
              avatar: avatar,
            };
          }),
        );
      } catch (e) {
        console.error(e);
      }
    },

    async saveProfile(data) {
      return await this.actor
        ?.updateMe(
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
  },
  getters: {
    getIdentity: ({ identity }) => identity,
    getPrincipal: ({ principal }) => localStorage.extraCharacter || principal?.toText() || null,
    getUser: ({ user }) => user,
    getProfileData: ({ profile }) => profile,
    getUsersList: ({ usersList }) => usersList,
  },
});
