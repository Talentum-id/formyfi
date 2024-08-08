<template>
  <div class="flex w-full gap-6">
    <div
      v-for="option in size"
      :key="option"
      :class="{ 'radio-button': true, 'radio-button--selected': selectedValue === option }"
    >
      <label class="flex flex-col items-center gap-1">
        <input
          type="radio"
          :disabled="disabled"
          :value="option"
          v-model="selectedValue"
          @change="updateValue(option)"
          class="radio-button__input"
        />
        <span class="radio-button__label">{{ option }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    required: true,
    default: 10,
  },
  modelValue: {
    default: null,
  },
});

const emit = defineEmits(['select']);
const selectedValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  },
);

const updateValue = (value) => {
  emit('select', value);
};
</script>

<style scoped lang="scss">
.radio-button {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

.radio-button__input {
  width: 24px;
  height: 24px;
  color: $secondary;
}

.radio-button--selected {
  .radio-button__input {
    border: 3px solid $blue;
  }
}
.radio-button__input {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 3px solid $secondary;
  border-radius: 50%;
  position: relative;
  outline: none;
  cursor: pointer;
}

.radio-button__input::before {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background-color: $blue;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease-in-out;
}

.radio-button__input:checked::before {
  transform: translate(-50%, -50%) scale(1);
}

.radio-button__label {
  cursor: pointer;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $secondary;
}
</style>
