<template>
  <router-view />
</template>
<script setup>
import { useCounterStore } from '@/store';
import { computed } from 'vue';

const store = useCounterStore();
const count = computed(() => store.doubleCount);
const increase = () => {
  store.increment();
};
</script>
<style lang="scss" scoped></style>
