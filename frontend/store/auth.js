import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '~/user';
import router from '../router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';

function createActorFromIdentity(identity) {
  return createActor(process.env.USER_CANISTER_ID, {
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
        sessionStorage.isAuthenticated = true;
      } else {
        sessionStorage.removeItem('isAuthenticated');
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

      await router.push('/login');
    },
  },
});
