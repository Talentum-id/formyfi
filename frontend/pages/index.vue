<template>
  <Default>
    <div class="content">
      <div class="header">
        <h1 class="title">Q&A Forms</h1>
        <div class="contollers">
          <InputWithSearch
            placeholder="Find a Form..."
            :iconSize="24"
            v-model="search"
            :intervalFunc="searchInList"
          />
          <base-button text="Create a Q&A" @click="showPreview()"></base-button>
        </div>
      </div>
      <div class="actions">
        <ExportTable name="forms" @click="fetchFullList" type="xlsx" :data="fullList"></ExportTable>
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
          title="You have no Q&A"
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
      v-if="show"
      @close="show = false"
      :userInfo="currentItem"
      @next="nextItem()"
      @prev="prevItem()"
    ></ResultModal>
    <CreateQA @refresh="refreshList()" @close="showPreview" v-if="showCreation"></CreateQA>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import { computed, onMounted, ref } from 'vue';
import Badge from '@/components/Badge.vue';
import View from '@/components/View.vue';
import Show from '@/components/Show.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Link from '@/components/Table/Link.vue';
import Text from '@/components/Table/Text.vue';
import Pagination from '@/components/Table/Pagination.vue';
import CreateQA from '@/components/Creating/CreateQA.vue';
import { useAuthStore } from '@/store/auth';
import { useQAStore } from '@/store/qa';
import { useRoute } from 'vue-router';
import router from '@/router';
import Alert from '@/components/Alert.vue';
import { formatDate, reduceStringLength } from '@/util/helpers';
import TableSkeleton from '@/components/TableSkeleton.vue';
import ResultModal from '@/components/Result/ResultModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import ExportTable from '@/components/Table/ExportTable.vue';
import { modal } from '@/mixins/modal';

const route = useRoute();
const authStore = useAuthStore();
const qaStore = useQAStore();
let isMounted = false;

const show = ref(false);
const fullList = ref([]);
const currentItem = ref(null);
const currentIndex = ref(null);
const allItems = ref(null);
const index = ref(null);
const showCreation = ref(false);
const showAlert = ref(false);
const loading = ref(false);
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');
const search = ref('');
const searchInterval = ref(null);

const requestsColumns = computed(() => {
  return [
    { prop: 'title', label: 'Title', width: '200%' },
    { prop: 'shareLink', label: 'Share Link', width: '100%' },
    {
      prop: 'participants',
      label: 'Participants',
      width: '50%',
    },
    { prop: 'start', label: 'Start', width: '70%' },
    { prop: 'end', label: 'End', width: '70%' },
    { prop: 'view', label: '', width: '20%' },
    { prop: 'open', label: '', width: '20%' },
  ];
});
const qaList = computed(() => qaStore.getList);
const loaded = computed(() => qaStore.getLoadingStatusList);
const params = computed(() => {
  return {
    identity: authStore.getPrincipal,
    search: search.value,
    page: parseInt(currentPage.value) || 1,
    pageSize: 10,
    sortBy: {
      key: sort.value.sortKey || '',
      value: sort.value.sortType || '',
    },
  };
});
const pagination = computed(() => qaList.value.pagination);
const requestsRows = computed(
  () => {
    const originalArray = qaList.value.data;
    if (!originalArray || !originalArray?.length) {
      return [];
    }
    return originalArray.map((item) => ({
      title: {
        component: Text,
        props: {
          text: reduceStringLength(item.title, 24),
        },
      },
      shareLink: {
        component: Link,
        props: {
          text: `${window.location.href}quest/${item.shareLink}`,
          size: 12,
          value: item.shareLink,
        },
      },
      participants: {
        component: Badge,
        props: {
          text: `${item.participants} users `,
          value: '',
          transparent: true,
          big: false,
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
      view: {
        component: View,
        props: {
          fn: () => router.push(`quest/${item.shareLink}`),
        },
      },
      open: {
        component: Show,
        props: {
          fn: () => router.push(`responses/${item.shareLink}`),
        },
      },
      end: {
        component: Badge,
        props: {
          text: formatDate(Number(item.end) * 1000),
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
    await qaStore.getQAs(params.value);
  }
  isMounted = true;
});
const showPreview = () => {
  showCreation.value = !showCreation.value;
};
const fetchFullList = async () => {
  if (pagination.value) {
    await qaStore
      .getFullQAs({
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
            Description: item.description.replace(/<[^>]*>/g, ''),
            'Share Link': `${window.location.href}quest/${item.shareLink}`,
            Participants: Number(item.participants),
            Start: formatDate(Number(item.start) * 1000),
            End: formatDate(Number(item.end) * 1000),
          };
        });
        console.log(fullList.value);
      })
      .catch(() => {
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
const nextItem = () => {
  if (currentIndex.value < allItems.value?.length - 1) {
    currentItem.value = allItems.value[++currentIndex.value];
  }
};
const prevItem = () => {
  if (currentIndex.value !== 0) {
    currentItem.value = allItems.value[--currentIndex.value];
  }
};
function nextPage(page) {
  currentPage.value = page;
  qaStore.getQAs(params.value);
}
const sortTasks = async (prop, direction) => {
  if (!isMounted && !loaded) return;
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
const refreshList = () => {
  qaStore.getQAs(params.value);

  showAlert.value = true;

  setTimeout(() => (showAlert.value = false), 2000);
};
const sortHandle = async (name, type) => {
  const paramsSort = {};
  if (type) {
    sortColumn.value = paramsSort.sortKey = name;
    sortDirection.value = paramsSort.sortType = type;
  }

  sort.value = paramsSort;

  await qaStore.getQAs(params.value);
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

  .title {
    color: $primary-text;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 56px;
    font-style: normal;
    font-weight: 500;
    line-height: 72px; /* 128.571% */
  }

  .contollers {
    display: flex;
    align-items: center;
    gap: 24px;
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
