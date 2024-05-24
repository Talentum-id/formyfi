<template>
  <Default>
    <div class="content">
      <div class="header">
        <h1 class="title">My response list</h1>
        <div class="contollers">
          <InputWithSearch
            placeholder="Find a Form..."
            :iconSize="24"
            v-model="search"
            :intervalFunc="searchInList"
          />
        </div>
      </div>
      <div class="actions">
        <ExportTable
          name="forms"
          @click="fetchFullList"
          type="xlsx"
          :data="fullList"
          :loading="loading"
        ></ExportTable>
      </div>
      <Alert message="Success" type="success" v-if="showAlert"></Alert>

      <div ref="index">
        <TableSkeleton v-if="!loaded" />
        <BaseTable
          v-else
          :columns="requestsColumns"
          :rows="requestsRows"
          is-sorting
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
import ExportTable from '@/components/Table/ExportTable.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Alert from '@/components/Alert.vue';
import { useQAStore } from '@/store/qa';
import Text from '@/components/Table/Text.vue';
import { formatDate, reduceStringLength } from '@/util/helpers';
import Badge from '@/components/Badge.vue';

const qaStore = useQAStore();
const route = useRoute();
const authStore = useAuthStore();
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');
const leaderboardStore = useStatsStore();
const search = ref('');
const searchInterval = ref(null);
const loading = ref(false);

const fetchFullList = async () => {
  if (pagination.value) {
    loading.value = true;
    // await qaStore
    //   .getFullQAs({
    //     identity: authStore.getPrincipal,
    //     page: 1,
    //     search: '',
    //     pageSize: pagination.value.total,
    //     sortBy: {
    //       key: '',
    //       value: '',
    //     },
    //   })
    //   .then((res) => {
    //     fullList.value = res.data.map((item) => {
    //       return {
    //         Title: item.title,
    //         Description: item.description.replace(/<[^>]*>/g, ''),
    //         'Share Link': `${window.location.href}quest/${item.shareLink}`,
    //         Participants: Number(item.participants),
    //         Start: formatDate(Number(item.start) * 1000),
    //         End: formatDate(Number(item.end) * 1000),
    //       };
    //     });
    //     loading.value = false;
    //   })
    //   .catch(() => {
    //     loading.value = false;
    //     modal.emit('openModal', {
    //       title: 'Error Message',
    //       message: 'Something went wrong!',
    //       type: 'error',
    //       actionText: 'Try again',
    //       fn: fetchFullList,
    //     });
    //   });
  }
};

const requestsColumns = computed(() => {
  return [
    { prop: 'title', label: 'Title', width: '200%' },
    { prop: 'start', label: 'Full Filled', width: '70%' },
    { prop: 'view', label: '', width: '20%' },
  ];
});

const list = computed(() => leaderboardStore.getLeaderboardList);
const loaded = computed(() => leaderboardStore.getLoadingStatus);
const params = computed(() => {
  return {
    identity: authStore.getPrincipal,
    page: parseInt(currentPage.value) || 1,
    pageSize: 10,
    search: search.value,
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
    if (!originalArray || !originalArray?.length) {
      return [];
    }

    return originalArray.map((item, index) => ({
      title: {
        component: Text,
        props: {
          text: reduceStringLength(item.title, 24),
        },
      },
      start: {
        component: Badge,
        props: {
          text: formatDate(Number(item.start) * 1000),
          value: '',
          type: 'claim',
          big: false,
          transparent: true,
        },
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

function nextPage(page) {
  currentPage.value = page;
  getUsersList();
  leaderboardStore.getLeaderboardAction(params.value);
}
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
function searchInList() {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    router.push({
      query: Object.assign({}, route.query, { page: 1 }),
    });

    qaStore.getQAs(params.value);
  }, 500);
}
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
