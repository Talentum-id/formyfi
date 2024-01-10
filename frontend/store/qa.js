import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import router from '../router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';
import { AuthClient } from '@dfinity/auth-client';

function createActorFromIdentity(identity) {
  return createActor(process.env.QA_INDEX_CANISTER_ID, {
    agent: new HttpAgent({ identity }),
  });
}

export const useQAStore = defineStore('qa', {
  id: 'qa',
  state: () => ({
    actor: null,
    qa: null,
    authClient: null,
    isReady: false,
    isAuthenticated: false,
    identity: null,
    list: [],
    loaded: false,
  }),
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

        await this.actor
          .findUser()
          .then((res) => {
            if (res.length) {
              this.setUser(res[0]);
            }
          })
          .catch((err) => this.logout());
      } else {
        sessionStorage.removeItem('isAuthenticated');
      }

      this.isReady = true;
    },
    async storeQA(params) {
      if (!this.actor) {
        this.actor = createActorFromIdentity(useAuthStore().identity);
      }

      await this.actor
        .store(params)
        .then(() => {
          this.qa = params;
        })
        .catch((e) => {
          console.error(e);
          throw new e();
        });
    },
    async getQAs(params) {
      this.loaded = false;
      if (!this.actor) {
        this.actor = createActorFromIdentity(useAuthStore().identity);
      }

      await this.actor
        .list(params)
        .then((res) => {
          this.list = res;
          this.loaded = true;
        })
        .catch((e) => {
          console.error(e);
          this.loaded = true;
        });
    },
  },
  getters: {
    getList: (state) => state.list,
    getLoadingStatus: (state) => state.loaded,
  },
});
