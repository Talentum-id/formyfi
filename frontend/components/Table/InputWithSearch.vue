<template>
  <div class="input-wrapper">
    <Icon class="search-icon" name="Search" :size="iconSize" />
    <input
      :value="modelValue"
      @input="emitSearchValue($event.target.value)"
      type="text"
      :placeholder="placeholder"
      :class="{ fullWidth }"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import Icon from '@/components/Icons/Icon.vue';

const emit = defineEmits(['modelValue']);

const { placeholder, iconSize, intervalFunc } = defineProps({
  placeholder: {
    type: String,
    default: 'value123',
  },
  modelValue: {
    type: String,
  },
  iconSize: {
    type: [String, Number],
    default: 24,
  },
  intervalFunc: {
    type: Function,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const emitSearchValue = (value) => {
  if (intervalFunc) {
    emit('update:modelValue', value);
    intervalFunc();
  } else {
    emit('update:modelValue', value);
  }
};
</script>

<style scoped lang="scss">
.input-wrapper {
  position: relative;
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    width: 240px;
    height: 40px;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    padding-left: 44px;
    outline: none;

    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $default;
    box-sizing: border-box;

    &:hover {
      border: 1px solid $transparent-hover-border;
    }

    &:focus {
      box-shadow: 0 0 0 3px $default-border;
    }
  }

  .fullWidth {
    width: 100%;
  }
}
</style>
