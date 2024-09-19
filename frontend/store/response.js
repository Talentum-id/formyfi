import { defineStore } from 'pinia';
import { createActor, response_index } from '~/response_index';
import { useAuthStore } from '@/store/auth';
import { useCounterStore } from '@/store/index';
import { externalWeb3IdentityProviders } from '@/constants/externalIdentityProviders';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider} from '~/ic_siws_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';
import axiosService from '@/service/axiosService';

const createActorFromIdentity = identity => {
  return createActor(process.env.RESPONSE_INDEX_CANISTER_ID, {
    agentOptions: { identity },
  });
};

export const useResponseStore = defineStore('response', {
  id: 'response',
  state: () => ({
    actor: null,
    identity: null,
    response: [],
    myList: [],
    loadedList: false,
    qaResponses: [],
  }),
  actions: {
    async init() {
      const provider = localStorage.getItem('authenticationProvider');

      if (externalWeb3IdentityProviders.indexOf(provider) !== -1) {
        const { Ok: principal } = provider === 'siwe'
          ? await ic_siwe_provider.get_principal(localStorage.getItem('address'))
          : await ic_siws_provider.get_principal(localStorage.getItem('address'));

        if (principal !== undefined) {
          const identity = generateIdentityFromPrincipal(principal);
          const actor = identity ? createActorFromIdentity(identity) : null;

          this.identity = identity;
          this.actor = actor;
        }
      } else {
        this.identity = useAuthStore().getIdentity;
        this.actor = this.identity ? createActorFromIdentity(this.identity) : response_index;
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
          return res;
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
    async getMyResponses(params) {
      await this.actor
        ?.listQas(params.identity, params)
        .then((res) => {
          this.loadedList = true;
          this.myList = res;
        })
        .catch((e) => {
          this.loadedList = true;
          console.error(e);
        });
    },
    async getFullResponses(params) {
      return await this.actor
        ?.listQas(params.identity, params)
        .then(async (res) => {
          return res;
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
    async deleteResponsesByShareLink(shareLink) {
      return await this.actor
        ?.deleteByShareLink(shareLink)
        .then(async res => {
          if (res.length) {
            let paths = [];

            for (const path in res) {
              paths.push(path)
            }

            await axiosService.post(`${process.env.API_URL}delete-files`, { paths })
              .catch(e => console.error(e));
          }
        })
        .catch((e) => console.error(e));
    },
  },
  getters: {
    getResponse: (state) => state.response,
    getMyResponseList: (state) => state.myList,
    getLoadingStatus: (state) => state.loadedList,
  },
});
