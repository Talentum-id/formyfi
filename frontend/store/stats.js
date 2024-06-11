import { defineStore } from 'pinia';
import { createActor, stats_index } from '~/stats_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

function createActorFromIdentity(agent) {
  return createActor(process.env.STATS_INDEX_CANISTER_ID, { agent });
}

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
      this.identity = useAuthStore().getIdentity;

      if (this.identity) {
        this.actor = createActorFromIdentity(new HttpAgent({ identity: this.identity }));
      } else {
        this.actor = stats_index;
      }
    },
    async findStatistics() {
      await this.actor
        ?.findStats(useAuthStore().getPrincipal)
        .then(res => {
          if (res.length) {
            const data = res[0]

            this.stats = {
              forms_completed: Number(data.forms_completed ?? 0),
              forms_created: Number(data.forms_created ?? 0),
              points: Number(data.points ?? 0),
            }
          }
        })
        .catch(e => console.error(e))
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
    getLeaderboardList: (state) => state.leaderboardList,
    getStatistics: ({ stats }) => stats,
  },
});
