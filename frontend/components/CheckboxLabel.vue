<template>
  <div class="checkbox-label">
    <CustomCheckbox
      @checked="emit('checked', $event)"
      :checkedProp="checkedPropRef"
      :isDisabled="isDisabled"
      ><span>{{ text }}</span></CustomCheckbox
    >

    <TooltipIcon v-if="!hideTooltipIcon && isTooltipActive" :tooltipText="tooltipText" />
  </div>
</template>

<script setup>
import { watch, toRef } from 'vue';
import TooltipIcon from '@/components/Creating/TooltipIcon.vue';

const props = defineProps({
  text: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  tooltipText: { type: String, default: '' },
  hideTooltipIcon: { type: Boolean, default: false },
  checkedProp: { type: Boolean, default: false },
  isTooltipActive: { type: Boolean, default: true },
});

const checkedPropRef = toRef(props, 'checkedProp');

const emit = defineEmits(['checked']);
</script>

<style lang="scss" scoped>
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
}
</style>
