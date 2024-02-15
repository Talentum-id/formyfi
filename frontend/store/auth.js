import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, user_index } from '~/user_index';
import router from '@/router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useAssetsStore } from './assets';
import { useQAStore } from './qa';
import { useResponseStore } from '@/store/response';
import { decodeCredential } from 'vue3-google-login';

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
    };
  },
  actions: {
    async init() {
      if (localStorage.extraCharacter !== '' && localStorage.extraCharacter !== undefined) {
        await this.initWeb2Auth();
      } else {
        await this.initII();
      }

      if (this.isAuthenticated) {
        await this.actor
          .findUser(this.principal)
          .then(async (res) => {
            if (res.length) {
              this.setUser(res[0]);
              localStorage.isAuthenticated = true;

              await this.initStores();
            } else {
              this.isAuthenticated = false;

              localStorage.removeItem('extraCharacter');
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
    async initWeb2Auth() {
      this.actor = user_index;

      this.isAuthenticated = true;
      this.principal = localStorage.extraCharacter;

      await this.initStores();
    },
    async initII() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);

      this.authClient = authClient;
      localStorage.extraCharacter = '';

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
      await useAssetsStore().init();
      await useResponseStore().init();
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

          localStorage.extraCharacter = '';
          localStorage.isAuthenticated = true;

          await this.initStores();

          await router.push('/sign-up');
        },
      });
    },
    async loginWithGoogle(credential) {
      const { email } = decodeCredential(credential);

      this.actor = user_index;

      this.principal = localStorage.extraCharacter = email;
      this.isAuthenticated = localStorage.isAuthenticated = true;

      await this.initStores();

      await router.push('/sign-up');
    },
    async logout() {
      const authClient = toRaw(this.authClient);

      await authClient?.logout();

      localStorage.removeItem('extraCharacter');
      localStorage.removeItem('isAuthenticated');

      this.isAuthenticated = false;
      this.identity = this.actor = this.principal = null;

      this.setUser();

      await router.push('/login');
    },
    register({ username, fullName }) {
      return this.actor.register({ username, fullName }, {
        identity: process.env.DFX_ASSET_PRINCIPAL,
        character: localStorage.extraCharacter,
      });
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
    getIdentity: ({ identity }) => identity,
    getPrincipal: ({ principal }) => localStorage.extraCharacter || principal?.toText() || null,
    getUser: ({ user }) => user,
  },
});
