<template>
  <Default>
    <div class="flex flex-col gap-12 container">
      <div class="flex flex-row items-center justify-between">
        <div class="font-light font-familyLight text-secondary-10 text-5xl">NFT Collections</div>
        <div class="flex flex-row gap-6">
          <InputWithSearch :placeholder="'Find an NFT Collection...'" :iconSize="24" v-model="search" />

          <BaseButton class="!text-light font-medium" text="Create NFT Collection" @click="modalVisible = true" />
        </div>
      </div>
      <BaseTable v-if="loaded" :columns="collectionColumns" :rows="collectionRows" pointer
        title="So far, no NFT Collection has been created" icon="icons8-futurama-nibbler" sortFunction="sortTasks" />
      <TableSkeleton v-else />
      <Pagination :currentPage="page" @pageChanged="nextPage($event)" v-if="loaded" :totalPages="total_pages" />
    </div>
    <CreateCollection @close="modalVisible = false" @update="getCollections()" v-if="modalVisible" />
  </Default>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useDebounce } from '@vueuse/core';
import Address from '@/components/Address.vue';
import Talent from '@/components/Talent.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import Pagination from '@/components/Table/Pagination.vue';
import TableSkeleton from '@/components/TableSkeleton.vue';
import BaseTable from '@/components/Table/BaseTable.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import CreateCollection from '@/components/NFTCollection/CreateCollection.vue';
import Default from '@/layouts/default.vue';
import { useCollectionsStore } from '@/store/collections';
import { chains } from '@/web3/nft';
import Badge from '@/components/Badge.vue';
import Link from '@/components/Table/Link.vue';

const router = useRouter();
const modalVisible = ref(false);
const isConfirmModalOpen = ref(false);
const search = ref('');

const page = ref(1);
const total_pages = ref(1);
const loaded = ref(true);
const roles = inject('roles');

const debouncedSearch = useDebounce(search, 1000);
const collectionsStore = useCollectionsStore();

const params = computed(() => ({
  page: page.value,
  pageSize: 10,
  sortBy: {
    key: 'symbol',
    value: 'desc',
  },
  search: debouncedSearch.value || ''
}));

const handleCloseConfirm = () => {
  isConfirmModalOpen.value = false;
  modalVisible.value = false;
  getCollections();
};

const nextPage = async (newPage) => {
  page.value = newPage;
  await router.push({ query: { page: newPage } });
  await getCollections();
};

watch(params, async () => {
  await getCollections();
});

const getCollections = async () => {
  loaded.value = false;
  try {
    await collectionsStore.getCollections(params.value)
  } catch (error) {
    console.error('Error fetching collections:', error);
  } finally {
    loaded.value = true;
  }
};

const collectionList = computed(() => collectionsStore.getList);

onMounted(async () => {
  await getCollections();
});

const collectionColumns = computed(() => {
  return [
    { prop: 'name', label: 'Collection Name', width: '100%' },
    { prop: 'supply', label: 'Supply', width: '60%' },
    { prop: 'available', label: 'Available', width: '60%' },
    { prop: 'address', label: 'Contract Address', width: '95%' },
    { prop: 'blockchain', label: 'Blockchain', width: '95%' },
  ];
});
const collectionRows = computed(() => {

  const collectionsArray = collectionList.value;
  if (!collectionsArray?.data?.length) {
    return [];
  }
  page.value = Number(collectionsArray.pagination.current_page)
  total_pages.value = Number(collectionsArray.pagination.total_pages)

  return collectionsArray.data?.map((item) => ({
  
    name: {
      content: item.name,
    },
    
    supply: {
      content: item.unlimited_supply ? 'Unlimited' : Number(item.max_supply),
    },
    available: {
      content: item.unlimited_supply ? 'Unlimited' : Number(item.max_supply),
    },
    address: {
      component: Link,
      props: {
        text: item.contract_address ?? '',
        size: 12,
        value: item.contract_address ?? '',
      },
    },
    blockchain: {
      component: Badge,
        props: {
          text: chains.find(chain => chain.id === Number(item.blockchain_id))?.chainName || '',
          value: '',
          transparent: true,
          big: false,
        },
    },
  }));
}, { deep: true });
</script>

<style>
.container {
  max-width: 1160px;
  margin: 0 auto 48px;
}
</style>
