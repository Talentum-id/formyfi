<script setup>
import { computed, onMounted } from 'vue';
import Quest from '@/components/Quest/Quest.vue';
import Default from '@/layouts/default.vue';
import { useQAStore } from '@/store/qa';
import { useResponseStore } from '@/store/response';
import { useRoute } from 'vue-router';

onMounted(() => {
  useQAStore().fetchQA(useRoute().params.id);
  useResponseStore().fetchResponse(data.value?.shareLink);
});

const data = computed(() => useQAStore().getQA);
const loaded = computed(() => useQAStore().getLoadingStatus);
</script>

<template>
  <Default><quest :data="data" v-if="loaded && data"></quest></Default>
</template>

<style scoped lang="scss"></style>
