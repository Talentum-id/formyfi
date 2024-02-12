<script setup>
import Icon from '@/components/Icons/Icon.vue';
</script>

<template>
  <div class="main">
    <div class="close" @click="$emit('close')">
      <Icon name="Cancel" :size="24"></Icon>
    </div>
    <div class="current-item">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  height: calc(100% - 128px);
  position: relative;

  .close {
    display: flex;
    padding: 8px;
    align-items: flex-start;
    gap: 10px;
    position: absolute;
    right: -40px;
    top: -40px;
    border-radius: 24px;
    background: #f5f7fa;
    height: 40px;
    width: 40px;
    cursor: pointer;
  }

  .current-item {
    display: flex;
    width: 720px;
    height: 100%;
    padding: 40px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    border-radius: 16px;
    background: #f5f7fa;
  }
}
</style>
