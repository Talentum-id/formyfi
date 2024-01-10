import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

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
    list: [],
    loaded: false,
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;
      this.actor = this.identity ? createActorFromIdentity(this.identity) : null;
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
  },
  getters: {
    getList: (state) => state.list,
    getLoadingStatus: (state) => state.loaded,
  },
});
