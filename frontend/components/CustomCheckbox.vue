<template>
  <label class="checkbox">
    <input
      type="checkbox"
      :checked="checked"
      @change="toggleChecked"
      :disabled="props.isDisabled"
    />
    <span class="checkmark" v-if="checked">
      <Icon class="checkmark-icon" name="Tik" :size="16" />
    </span>
    <span class="checkmark" v-else> </span>
    <slot></slot>
  </label>
</template>

<script setup>
import { ref, watch, toRef } from 'vue';
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  isDisabled: { type: Boolean, default: false },
  checkedProp: { type: Boolean, default: false },
});

const emit = defineEmits(['checked']);

const checked = ref(props.checkedProp);

function toggleChecked() {
  checked.value = !checked.value;
  emit('checked', checked.value);
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  font-feature-settings: 'zero' on;
  color: $default;
}

.checkmark {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 0.25em;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 4px;
  margin-right: 0.5em;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.checkmark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

input[type='checkbox']:disabled ~ .checkmark {
  opacity: 0.6;
  cursor: not-allowed;
}
label {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}
</style>
