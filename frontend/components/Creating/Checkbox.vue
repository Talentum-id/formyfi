<template>
  <label class="checkbox-container">
    <input type="checkbox" v-model="isChecked" @change="change" />
    <span class="checkmark"></span>
    <span class="label">
      {{ label }}
    </span>
  </label>
</template>

<script setup>
import { ref, watch } from 'vue';

const isChecked = ref(false);
const emit = defineEmits(['check']);
const props = defineProps({
  reset: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});
const change = () => {
  emit('check', isChecked.value);
};

watch(() => {
  if (props.reset) {
    isChecked.value = false;
  }
});
</script>

<style scoped lang="scss">
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 3px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid $default-border;
    background: $white;

    &:after {
      content: '';
      position: absolute;
      display: none;
    }
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    left: 7px;
    top: 4px;
    width: 5px;
    height: 8px;
    border: solid $default;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}

.label {
  color: $default;
  font-size: 14px;
  font-family: $default_font;
  font-weight: 500;
}
</style>
