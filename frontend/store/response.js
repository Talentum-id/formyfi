import { defineStore } from 'pinia';
import { createActor } from '~/response_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

function createActorFromIdentity(agent) {
  return createActor(process.env.RESPONSE_INDEX_CANISTER_ID, { agent });
}

export const useResponseStore = defineStore('response', {
  id: 'response',
  state: () => ({
    actor: null,
    identity: null,
    response: [],
    qaResponses: [],
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

      this.actor = this.identity ? createActorFromIdentity(agent) : null;
    },
    async storeResponse(params) {
      console.log(params);
      await this.actor.store(params);
      this.fetchResponse(params.shareLink);
    },
    async getQAResponses(shareLink) {
      console.log(shareLink);
      await this.actor
        .list(shareLink)
        .then((res) => (this.qaResponses = res))
        .catch((e) => console.log(e));
    },
    async fetchResponse(shareLink) {
      const identity = useAuthStore().principal.toText();
      this.loaded = false;

      await this.actor
        .show({ identity, shareLink })
        .then((res) => {
          this.response = res.answers;
          this.loaded = true;
        })
        .catch((e) => {
          console.error(e);
          this.loaded = true;
        });
    },
  },
  getters: {
    getResponse: (state) => state.response.length,
    getLoadingStatus: (state) => state.loaded,
  },
});
