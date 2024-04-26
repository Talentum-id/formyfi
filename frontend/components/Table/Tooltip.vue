<template>
  <div class="tooltip-icon">
    <slot> </slot>
    <div class="tooltip-checkbox" v-if="tooltipText">{{ props.tooltipText }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  tooltipText: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.tooltip-icon {
  position: relative;
  cursor: pointer;

  &:hover {
    .tooltip-checkbox {
      display: block;
    }
  }
}
.tooltip-checkbox {
  display: none;
  position: absolute;
  bottom: -10px;
  width: fit-content;
  min-width: 150px;
  left: 50%;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
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

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 14px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    z-index: -1;
    top: 10px;
    left: 50%;
  }
}
</style>
