import { defineStore } from 'pinia';
import { createActor, nft_index } from '~/nft_index';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import router from '@/router';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';

const createActorFromIdentity = (identity) => {
  return createActor(process.env.CANISTER_ID_NFT_INDEX, {
    agentOptions: { identity },
  });
};

export const useCollectionsStore = defineStore('collections', {
  id: 'collections',
  state: () => ({
    actor: null,
    identity: null,
    collection: null,
    list: [],
    loaded: false,
    loadedCollection: false,
  }),
  actions: {
    async init() {
      const provider = localStorage.getItem('authenticationProvider');

      switch (provider) {
        case 'siwe':
        case 'siws':
          await this.initWithSIWSOrSIWE(provider);
          break;
        case 'plug':
          await this.initWithPlug();
          break;
        default:
          this.identity = useAuthStore().getIdentity;
          this.actor = this.identity ? createActorFromIdentity(this.identity) : nft_index;
      }
    },
    async initWithSIWSOrSIWE(provider) {
      const { Ok: principal } =
        provider === 'siwe'
          ? await ic_siwe_provider.get_principal(localStorage.getItem('address'))
          : await ic_siws_provider.get_principal(localStorage.getItem('address'));

      if (principal !== undefined) {
        const identity = generateIdentityFromPrincipal(principal);
        const actor = identity ? createActorFromIdentity(identity) : null;

        this.identity = identity;
        this.actor = actor;
      }
    },
    async initWithPlug() {
      const plug = window?.ic?.plug;
      if (plug?.agent === undefined) {
        await useAuthStore().logout();
      }

      const principal = await plug?.agent.getPrincipal();
      const identity = generateIdentityFromPrincipal(principal);
      this.actor = createActorFromIdentity(identity);
      this.identity = identity;
    },
    async createCollection(params) {
      return await this.actor?.createCollection(params, {
        identity: process.env.DFX_ASSET_PRINCIPAL,
        character: localStorage.extraCharacter,
      });
    },
    async getCollections(params) {
      let identity = useAuthStore().getPrincipal;
      return await this.actor
        ?.getList({ ...params, identity: identity })
        .then(async (res) => {
          this.list = res;
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
    async getNft(nft_id) {
      return await this.actor?.getCollection(nft_id);
    },
    async checkIdentityNftRelation(nft_id) {
      return await this.actor?.checkIdentityNftRelation(useAuthStore().getPrincipal, nft_id);
    },
    async storeIdentityNftRelation(params) {
      return await this.actor?.storeIdentityNftRelation(
        { ...params, identity: useAuthStore().getPrincipal },
        { character: localStorage.extraCharacter, identity: process.env.DFX_ASSET_PRINCIPAL, },
      );
    },
    async fetchCollection(contractAddress) {
      this.loadedCollection = false;
      await this.actor
        ?.show(contractAddress)
        .then(async (res) => {
          const arr = res.map((item) => {
            const { quest } = item;

            return {
              ...quest,
              questions: quest.questions.map((question) => {
                let parameters = {};

                if (question.parameters.length > 0) {
                  parameters = JSON.parse(question.parameters[0]);
                }

                return {
                  ...question,
                  points: Number(question.points),
                  parameters,
                };
              }),
              end: Number(quest.end),
              start: Number(quest.start),
              participants: Number(quest.participants),
              owner: item.owner,
              thxMessage: quest.thxMessage[0] || null,
            };
          });

          if (!arr.length) {
            await router.push('/');
          } else {
            await useResponseStore().fetchResponse(arr?.[0].shareLink);

            this.collection = arr?.[0];
          }
        })
        .catch((e) => {
          console.error(e);

          router.push('/');
        })
        .finally(() => (this.loadedCollection = true));
    },
  },
  getters: {
    getList: (state) => state.list,
    getCollection: (state) => state.collection,
    getLoadingStatusList: (state) => state.loaded,
    getLoadingStatusCollection: (state) => state.loadedCollection,
  },
});
