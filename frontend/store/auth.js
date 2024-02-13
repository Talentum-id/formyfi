import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '~/user_index';
import router from '@/router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useAssetsStore } from './assets';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: process.env.II_URI,
    maxTimeToLive: 10 * 24 * 3600000000000,
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
    };
  },
  actions: {
    async init() {
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

      if (isAuthenticated) {
        await actor
          .findUser(principal.toText())
          .then(async (res) => {
            if (res.length) {
              this.setUser(res[0]);
              localStorage.isAuthenticated = true;

              await useQAStore().init();
              await useAssetsStore().init();
              await useResponseStore().init();
            } else {
              localStorage.removeItem('isAuthenticated');

              await router.push('/login');
            }
          })
          .catch(() => this.logout());
      } else {
        await router.push('/login');
      }

      this.isReady = true;
    },
    async loginWithII() {
      const authClient = toRaw(this.authClient);

      await authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated ? authClient.getIdentity() : null;

          const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

          this.actor = this.identity ? createActorFromIdentity(this.identity) : null;
          this.principal = this.identity ? await agent.getPrincipal() : null;

          await useQAStore().init();
          await useAssetsStore().init();
          await useResponseStore().init();

          localStorage.isAuthenticated = true;

          await router.push('/sign-up');
        },
      });
    },
    async logout() {
      const authClient = toRaw(this.authClient);

      await authClient?.logout();

      localStorage.removeItem('isAuthenticated');

      this.isAuthenticated = false;
      this.identity = this.actor = this.principal = null;

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
