import { defineStore } from 'pinia';
import { createActor, stats_index } from '~/stats_index';
import { useAuthStore } from '@/store/auth';
import { externalWeb3IdentityProviders } from '@/constants/externalIdentityProviders';
import { ic_siwe_provider } from '~/ic_siwe_provider';
import { ic_siws_provider} from '~/ic_siws_provider';
import { generateIdentityFromPrincipal } from '@/util/helpers';

const createActorFromIdentity = identity => {
  return createActor(process.env.STATS_INDEX_CANISTER_ID, {
    agentOptions: { identity },
  });
};

export const useStatsStore = defineStore('stats', {
  id: 'stats',
  state: () => ({
    actor: null,
    identity: null,
    loadedList: false,
    leaderboardList: [],
    stats: [],
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
        this.actor = this.identity ? createActorFromIdentity(this.identity) : stats_index;
      }
    },
    async findStatistics() {
      await this.actor
        ?.findStats(useAuthStore().getPrincipal)
        .then(res => {
          if (res.length) {
            const data = res[0];

            this.stats = {
              forms_completed: Number(data.forms_completed ?? 0),
              forms_created: Number(data.forms_created ?? 0),
              points: Number(data.points ?? 0),
            };
          }
        })
        .catch(e => console.error(e));
    },
    async getLeaderboardAction(params) {
      this.loadedList = false;
      await this.actor
        ?.listPerProject(params.identity, params)
        .then(async (res) => {
          this.leaderboardList = res;

          await useAuthStore().getUsers(res.data?.map(({ identity }) => identity));
        })
        .catch((e) => console.error(e))
        .finally(() => (this.loadedList = true));
    },
    async getLeaderboardAllAction(params) {
      this.loadedList = false;

      await this.actor
        ?.list(params)
        .then(async (res) => {
          this.leaderboardList = res;

          await useAuthStore().getUsers(res.data?.map(({ identity }) => identity));
        })
        .catch((e) => console.error(e))
        .finally(() => (this.loadedList = true));
    },
  },
  getters: {
    getLoadingStatus: (state) => state.loadedList,
    getLeaderboardList: ({ leaderboardList }) => leaderboardList,
    getStatistics: ({ stats }) => stats,
  },
});
