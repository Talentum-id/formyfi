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
    <ResultModal
      v-if="show && currentItem"
      @close="show = false"
      :userInfo="currentItem"
      @next="nextItem()"
      @prev="prevItem()"
    ></ResultModal>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import { computed, onMounted, ref } from 'vue';
import Pagination from '@/components/Table/Pagination.vue';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import { useQAStore } from '@/store/qa';
import { useRoute } from 'vue-router';
import router from '@/router';
import TableSkeleton from '@/components/TableSkeleton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import ExportTable from '@/components/Table/ExportTable.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Alert from '@/components/Alert.vue';
import Text from '@/components/Table/Text.vue';
import { formatDate, reduceStringLength } from '@/util/helpers';
import Badge from '@/components/Badge.vue';
import { modal } from '@/mixins/modal';
import ResultModal from '@/components/Result/ResultModal.vue';
import View from '@/components/View.vue';

const responseStore = useResponseStore();
const route = useRoute();
const show = ref(false);
const currentItem = ref(null);
const currentIndex = ref(null);
const authStore = useAuthStore();
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');
const search = ref('');
const searchInterval = ref(null);
const loading = ref(false);
const showAlert = ref(false);
const fullList = ref([]);
const allItems = ref(null);

const fetchFullList = async () => {
  if (pagination.value) {
    loading.value = true;
    await responseStore
      .getFullResponses({
        identity: authStore.getPrincipal,
        page: 1,
        search: '',
        pageSize: pagination.value.total,
        sortBy: {
          key: '',
          value: '',
        },
      })
      .then((res) => {
        fullList.value = res.data.map((item) => {
          return {
            Title: item.title,
            'Share Link': `${window.location.href}quest/${item.shareLink}`,
            Start: formatDate(Number(item.filled) * 1000),
          };
        });
        showAlert.value = true;
        setTimeout(() => (showAlert.value = false), 2000);
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
        modal.emit('openModal', {
          title: 'Error Message',
          message: 'Something went wrong!',
          type: 'error',
          actionText: 'Try again',
          fn: fetchFullList,
        });
      });
  }
};

const requestsColumns = computed(() => {
  return [
    { prop: 'title', label: 'Title', width: '200%' },
    { prop: 'start', label: 'Full Filled', width: '70%' },
    { prop: 'view', label: '', width: '20%' },
  ];
});

const list = computed(() => responseStore.getMyResponseList);
const loaded = computed(() => responseStore.getLoadingStatus);
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
    return originalArray.map((item, i) => ({
      title: {
        component: Text,
        props: {
          text: reduceStringLength(item.title, 24),
        },
      },
      start: {
        component: Badge,
        props: {
          text: formatDate(Number(item.filled) * 1000),
          value: '',
          type: 'claim',
          big: false,
          transparent: true,
        },
      },
      view: {
        component: View,
        props: {
          fn: () => showModal(originalArray, i),
        },
      },
    }));
  },
  { deep: true },
);
const prevItem = async () => {
  if (currentIndex.value !== 0) {
    await useQAStore().fetchQA(allItems.value[--currentIndex.value]?.shareLink);
    currentItem.value = await useQAStore().getQA;
  }
};
const nextItem = async () => {
  if (currentIndex.value < allItems.value?.length - 1) {
    await useQAStore().fetchQA(allItems.value[++currentIndex.value]?.shareLink);
    currentItem.value = await useQAStore().getQA;
  }
};

const showModal = async (items, index) => {
  currentIndex.value = index;
  allItems.value = items.map((i) => {
    return {
      ...i,
      filled: Number(i.filled),
    };
  });
  await useQAStore().fetchQA(allItems.value[currentIndex.value]?.shareLink);
  currentItem.value = await useQAStore().getQA;

  show.value = true;
};

onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await responseStore.getMyResponses(params.value);
  }
});

function nextPage(page) {
  currentPage.value = page;
  responseStore.getMyResponses(params.value);
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

  await responseStore.getMyResponses(params.value);
};
function searchInList() {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    router.push({
      query: Object.assign({}, route.query, { page: 1 }),
    });

    responseStore.getMyResponses(params.value);
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
