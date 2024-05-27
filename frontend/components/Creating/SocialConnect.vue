<script setup>
import Icon from '@/components/Icons/Icon.vue';
defineProps({
  data: Object,
});
</script>

<template>
  <div class="main">
    <Icon :name="data.icon" :size="24"></Icon>
    {{ data.title }}
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: $default_font;
  color: #344054;
  background: #d7dce5;
  font-size: 14px;
}
</style>
