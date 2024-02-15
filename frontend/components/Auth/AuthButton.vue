<script setup></script>

<template>
  <div class="btn" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.btn {
  box-sizing: border-box;
  background-color: $white;
  background-image: none;
  border: 1px solid #dadce0;
  max-width: 400px;
  min-width: 200px;
  width: 392px;
  border-radius: 20px;
  color: #3c4043;
  cursor: pointer;
  font-family: 'Google Sans', arial, sans-serif;
  font-size: 14px;
  height: 40px;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  padding: 8px 12px;
  position: relative;
  text-align: center;
}
</style>
