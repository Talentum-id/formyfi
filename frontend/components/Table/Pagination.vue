<template>
  <div v-if="totalPages > 1" class="pagination_wrapper">
    <button :disabled="props.currentPage === 1" @click="firstPage" class="btn-action">
      <Icon name="Left-dbl" :size="26" />
    </button>
    <button :disabled="props.currentPage === 1" @click="prevPage" class="btn-action">
      <Icon name="Left" :size="26" />
    </button>
    <div class="pagination-btns">
      <button
        class="pagination-btn"
        :class="{ active: currentPage == pageNumber }"
        v-for="pageNumber in displayedPages"
        :key="pageNumber"
        @click="changePage(pageNumber)"
        :disabled="pageNumber === props.currentPage"
      >
        {{ pageNumber }}
      </button>
    </div>

    <button :disabled="props.currentPage === totalPages" @click="nextPage" class="btn-action">
      <Icon name="Right" :size="26" />
    </button>
    <button :disabled="props.currentPage === totalPages" @click="lastPage" class="btn-action">
      <Icon name="Right-dbl" :size="26" />
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import Icon from '@/components/Icons/Icon.vue';
import { useRouter, useRoute } from 'vue-router';

const emit = defineEmits(['pageChanged']);

const props = defineProps({
  totalPages: { type: Number, default: 1 },
  currentPage: { type: Number, default: 1 },
});

const totalPages = computed(() => {
  return props.totalPages;
});

const displayedPages = computed(() => {
  const maxPagesToShow = 5;
  const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
  let startPage = +props.currentPage - halfMaxPagesToShow;
  let endPage = +props.currentPage + halfMaxPagesToShow;
  if (startPage < 1) {
    endPage += 1 - startPage;
    startPage = 1;
  }
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = endPage - maxPagesToShow + 1;
    if (startPage < 1) {
      startPage = 1;
    }
  }
  router.push({ query: Object.assign({}, route.query, { page: props.currentPage }) });
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

function prevPage() {
  const prevPage = +props.currentPage - 1;
  if (prevPage >= 1) {
    props.currentPage = prevPage;
    router.push({ query: Object.assign({}, route.query, { page: prevPage }) });
    emit('pageChanged', prevPage);
  }
}

function nextPage() {
  const nextPage = +props.currentPage + 1;
  if (nextPage <= totalPages.value) {
    props.currentPage = nextPage;
    router.push({ query: Object.assign({}, route.query, { page: nextPage }) });
    emit('pageChanged', nextPage);
  }
}
const router = useRouter();
const route = useRoute();
function changePage(pageNumber) {
  props.currentPage = pageNumber;
  router.push({ query: Object.assign({}, route.query, { page: pageNumber }) });
  emit('pageChanged', pageNumber);
}

function firstPage() {
  props.currentPage = 1;
  router.push({ query: Object.assign({}, route.query, { page: 1 }) });

  emit('pageChanged', 1);
}

function lastPage() {
  props.currentPage = totalPages.value;
  router.push({ query: Object.assign({}, route.query, { page: totalPages.value }) });
  emit('pageChanged', totalPages.value);
}
onMounted(() => {
  if (route.query.page && +route.query.page !== +props.currentPage) {
    emit('pageChanged', route.query.page);
  }
});
watch(props.currentPage, (newPage) => {
  if (newPage < 1) {
    props.currentPage = 1;
    router.push({ query: Object.assign({}, route.query, { page: 1 }) });
  } else if (newPage > totalPages.value) {
    props.currentPage = totalPages.value;
    router.push({ query: Object.assign({}, route.query, { page: totalPages.value }) });
  }
});

watch(
  () => route.query.page,
  (value) => {
    emit('pageChanged', value);
  },
);
</script>

<style lang="scss" scoped>
.pagination_wrapper {
  display: flex;
  align-items: center;
  margin: 28px 0px 40px 0px;
}
.pagination-btns {
  margin: 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pagination-btn {
  width: 40px;
  height: 40px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 24px;
  color: $default;
  font-family: $default_font;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.014em;
  &.active {
    background: $default;
    border: 1px solid $default;
    color: $white;
  }
  &:hover {
    background: $default-badge-border;
    color: $default;
  }
  &:active {
    background: $default-border;
    color: $default;
  }
}
.btn-action {
  border: none;
  background: none;
  cursor: pointer;
}
</style>
