import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '~/user_index';
import router from '../router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useAssetsStore } from './assets';
import { useQAStore } from './qa';

function createActorFromIdentity(identity) {
  return createActor(process.env.USER_INDEX_CANISTER_ID, {
    agent: new HttpAgent({ identity }),
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
      user: null,
    };
  },
  actions: {
    async init() {
      const authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
        },
      });

      this.authClient = authClient;

      this.isAuthenticated = await authClient.isAuthenticated();
      this.identity = this.isAuthenticated ? authClient.getIdentity() : null;
      this.actor = this.identity ? createActorFromIdentity(this.identity) : null;

      if (this.isAuthenticated) {
        await this.actor
          .findUser()
          .then(async (res) => {
            if (res.length) {
              this.setUser(res[0]);
              sessionStorage.isAuthenticated = true;

              await useQAStore().init();
              await useAssetsStore().init();
            } else {
              sessionStorage.removeItem('isAuthenticated');

              router.push('/login');
            }
          })
          .catch(() => this.logout());
      } else {
        router.push('/login');
      }

      this.isReady = true;
    },
    async loginWithII() {
      const authClient = toRaw(this.authClient);

      await authClient.login({
        identityProvider: process.env.II_URI,
        onSuccess: async () => {
          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated ? authClient.getIdentity() : null;
          this.actor = this.identity ? createActorFromIdentity(this.identity) : null;

          await useQAStore().init();
          await useAssetsStore().init();

          sessionStorage.isAuthenticated = true;

          await router.push('/sign-up');
        },
      });
    },
    async logout() {
      await this.authClient.logout();
      sessionStorage.removeItem('isAuthenticated');

      this.isAuthenticated = false;
      this.identity = this.actor = null;

      this.setUser();

      await router.push('/login');
    },
    setUser(user = null) {
      if (user == null) {
        this.user = null;
      } else {
        const { username, fullName } = user;

        this.user = { username, fullName };
      }
    },
  },
  getters: {
    getUser: ({ user }) => user,
    getIdentity: ({ identity }) => identity,
  },
});
