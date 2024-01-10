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
          <CreateQA @refresh="refreshList()"></CreateQA>
        </div>
      </div>
      <div class="actions">
        <!--        <div class="sort">-->
        <!--          <span>Sort by:</span>-->
        <!--          <Select-->
        <!--            :options="sortOptions"-->
        <!--            scrollHorizontalHidden-->
        <!--            class="select"-->
        <!--            :stringLengthSelected="16"-->
        <!--            :string-length="14"-->
        <!--          ></Select>-->
        <!--        </div>-->
        <button class="export-btn" @click="pageScreenToPdf">
          <span>Export as pdf</span>
          <img v-if="!loading" :src="downloadIcon" alt="" @click.stop="pageScreenToPdf" />
          <span v-else class="loader"></span>
        </button>
      </div>
      <Alert message="Success" type="success" v-if="showAlert"></Alert>
      <div ref="index">
        <TableSkeleton v-if="!loaded" />
        <CollapseTable
          v-else
          :columns="requestsColumns"
          :rows="requestsRows"
          is-sorting
          :sortFunction="sortTasks"
          :sortDirection="sortDirection"
          :setSortDirection="setSortDirection"
          :setSortColumn="setSortColumn"
          :sortColumn="sortColumn"
          pointer
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
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import CollapseTable from '@/components/Table/CollapseTable.vue';
import { computed, onMounted, ref, watch } from 'vue';
import Badge from '@/components/Badge.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Link from '@/components/Table/Link.vue';
import Wallet from '@/components/Table/Wallet.vue';
import NumberOfEl from '@/components/Table/NumberOfEl.vue';
import Text from '@/components/Table/Text.vue';
import Select from '@/components/Select.vue';
import downloadIcon from '@/assets/icons/Download.svg';
import Pagination from '@/components/Table/Pagination.vue';
import CreateQA from '@/components/Creating/CreateQA.vue';
import { useQAStore } from '@/store/qa';
import { useRoute } from 'vue-router';
import router from '@/router';
import Alert from '@/components/Alert.vue';
import { formatDate } from '@/util/helpers';
import html2pdf from 'html2pdf.js';
import TableSkeleton from '@/components/TableSkeleton.vue';
const index = ref(null);

const requestsColumns = computed(() => {
  return [
    { prop: 'title', label: 'Title', width: '100%' },
    { prop: 'shareLink', label: 'Share Link', width: '130%' },
    {
      prop: 'participants',
      label: 'Participants',
      width: '50%',
    },
    { prop: 'start', label: 'Started/Filled', width: '70%' },
    { prop: 'end', label: 'End', width: '70%' },
    { prop: 'btns', label: '', width: '30%' },
  ];
});
const route = useRoute();
const qaStore = useQAStore();
let isMounted = false;
const sortOptions = ref([{ name: '123', id: 1 }]);
const showAlert = ref(false);
onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await qaStore.getQAs(params.value);
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
  qaStore.getQAs(params.value);
}
const qaList = computed(() => qaStore.getList);
const loaded = computed(() => qaStore.getLoadingStatus);

const params = computed(() => {
  return {
    search: search.value,
    page: parseInt(currentPage.value) || 1,
    pageSize: 15,
    sortBy: {
      key: sort.value.sortKey || '',
      value: sort.value.sortType || '',
    },
  };
});
const sort = ref({});
const currentPage = ref(route.query ? route.query.page : 1);

const sortTasks = async (prop, direction) => {
  if (!isMounted) return;
  await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
  currentPage.value = 1;
  if (prop === 'manager') {
    await sortHandle('name', direction);
    return;
  }
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
  qaStore.getQAs(params.value);

  showAlert.value = true;

  setTimeout(() => (showAlert.value = false), 2000);
};

const sortHandle = async (name, type) => {
  const params = {};
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }
  sort.value = params;
  await qaStore.getQAs(params.value);
};
const pagination = computed(() => qaList.value.pagination);

const requestsRows = computed(
  () => {
    const originalArray = qaList.value.data;
    if (!originalArray || !originalArray?.length) {
      return [];
    }
    console.log(qaList.value);
    const wallets = originalArray.map((el, i) => {
      return {
        component: Wallet,
        props: {
          text: '0xf30c...de18',
        },
        id: i,
      };
    });
    const numbers = originalArray.map((el, i) => {
      return {
        component: NumberOfEl,
        props: {
          text: i + 1,
        },
        id: i,
      };
    });
    const dates = originalArray.map((el, i) => {
      return {
        component: Badge,
        props: {
          text: 'Jan 12, 2024 ',
        },
        id: i,
      };
    });
    return originalArray.map((item, i) => ({
      title: {
        singleComponent: {
          component: Text,
          props: {
            text: item.title,
          },
        },
        components: numbers,
      },
      shareLink: {
        component: Link,
        props: {
          text: item.shareLink,
          value: '',
        },
      },
      participants: {
        singleComponent: {
          component: Badge,
          props: {
            text: `${item.participants} users `,
            value: '',
            type: 'claim',
            big: false,
          },
        },
        components: wallets,
      },
      start: {
        singleComponent: {
          component: Badge,
          props: {
            text: formatDate(Number(item.start) * 1000),
            value: '',
            type: 'claim',
            big: false,
          },
        },
        components: dates,
      },
      end: {
        component: Badge,
        props: {
          text: formatDate(Number(item.end) * 1000),
          value: '',
          type: 'claim',
          big: false,
        },
      },
    }));
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
</style>
