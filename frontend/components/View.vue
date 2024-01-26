<script setup>
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  fn: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div @click="fn"><Icon name="View" :size="18"></Icon></div>
</template>

<style scoped lang="scss">
div {
  cursor: pointer;
  display: flex;
  width: 26px;
  height: 26px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #f5f7fa;
}
</style>
