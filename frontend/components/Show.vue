<script setup>
const props = defineProps({
  fn: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div @click="fn"><img src="@/assets/icons/show.svg" alt="show" /></div>
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
  img {
    width: 18px;
    height: 18px;
  }
}
</style>
