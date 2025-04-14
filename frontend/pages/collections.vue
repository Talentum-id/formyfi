<template>
  <Default>
    <div class="flex flex-col gap-12 container">
      <div class="flex flex-row items-center justify-between">
        <div class="font-light font-familyLight text-secondary-10 text-5xl">NFT Collections</div>
        <div class="flex flex-row gap-6">
          <InputWithSearch
            :placeholder="'Find an NFT Collection...'"
            :iconSize="24"
            v-model="search"
          />

          <BaseButton
            class="!text-light font-medium"
            text="Create NFT Collection"
            @click="modalVisible = true"
          />
        </div>
      </div>
      <BaseTable
        v-if="loaded"
        :columns="collectionColumns"
        :rows="collectionRows"
        pointer
        title="So far, no NFT Collection has been created"
        icon="icons8-futurama-nibbler"
        sortFunction="sortTasks"
      />
      <TableSkeleton v-else />
      <Pagination
        :currentPage="page"
        @pageChanged="nextPage($event)"
        v-if="loaded"
        :totalPages="total_pages"
      />
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

const router = useRouter();
const modalVisible = ref(false);
const isConfirmModalOpen = ref(false);
const search = ref('');

const page = ref(1);
const total_pages = ref(5); 
const collectionList = ref([]);
const loaded = ref(true);
const roles = inject('roles');

const debouncedSearch = useDebounce(search, 1000);

const params = computed(() => ({
  page: page.value,
  per_page: 10,
  ...(debouncedSearch.value && { search: debouncedSearch.value }),
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

// Mock data generator
const generateMockCollections = (count = 10) => {
  const mockProjects = [
    { name: 'CryptoPunks', logo: defaultBg },
    { name: 'Bored Ape Yacht Club', logo: defaultBg },
    { name: 'Art Blocks', logo: defaultBg },
    { name: 'Doodles', logo: defaultBg },
    { name: 'Azuki', logo: defaultBg },
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Collection ${index + 1}`,
    project: mockProjects[Math.floor(Math.random() * mockProjects.length)],
    max_supply: Math.floor(Math.random() * 10000),
    unlimited_supply: Math.random() > 0.7,
    available: Math.floor(Math.random() * 5000),
    address: `0x${Math.random().toString(16).substr(2, 40)}`,
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
  }));
};

const getCollections = async () => {
  loaded.value = false;
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock data based on search
    let mockData = generateMockCollections();
    if (search.value) {
      mockData = mockData.filter(item => 
        item.name.toLowerCase().includes(search.value.toLowerCase()) ||
        item.project.name.toLowerCase().includes(search.value.toLowerCase())
      );
    }

    // Simulate pagination
    const start = (page.value - 1) * 10;
    const end = start + 10;
    collectionList.value = mockData.slice(start, end);
    
  } catch (error) {
    console.error('Error fetching collections:', error);
  } finally {
    loaded.value = true;
  }
};

onMounted(async () => {
  await getCollections();
});

const collectionColumns = computed(() => {
  return [
    { prop: 'name', label: 'Collection Name', width: '100%' },
    { prop: 'project', label: 'Project Name', width: '120%' },
    { prop: 'supply', label: 'Supply', width: '60%' },
    { prop: 'available', label: 'Available', width: '60%' },
    { prop: 'address', label: 'Contract Address', width: '95%' },
  ];
});

const collectionRows = computed(() => {
  const collectionsArray = collectionList.value;

  if (!collectionsArray?.length) {
    return [];
  }

  return collectionsArray.map((item) => ({
    name: {
      content: item.name,
    },
    project: {
      component: Talent,
      props: {
        text: item.project ? item.project.name : '',
        img: item.project.logo || defaultBg,
      },
    },
    supply: {
      content: item.unlimited_supply ? 'Unlimited' : item.max_supply,
    },
    available: {
      content: item.unlimited_supply ? 'Unlimited' : item.available,
    },
    address: {
      component: Address,
      props: {
        address: item.address ?? '',
      },
    },
  }));
});
</script>

<style>
.container {
  max-width: 1160px;
  margin: 0 auto 48px;
}
</style>
