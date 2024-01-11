<template>
  <label class="switch" :class="{ small: type === 'small' }">
    <input
      :class="{ small: type === 'small' }"
      type="checkbox"
      :checked="isChecked"
      @change="toggleChecked"
      :disabled="props.isDisabled"
    />
    <span
      class="slider"
      :class="{ small: type === 'small', checked: isChecked, 'not-checked': !isChecked }"
    >
    </span>
  </label>
</template>

<script setup>
import { ref, toRef, watch } from 'vue';
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  isDisabled: { type: Boolean, default: false },
  checkedProp: { type: Boolean, default: false },
  type: { type: String, default: 'normal' },
});

const emit = defineEmits(['checked']);

const isChecked = ref(props.checkedProp);

const checkedPropRef = toRef(props, 'checkedProp');

watch(checkedPropRef, (value) => {
  emit('checked', value);
  isChecked.value = value;
});

function toggleChecked() {
  if (props.isDisabled) return;

  isChecked.value = !isChecked.value;
  emit('checked', isChecked.value);
}
</script>

<style lang="scss" scoped>
.checked-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(91deg) brightness(103%) contrast(102%);
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
  &.isChecked {
    opacity: 1;
  }
}
.checked {
  background: #3249ff !important;
}
.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 32px;
  &.small {
    width: 40px;
    height: 24px;
  }
}

/* Hide the default checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 24px;
  &.small {
    &:before {
      top: 1.2px;
      left: 1.2px;
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    border: 1px solid $colabs-bg;
  }

  &:hover.not-checked:before {
    background: #d7dce5;
  }

  &:hover.checked:before {
  }
}

.slider:before {
  position: absolute;
  content: '';
  width: 24px;
  height: 24px;
  top: 3px;
  left: 3px !important;
  bottom: 4px;
  background: #d7dce5;
  border-radius: 20px;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
  background: $white;
}
input:checked + .slider.small.checked:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}
input + .slider.small.not-checked:before {
  -webkit-transform: translateX(-2px);
  -ms-transform: translateX(-2px);
  transform: translateX(-2px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
