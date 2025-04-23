<template>
  <div class="demo-color-block z-10">
    <span class="demonstration">{{ label }}</span>
    <el-color-picker 
      :model-value="modelValue" 
      show-alpha 
      :predefine="predefineColors"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElColorPicker } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: String,
    default: 'rgba(255, 69, 0, 0.68)'
  },
  label: {
    type: String,
    default: 'Color'
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
])
</script>

<style scoped lang="scss">
.demo-color-block {
  z-index: 9999999;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  justify-content: space-between;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.demonstration {
  margin-right: 16px;
  color: #606266;
  font-size: 14px;
}

:deep(.el-color-picker) {
  height: 32px;
  width: 32px;
}

:deep(.el-color-picker__trigger) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-color-picker__color) {
  border: none;
}
</style> 