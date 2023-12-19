<template>
  <div class="btn" @click="$emit('click')">
    <slot></slot>
  </div>
</template>
<script setup></script>
<style scoped lang="scss">
.btn {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  background: $blue;
  cursor: pointer;
}
</style>
