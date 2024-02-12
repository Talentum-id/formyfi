<script setup>
defineProps({
  length: {
    type: Number,
    default: 1,
  },
  currentIndex: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <div class="counter w-full">
    <div
      class="count"
      v-for="(i, idx) in length"
      :key="i"
      :class="{ active: currentIndex >= idx }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.counter {
  display: flex;
  padding-top: 4px;
  flex: 1 0 0;
  align-items: flex-start;
  gap: 2px;
  height: fit-content;

  .count {
    height: 4px;
    width: 100%;
    border-radius: 4px;
    background: $default-border;
  }

  .active {
    background: #344054;
  }
}
</style>
