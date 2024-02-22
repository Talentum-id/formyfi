<template>
  <Default>
    <div class="content">
      <div class="header">
        <div class="flex justify-between">
          <BackToList />
          <base-button text="Create a Q&A" @click="showPreview()"></base-button>
        </div>
        <h1 class="title">Form responses list</h1>
        <div class="actions" v-if="qa">
          <div class="title">
            For the form
            <router-link :to="`/quest/${qa.shareLink}`" class="link"
              >{{ qa.title }} <img src="@/assets/icons/show.svg" alt=""
            /></router-link>
          </div>
          <ExportTable
            :name="`Responses + QA ${qa.title}`"
            @click="fetchFullList"
            type="xlsx"
            :data="fullList"
            :loading="loading"
          ></ExportTable>
        </div>
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
          title="You have no responses"
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
    <CreateQA @refresh="refreshList()" @close="showPreview" v-if="showCreation"></CreateQA>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import { computed, onMounted, ref } from 'vue';
import Badge from '@/components/Badge.vue';
import View from '@/components/View.vue';
import Pagination from '@/components/Table/Pagination.vue';
import CreateQA from '@/components/Creating/CreateQA.vue';
import { useResponseStore } from '@/store/response';
import { useRoute } from 'vue-router';
import router from '@/router';
import Alert from '@/components/Alert.vue';
import { formatDate } from '@/util/helpers';
import TableSkeleton from '@/components/TableSkeleton.vue';
import NumberOfEl from '@/components/Table/NumberOfEl.vue';
import ResultModal from '@/components/Result/ResultModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import BackToList from '@/components/BackToList.vue';
import { useAuthStore } from '@/store/auth';
import { useQAStore } from '@/store/qa';
import ExportTable from '@/components/Table/ExportTable.vue';
import { modal } from '@/mixins/modal';

const route = useRoute();
const responseStore = useResponseStore();
const useStore = useAuthStore();

let isMounted = false;

const show = ref(false);
const currentItem = ref(null);
const currentIndex = ref(null);
const allItems = ref(null);
const index = ref(null);
const showCreation = ref(false);
const showAlert = ref(false);
const loading = ref(false);
const fullList = ref([]);
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');

const requestsColumns = computed(() => {
  return [
    { prop: 'index', label: '#', width: '200%' },
    {
      prop: 'participants',
      label: 'Participants',
      width: '200%',
    },
    { prop: 'filled', label: 'Filled', width: '200%' },
    { prop: 'view', label: '', width: '20%' },
    { prop: 'open', label: '', width: '20%' },
  ];
});
const qaResponses = computed(() => responseStore.qaResponses);
const loaded = computed(() => responseStore.getLoadingStatus);
const pagination = computed(() => qaResponses.value.pagination);
const requestsRows = computed(
  () => {
    const originalArray = qaResponses.value.data;
    if (!originalArray || !originalArray?.length) {
      return [];
    }
    return originalArray.map((item, i) => ({
      index: {
        component: NumberOfEl,
        props: {
          text: i + 1,
        },
      },
      participants: {
        component: Badge,
        props: {
          text: item.username,
          transparent: true,
        },
      },
      filled: {
        component: Badge,
        props: {
          text: formatDate(Number(item.filled) * 1000),
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
const params = computed(() => {
  return {
    page: parseInt(currentPage.value) || 1,
    pageSize: 10,
    sortBy: {
      key: sort.value.sortKey || '',
      value: sort.value.sortType || '',
    },
  };
});
const qa = computed(() => useQAStore().getQA);

onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await responseStore.getQAResponses(route.params.id, params.value);
  }

  await useQAStore().fetchQA(route.params.id);

  if (qa.value.owner !== useStore.getPrincipal) {
    await router.push('/');
  }

  isMounted = true;
});
const fetchFullList = async () => {
  loading.value = true;
  await responseStore
    .getExportResponses(route.params.id)
    .then((res) => {
      fullList.value = res?.answers.map((item) => {
        let answersObject = item.answers.reduce((acc, el, index) => {
          acc[`Question ${index + 1} : ${res.quest.questions[index].question}`] =
            el.answer.toString() ?? '';
          return acc;
        }, {});

        return {
          Username: item.author.username,
          Start: formatDate(Number(item.author.filled) * 1000),
          Identity: item.author.identity,
          ...answersObject,
        };
      });
      loading.value = false;
    })
    .catch((e) => {
      loading.value = false;
      modal.emit('openModal', {
        title: 'Error Message',
        message: 'Something went wrong!',
        type: 'error',
        actionText: 'Try again',
        fn: fetchFullList,
      });
    });
};
const nextItem = () => {
  if (currentIndex.value < allItems.value?.length - 1) {
    currentItem.value = allItems.value[++currentIndex.value];
  }
};
const showPreview = () => {
  showCreation.value = !showCreation.value;
};

const prevItem = () => {
  if (currentIndex.value !== 0) {
    currentItem.value = allItems.value[--currentIndex.value];
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
  currentItem.value = allItems.value?.[currentIndex.value];
  show.value = true;
};
function nextPage(page) {
  currentPage.value = page;
  responseStore.getQAResponses(route.params.id, params.value);
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
  responseStore.getQAResponses(route.params.id, params.value);
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
  await responseStore.getQAResponses(route.params.id, params.value);
};
</script>
<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: column;
  gap: 48px;

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
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 8px;

  .title {
    color: #667085;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    display: flex;
    align-items: center;
    gap: 8px;
    .link {
      display: flex;
      width: fit-content;
      padding: 4px 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: #e9ecf2;
      color: $blue;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      cursor: pointer;
    }
  }
}
</style>
