<template>
  <router-view v-if="isReady" />
</template>
<script setup>
import { useAuthStore } from '@/store/auth';
import { useAssetsStore } from '@/store/assets';
import { useQAStore } from '@/store/qa';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const assetsStore = useAssetsStore();
const qaStore = useQAStore();

const { isReady } = storeToRefs(authStore);

if (!isReady.value) {
  authStore.init();
} else {
  if (assetsStore.actor === null) assetsStore.init();

  if(qaStore.actor == null) qaStore.init();
}
</script>
<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
