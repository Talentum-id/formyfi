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
  <div class="relative btn-block">
    <div class="tooltip-checkbox">View form</div>
    <div @click="fn" class="btn"><Icon name="View" :size="18"></Icon></div>
  </div>
</template>

<style scoped lang="scss">
.btn {
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
.btn-block {
  &:hover {
    .tooltip-checkbox {
      display: block !important;
    }
  }
}
.tooltip-checkbox {
  position: absolute;
  display: none;
  min-width: 80px;
  width: fit-content;
  background: $default;
  box-shadow: 0 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  z-index: 9999999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $white;
  text-align: left;
  bottom: 60px;
  left: 15%;
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    z-index: -1;
    top: 18px;
    left: 50%;
  }
}
</style>
