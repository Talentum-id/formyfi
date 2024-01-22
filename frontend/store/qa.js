import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';

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
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

      this.actor = this.identity ? createActorFromIdentity(agent) : null;
    },
    async storeQA(params) {
      return await this.actor.store(params);
    },
    async getQAs(params) {
      this.loaded = false;

      await this.actor
        .list(params)
        .then(async (res) => {
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
        .then(async (res) => {
          const arr = res.map((item) => {
            return {
              ...item,
              end: Number(item.end),
              start: Number(item.start),
              participants: Number(item.participants),
            };
          });
          await useResponseStore().fetchResponse(arr[0].shareLink);
          this.qa = arr[0];
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
