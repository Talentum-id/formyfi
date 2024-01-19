<script setup></script>

<template>
  <div class="btn" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.btn {
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 32px;
  border: 1px solid #e9ecf2;
  background: $white;
  cursor: pointer;
}
</style>
