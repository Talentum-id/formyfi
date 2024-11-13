import { defineStore } from 'pinia';
import { createActor, form_index } from '~/form_index';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import router from '@/router';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';
import { externalWeb3IdentityProviders } from '@/constants/externalIdentityProviders';
import axiosService from '@/services/axiosService';

const createActorFromIdentity = (identity) => {
  return createActor(process.env.CANISTER_ID_FORM_INDEX, {
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
    stats: 0,
  }),
  actions: {
    async init() {
      const provider = localStorage.getItem('authenticationProvider');

      if (externalWeb3IdentityProviders.indexOf(provider) !== -1) {
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
      } else {
        this.identity = useAuthStore().getIdentity;
        this.actor = this.identity ? createActorFromIdentity(this.identity) : form_index;
      }
    },
    async fetchStats() {
      return this.actor
        ?.getFormsAmount()
        .then((res) => (this.stats = res))
        .catch((e) => console.error(e));
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
          let deletingFiles = [image];

          for (const question of questions) {
            if (question.file) {
              deletingFiles.push(question.file);
            }
          }

          await axiosService
            .post(`${process.env.API_URL}delete-files`, {
              paths: deletingFiles,
            })
            .catch((e) => console.error(e));
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
    getStats: ({ stats }) => stats,
    getList: (state) => state.list,
    getQA: (state) => state.qa,
    getLoadingStatusList: (state) => state.loaded,
    getLoadingStatusQA: (state) => state.loadedQA,
  },
});
