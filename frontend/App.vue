<template>
  <router-view v-if="isReady" />
</template>
<script setup>
import { useCounterStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const store = useCounterStore();

const { isReady } = storeToRefs(authStore);

if (!isReady.value) {
  authStore.init();
}
</script>
<style lang="scss" scoped></style>
