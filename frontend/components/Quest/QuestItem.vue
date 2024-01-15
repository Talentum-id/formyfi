<template>
  <div class="item" :class="{ active: isActive }" @click="$emit('view', data)">
    <div class="name">{{ data.question }}</div>
    <img v-if="isActive" src="@/assets/icons/play.svg" alt="" />
    <img v-else src="@/assets/icons/lock.svg" alt="" />
  </div>
</template>
<script setup>
defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  align-self: stretch;
  border-radius: 8px;
  opacity: 0.4;
  background: #f5f7fa;
  .name {
    overflow: hidden;
    color: #344054;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: $default_font;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
}
.active {
  border-radius: 8px;
  background: $blue;
  opacity: 1;
  cursor: pointer;
  .name {
    color: $white;
  }
}
</style>
