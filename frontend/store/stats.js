import { defineStore } from 'pinia';
import { createActor, stats_index } from '~/stats_index';
import { HttpAgent } from '@dfinity/agent';
import { useAuthStore } from '@/store/auth';

function createActorFromIdentity(agent) {
  return createActor(process.env.RESPONSE_INDEX_CANISTER_ID, { agent });
}

export const useStatsStore = defineStore('stats', {
  id: 'stats',
  state: () => ({
    actor: null,
    identity: null,
    response: [],
    loadedList: false,
    leaderboardList: [],
  }),
  actions: {
    async init() {
      this.identity = useAuthStore().identity;

      if (this.identity) {
        this.actor = createActorFromIdentity(new HttpAgent({ identity: this.identity }));
      } else {
        this.actor = stats_index;
      }
    },

    async getLeaderboardAction(params) {
      this.loadedList = false;
      await this.actor
        ?.listPerProject(params.identity, params)
        .then((res) => {
          this.leaderboardList = res;
        })
        .catch((e) => console.error(e))
        .finally(() => (this.loadedList = true));
    },
  },
  getters: {
    getLoadingStatus: (state) => state.loadedList,
    getLeaderboardList: (state) => state.leaderboardList,
  },
});
