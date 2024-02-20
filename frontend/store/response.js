import { defineStore } from 'pinia';
import { createActor, response_index } from '~/response_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';
import { useCounterStore } from '@/store/index';

function createActorFromIdentity(agent) {
  return createActor(process.env.RESPONSE_INDEX_CANISTER_ID, { agent });
}

export const useResponseStore = defineStore('response', {
  id: 'response',
  state: () => ({
    actor: null,
    identity: null,
    response: [],
    loadedList: false,
    qaResponses: [],
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      if (this.identity) {
        this.actor = createActorFromIdentity(new HttpAgent({ identity: this.identity }));
      } else {
        this.actor = response_index;
      }
    },
    async storeResponse(params) {
      await this.actor?.store(params, {
        identity: process.env.DFX_ASSET_PRINCIPAL,
        character: localStorage.extraCharacter,
      });

      await this.fetchResponse(params.shareLink);
    },
    async getQAResponses(shareLink, params) {
      this.loadedList = false;
      await this.actor
        ?.list(shareLink, params)
        .then((res) => (this.qaResponses = res))
        .catch((e) => console.error(e))
        .finally(() => (this.loadedList = true));
    },
    async fetchResponse(shareLink, identity = null) {
      if (identity == null) {
        identity = useAuthStore().getPrincipal;
      }

      this.loaded = false;

      await this.actor
        ?.show({ identity, shareLink })
        .then((res) => {
          this.response = res;
          useCounterStore().setValue(this.response.length);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => (this.loaded = true));
    },
    async getExportResponses(shareLink) {
      return await this.actor
        ?.export(shareLink, {
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        })
        .then((res) => {
          console.log(res);
          return res;
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
  },
  getters: {
    getResponse: (state) => state.response,
    getLoadingStatus: (state) => state.loadedList,
  },
});
