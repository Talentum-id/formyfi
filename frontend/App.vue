<template>
  <router-view v-if="isReady" />
  <Modal></Modal>
</template>
<script setup>
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import Modal from '@/components/Modal/Modal.vue';

const authStore = useAuthStore();

const { isReady } = storeToRefs(authStore);

if (!isReady.value) {
  authStore.init();
}
</script>
<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
