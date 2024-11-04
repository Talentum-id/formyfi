<template>
  <Default>
    <div class="content">
      <div class="header">
        <h1 class="title">Leaderboard</h1>
      </div>
      <Select
        class="w-[200px] mb-4"
        :options="projectOptions"
        @input="selectTable($event)"
      ></Select>

      <div ref="index">
        <TableSkeleton v-if="!loaded" />
        <BaseTable
          v-else
          :columns="requestsColumns"
          :rows="requestsRows"
          :sortFunction="sortTasks"
          :sortDirection="sortDirection"
          :setSortDirection="setSortDirection"
          :setSortColumn="setSortColumn"
          :sortColumn="sortColumn"
          title="No Data"
          icon="icons8-futurama-bender"
        />
        <Pagination
          v-if="requestsRows && requestsRows.length"
          :currentPage="currentPage"
          :totalPages="pagination.total_pages"
          @pageChanged="nextPage($event)"
        />
      </div>
    </div>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import { computed, onMounted, ref } from 'vue';
import Pagination from '@/components/Table/Pagination.vue';
import { useAuthStore } from '@/store/auth';
import { useStatsStore } from '@/store/stats';
import { useRoute } from 'vue-router';
import router from '@/router';
import TableSkeleton from '@/components/TableSkeleton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import Rank from '@/components/Table/Rank.vue';
import Talent from '@/components/Table/Talent.vue';
import Select from '@/components/Select.vue';

const route = useRoute();
const authStore = useAuthStore();
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');
const tableType = ref('project');
const leaderboardStore = useStatsStore();
const projectOptions = ref([
  { name: 'My Forms', id: 0, type: 'project' },
  { name: 'Formyfi', id: 1, type: 'all' },
]);
const requestsColumns = computed(() => {
  return [
    { prop: 'rank', label: '#', width: '20%' },
    { prop: 'user', label: 'User', width: '300%' },
    {
      prop: 'qp',
      label: 'QP',
      width: '50%',
    },
    { prop: 'completed', label: 'Completed Forms', width: '70%' },
    { prop: 'created', label: 'Forms Created', width: '70%' },
    { prop: 'invited', label: 'Referrals Invited', width: '70%' },
  ];
});

const list = computed(() => leaderboardStore.getLeaderboardList);
const statsList = computed(() => leaderboardStore.getStatsList);
const users = computed(() => authStore.getUsersList);
const loaded = computed(() => leaderboardStore.getLoadingStatus);
const params = computed(() => {
  return {
    identity: authStore.getPrincipal,
    page: parseInt(currentPage.value) || 1,
    pageSize: 10,
    sortBy: {
      key: sort.value.sortKey || '',
      value: sort.value.sortType || '',
    },
  };
});
const pagination = computed(() => list.value.pagination);

const requestsRows = computed(
  () => {
    const originalArray = list.value.data;
    if (!originalArray || !originalArray?.length || !users.value?.length) {
      return [];
    }
    return originalArray.map((item, index) => ({
      isTop: Number(pagination.value.current_page) === 1 && index <= 2,
      rank: {
        component: Rank,
        props: {
          value:
            Number(pagination.value.current_page) > 1
              ? index + 1
              : Number(pagination.value.current_page) + index,
          isTop: Number(pagination.value.current_page) === 1 && index <= 2,
        },
      },
      user: {
        component: Talent,
        props: {
          text: users.value[index]?.fullName.trim() || users.value[index]?.username,
          img: users.value[index]?.avatar ?? null,
          big: true,
        },
      },
      qp: {
        content: item.points ? Number(item.points).toFixed(2) : '0',
      },
      completed: {
        content: Number(item.forms_completed),
      },
      created: {
        content: statsList.value[index] ? Number(statsList.value[index].forms_created ?? 0) : 0,
      },
      invited: {
        content: item.total_invited.length ? Number(item.total_invited[0]) : '0',
      },
    }));
  },
  { deep: true },
);

onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await leaderboardStore.getLeaderboardAction(params.value);
  }
});

const nextPage = async (page) => {
  currentPage.value = await page;

  if (tableType.value === 'all') {
    await leaderboardStore.getLeaderboardAllAction(params.value);
  } else {
    await leaderboardStore.getLeaderboardAction(params.value);
  }
};
const sortTasks = async (prop, direction) => {
  if (!loaded) return;
  await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
  currentPage.value = 1;
  await sortHandle(prop, direction);
};
const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};
const sortHandle = async (name, type) => {
  const paramsSort = {};
  if (type) {
    sortColumn.value = paramsSort.sortKey = name;
    sortDirection.value = paramsSort.sortType = type;
  }

  sort.value = paramsSort;

  await leaderboardStore.getLeaderboardAction(params.value);
};
const selectTable = async ({ type }) => {
  currentPage.value = 1;
  tableType.value = type;

  if (type === 'all') {
    await leaderboardStore.getLeaderboardAllAction(params.value);
  } else {
    await leaderboardStore.getLeaderboardAction(params.value);
  }
};
</script>
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .title {
    color: $primary-text;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 56px;
    font-style: normal;
    font-weight: 500;
    line-height: 72px; /* 128.571% */
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 28px;
  gap: 8px;

  .sort {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      color: #667085;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }

    .select {
      width: 130px;
    }
  }
}
</style>
