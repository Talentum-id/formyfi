import { defineStore } from 'pinia';
import { createActor } from '~/qa_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import { useAssetsStore } from '@/store/assets';
import router from '@/router';

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
    loadedQA: false,
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      const agent = this.identity ? new HttpAgent({ identity: this.identity }) : null;

      this.actor = this.identity ? createActorFromIdentity(agent) : null;
    },
    async storeQA(params) {
      console.log(params);
      return await this.actor.store(params);
    },
    async removeQuest({ image, shareLink, questions }) {
      await this.actor.delete(shareLink).then(async () => {
        const batch = useAssetsStore().assetManager.batch();

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
      this.loadedQA = false;
      await this.actor
        .show(link)
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
