import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import router from '../router';
import { toRaw } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

function createActorFromIdentity(identity) {
  return createActor(process.env.QA_INDEX_CANISTER_ID, {
    agent: new HttpAgent({ identity }),
  });
}

export const useQAStore = defineStore('qa', {
  id: 'qa',
  state: () => {
    return {
      actor: null,
      qa: null,
    };
  },
  actions: {
    async storeQA(params) {
      if (!this.actor) {
        this.actor = createActorFromIdentity(useAuthStore().identity);
      }
      await this.actor
        .store(params)
        .then(() => {
          this.qa = params;
        })
        .catch((e) => console.error(e));
    },
  },
  getters: {},
});
