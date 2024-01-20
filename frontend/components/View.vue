<script setup>
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div @click="$router.push(`/quest/${value}`)"><Icon name="View" :size="24"></Icon></div>
</template>

<style scoped lang="scss">
div {
  cursor: pointer;
  display: flex;
  width: 32px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #f5f7fa;
}
</style>
