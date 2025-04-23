<template>
  <div class="z-10">
    <el-color-picker :model-value="modelValue" show-alpha :predefine="predefineColors"
      @update:model-value="$emit('update:modelValue', $event)" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElColorPicker } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: String,
    default: '#f5f5fd'
  }
})

defineEmits(['update:modelValue'])

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
  '#f5f5fd',
])
</script>
