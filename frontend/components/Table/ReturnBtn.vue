<template>
  <div
    class="button"
    :class="{ active: isHovered }"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <Icon name="Returned" :size="20" />
    <Tooltip data="Returned Task" :active="isHovered" />
  </div>
</template>

<script setup>
import Icon from '@/components/Icons/Icon.vue';
import { ref } from 'vue';
import Tooltip from '@/components/Table/Tooltip.vue';

const isHovered = ref(false);
</script>

<style scoped lang="scss">
// .tooltip-active {
//   display: block;
// }
.btns_wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 17px;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border-radius: 24px;
  cursor: pointer;
  &.active {
    background: #f5f5fd;
  }
}
.arrow-return {
  width: 10px;
  height: 7px;
  color: #aaa7cc;
  &.active {
    color: #6a6d8f;
  }
}
</style>
