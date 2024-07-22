<template>
  <div class="w-10 h-9">
    <label class="checkbox-container">
      <input type="checkbox" v-model="isChecked" @change="change" />
      <span class="checkmark"></span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isChecked = ref(false);
const emit = defineEmits(['check']);

const change = () => {
  emit('check', isChecked.value);
};
</script>

<style scoped lang="scss">
.checkbox-container {
  display: block;
  position: relative;
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
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid $default-border;
    background: #f5f7fa;

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
    left: 12px;
    top: 4px;
    width: 8px;
    height: 18px;
    border: solid $default;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}
</style>
