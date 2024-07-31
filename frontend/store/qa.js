import { defineStore } from 'pinia';
import { createActor, qa_index } from '~/qa_index';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import { useQaStorageStore } from '@/store/qa-storage';
import router from '@/router';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';
import { externalWeb3IdentityProviders } from '@/constants/externalIdentityProviders';

const createActorFromIdentity = identity => {
  return createActor(process.env.QA_INDEX_CANISTER_ID, {
    agentOptions: { identity },
  });
};

export const useQAStore = defineStore('qa', {
  id: 'qa',
  state: () => ({
    actor: null,
    identity: null,
    qa: null,
    list: [],
    loaded: false,
    loadedQA: false,
  }),
  actions: {
    async init() {
      const provider = localStorage.getItem('authenticationProvider');

      if (externalWeb3IdentityProviders.indexOf(provider) !== -1) {
        const { Ok: principal } = await ic_siwe_provider.get_principal(localStorage.getItem('address'));

        if (principal !== undefined) {
          const identity = generateIdentityFromPrincipal(principal);
          const actor = identity ? createActorFromIdentity(identity) : null;

          this.identity = identity;
          this.actor = actor;
        }
      } else {
        this.identity = useAuthStore().getIdentity;
        this.actor = this.identity ? createActorFromIdentity(this.identity) : qa_index;
      }
    },
    async storeQA(params) {
      return await this.actor?.store(params, {
        identity: process.env.DFX_ASSET_PRINCIPAL,
        character: localStorage.extraCharacter,
      });
    },
    async removeQuest({ image, shareLink, questions }) {
      await this.actor
        ?.delete(shareLink, {
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        })
        .then(async () => {
          const batch = useQaStorageStore().assetManager.batch();

          await batch.delete(image);
          await batch.delete(`/assets/${shareLink}`);

          await Promise.all(
            questions.map(async (question) => {
              if (question.file) {
                await batch.delete(question.file);
              }
            }),
          );

          await batch.commit();
        });
    },
    async getQAs(params) {
      this.loaded = false;

      await this.actor
        ?.list(params)
        .then(async (res) => {
          this.list = res;
          this.loaded = true;
        })
        .catch((e) => {
          console.error(e);
          this.loaded = true;
        });
    },
    async getFullQAs(params) {
      return await this.actor
        ?.list(params)
        .then(async (res) => {
          return res;
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
    async fetchQA(link) {
      this.loadedQA = false;
      await this.actor
        ?.show(link)
        .then(async (res) => {
          const arr = res.map((item) => {
            const { quest } = item;
            return {
              ...quest,
              end: Number(quest.end),
              start: Number(quest.start),
              participants: Number(quest.participants),
              owner: item.owner,
            };
          });
          if (!arr.length) {
            router.push('/');
          } else {
            await useResponseStore().fetchResponse(arr?.[0].shareLink);

            this.qa = arr?.[0];
          }
        })
        .catch((e) => {
          console.error(e);

          router.push('/');
        })
        .finally(() => (this.loadedQA = true));
    },
  },
  getters: {
    getList: (state) => state.list,
    getQA: (state) => state.qa,
    getLoadingStatusList: (state) => state.loaded,
    getLoadingStatusQA: (state) => state.loadedQA,
  },
});
