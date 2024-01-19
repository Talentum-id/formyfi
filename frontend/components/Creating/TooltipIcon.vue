<template>
  <div class="tooltip-icon">
    <div class="tooltip-checkbox" :class="{ isLeft, isVertical }" v-if="tooltipText">
      {{ props.tooltipText }}
    </div>
    <Icon class="hovered" name="Info-1px-color" :size="24" />
    <Icon class="def" name="Info-1px" :size="24" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  text: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  tooltipText: { type: String, default: '' },
  isLeft: { type: Boolean, default: false },
  isVertical: { type: Boolean, default: false },
  isWhite: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.isWhite {
  filter: invert(94%) sepia(94%) saturate(0%) hue-rotate(220deg) brightness(105%) contrast(109%);
}

.tooltip-icon {
  position: relative;
  cursor: pointer;
  .hovered {
    display: none !important;
  }
  .def {
    display: inline-block !important;
    &.isWhite {
      filter: invert(94%) sepia(94%) saturate(0%) hue-rotate(220deg) brightness(105%) contrast(109%);
    }
  }
  &:hover {
    .tooltip-checkbox {
      display: block;
    }
    .hovered {
      display: inline-block !important;
    }
    .def {
      display: none !important;
    }
  }
}
.tooltip-checkbox {
  display: none;
  position: absolute;
  bottom: -10px;
  // width: 200px;
  min-width: 170px;
  width: fit-content;
  left: 50%;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 9999999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;

  font-family: 'Basis Grotesque Pro';
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

  &.isLeft {
    left: -50px;
    &:after {
      left: 147px;
    }
  }

  &.isVertical {
    bottom: 64px;
    left: 5px;
    &:after {
      top: 34px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    z-index: -1;
    top: 8px;
    left: 50%;
  }
}
</style>
