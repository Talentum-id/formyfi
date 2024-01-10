<template>
  <router-view v-if="isReady" />
</template>
<script setup>
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { isReady } = storeToRefs(authStore);

if (!isReady.value) {
  authStore.init();
}
</script>
<style lang="scss" scoped></style>
