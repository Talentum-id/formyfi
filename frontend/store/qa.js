import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

function createActorFromIdentity(agent) {
  return createActor(process.env.QA_INDEX_CANISTER_ID, { agent });
}

export const useQAStore = defineStore('qa', {
  id: 'qa',
  state: () => ({
    actor: null,
    identity: null,
    qa: null,
    list: [],
    loaded: false,
    principal: null,
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

      this.actor = this.identity ? createActorFromIdentity(agent) : null;
      this.principal = agent ? await agent.getPrincipal() : null;
    },
    async storeQA(params) {
      return await this.actor.store(params);
    },

    async getQAs(params) {
      this.loaded = false;

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
    async fetchQA(link) {
      this.loaded = false;

      await this.actor
        .show(link)
        .then((res) => {
          this.qa = res;
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
    getQA: (state) => state.qa,
    getLoadingStatus: (state) => state.loaded,
  },
});
