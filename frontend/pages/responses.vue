<template>
  <Default>
    <div class="content">
      <div class="header">
        <div class="flex justify-between">
          <BackToList />
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
        <h1 class="title">Form responses list</h1>
      </div>

      <div class="actions">
        <button class="export-btn" @click="pageScreenToPdf">
          <span>Export </span>
          <img v-if="!loading" :src="downloadIcon" alt="" @click.stop="pageScreenToPdf" />
          <span v-else class="loader"></span>
        </button>
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
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Link from '@/components/Table/Link.vue';
import Text from '@/components/Table/Text.vue';
import downloadIcon from '@/assets/icons/Download.svg';
import Pagination from '@/components/Table/Pagination.vue';
import CreateQA from '@/components/Creating/CreateQA.vue';
import { useAuthStore } from '@/store/auth';
import { useQAStore } from '@/store/qa';
import { useResponseStore } from '@/store/response';
import { useRoute } from 'vue-router';
import router from '@/router';
import Alert from '@/components/Alert.vue';
import { formatDate, reduceStringLength } from '@/util/helpers';
import html2pdf from 'html2pdf.js';
import TableSkeleton from '@/components/TableSkeleton.vue';
import NumberOfEl from '@/components/Table/NumberOfEl.vue';
import ResultModal from '@/components/Result/ResultModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import BackToList from '@/components/BackToList.vue';

const index = ref(null);
const showCreation = ref(false);
const showPreview = () => {
  showCreation.value = !showCreation.value;
};
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
const route = useRoute();
const authStore = useAuthStore();
const qaStore = useQAStore();
const responseStore = useResponseStore();
const show = ref(false);
const currentItem = ref(null);
const currentIndex = ref(null);
const allItems = ref(null);

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
const showModal = (items, index) => {
  currentIndex.value = index;
  allItems.value = items.map((i) => {
    return {
      ...i,
      filled: Number(i.filled),
    };
  });
  currentItem.value = allItems.value[currentIndex.value];
  show.value = true;
};
let isMounted = false;
const showAlert = ref(false);
onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await responseStore.getQAResponses(route.params.id);
  }
  isMounted = true;
});
const loading = ref(false);
const pageScreenToPdf = () => {
  loading.value = true;
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');
  html2pdf(index.value, {
    filename: 'dashboard.pdf',
    image: { type: 'png', quality: 1 },
    enableLinks: false,
    pagebreak: { mode: 'css' },
    html2canvas: { dpi: 96, letterRendering: false, scale: 2, allowTaint: false, useCORS: true },
    jsPDF: { format: 'a2', orientation: 'p', unit: 'mm' },
  }).then(() => {
    style.remove();
    loading.value = false;
  });
};

function nextPage(page) {
  currentPage.value = page;
  responseStore.getQAResponses(params.value);
}

const qaList = computed(() => responseStore.qaResponses);
const loaded = computed(() => qaStore.getLoadingStatusList);

const params = computed(() => {
  return {
    identity: authStore.principal.toText(),
    search: search.value,
    page: parseInt(currentPage.value) || 1,
    pageSize: 10,
    sortBy: {
      key: sort.value.sortKey || '',
      value: sort.value.sortType || '',
    },
  };
});
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);

const sortTasks = async (prop, direction) => {
  if (!isMounted && !loaded) return;
  await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
  currentPage.value = 1;
  await sortHandle(prop, direction);
};
const sortDirection = ref('');
const sortColumn = ref('');
const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};
const search = ref('');

const refreshList = () => {
  responseStore.getQAResponses(params.value);

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

  await responseStore.getQAResponses(params.value);
};
const pagination = computed(() => qaList.value.pagination);

const requestsRows = computed(
  () => {
    const originalArray = qaList.value.data;
    if (!originalArray || !originalArray?.length) {
      return [];
    }
  },
  { deep: true },
);
const searchInterval = ref(null);

function searchInList() {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    router.push({
      query: Object.assign({}, route.query, { page: 1 }),
    });

    responseStore.getQAResponses(params.value);
  }, 500);
}
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
      font-family: Basis Grotesque Pro;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }

    .select {
      width: 130px;
    }
  }

  .export-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    cursor: pointer;
    padding: 4px 8px;
    height: fit-content;
    border: none;
    width: fit-content;
    background: transparent;

    span {
      color: $default;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    &:hover {
      border-radius: 8px;
      background: $default-badge-border;
    }
  }
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}

.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 2px solid $default;
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
