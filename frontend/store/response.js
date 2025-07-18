import { defineStore } from 'pinia';
import { createActor, submissions_index } from '~/submissions_index';
import { useAuthStore } from '@/store/auth';
import { useCounterStore } from '@/store/index';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider } from '~/ic_siws_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';
import axiosService from '@/services/axiosService';
import { CryptoService } from '@/services/crypto';
import { ic_sis_provider } from '~/ic_sis_provider';

const createActorFromIdentity = (identity) => {
  return createActor(process.env.CANISTER_ID_SUBMISSIONS_INDEX, {
    agentOptions: { identity },
  });
};

export const useResponseStore = defineStore('response', {
  id: 'response',
  state: () => ({
    actor: null,
    crypto: null,
    identity: null,
    response: [],
    myList: [],
    loadedList: false,
    qaResponses: [],
  }),
  actions: {
    async init() {
      const provider = localStorage.getItem('authenticationProvider');

      switch (provider) {
        case 'siwe':
        case 'siws':
          await this.initWithSIWSOrSIWE(provider);
          break;
        case 'sis':
          await this.initWithSIS();
          break;
        case 'plug':
          await this.initWithPlug();
          break;
        default:
          this.initDefault();
      }

      this.crypto = new CryptoService(this.actor);
    },
    async initWithSIWSOrSIWE(provider){
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
    async initWithSIS() {
      const { Ok: principal } = await ic_sis_provider.get_principal(localStorage.getItem('address'));

      if (principal !== undefined) {
        const identity = generateIdentityFromPrincipal(principal);
        const actor = identity ? createActorFromIdentity(identity) : null;

        this.identity = identity;
        this.actor = actor;
      } else {
        this.initDefault();
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
    initDefault() {
      this.identity = useAuthStore().getIdentity;
      this.actor = this.identity ? createActorFromIdentity(this.identity) : submissions_index;
    },
    async storeResponse(params, attempts = 0) {
      const { refCode } = params;
      delete params.refCode;
      // We need to keep attempt counter, since with runtime authorization on form submission,
      // response are submitted successfully from 2nd attempt
      const cleanParams = { ...params };
      await Promise.all(
        params.answers.map(async (param) => {
          const owner = useAuthStore().getPrincipal ?? param.owner;
          const key = `${owner}-${param.shareLink}`;

          // TODO: This will be uncommented once vetkd canister is topped up
          // const encryptedAnswer = !!param.answer.length && owner !== undefined
          //   ? await this.crypto.encrypt(key, owner, JSON.stringify(params))
          //   : null;

          return {
            ...param,
            encryptedAnswer: [],
            // encryptedAnswer: encryptedAnswer ? [encryptedAnswer] : [], This will be uncommented once vetkd canister is topped up
            owner: owner ? [owner] : [],
          };
        }),
      )
        .then(async (result) => {
          params.answers = result;

          await this.actor?.store(params, refCode, {
            identity: process.env.DFX_ASSET_PRINCIPAL,
            character: localStorage.extraCharacter || '',
          });

          await this.fetchResponse(params.shareLink);
        })
        .catch(async (e) => {
          if (attempts === 0) {
            await this.storeResponse(cleanParams, 1);
          } else {
            console.error(e);
          }
        });
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

      if (identity === null) {
        return;
      }

      await this.actor
        ?.show({ identity, shareLink })
        .then(async (res) => {
          await Promise.all(
            await res.map(async (answer) => {
              if (answer.answer === '' && answer.encryptedAnswer.length) {
                const owner = answer.owner[0];

                const decryptedAnswer = await this.crypto.decrypt(
                  `${owner}-${shareLink}`,
                  owner,
                  answer.encryptedAnswer[0],
                );

                return JSON.parse(decryptedAnswer);
              }

              return answer;
            }),
          )
            .then((result) => {
              this.response = result;
              useCounterStore().setValue(this.response.length);
            })
            .catch((e) => console.error(e));
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
        .then(async (res) => {
          if (res.length) {
            let paths = [];

            for (const path in res) {
              paths.push(path);
            }

            await axiosService
              .post(`${process.env.API_URL}delete-files`, { paths })
              .catch((e) => console.error(e));
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
