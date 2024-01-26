<template>
  <div class="modal-container">
    <div ref="modalContainer" class="body">
      <div class="close" @click="$emit('close')"><Icon icon="Cancel" :size="24"></Icon></div>
      <div class="modal" :style="`width: ${width}px;`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'Modal',
  components: { Icon },
  props: {
    width: { type: Number, default: 360 },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  z-index: 999999999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(26, 29, 41, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  .body {
    margin: auto;
    .close {
      width: 40px;
      height: 40px;
      background: $default-bg;
      border: 1px solid $default-border;
      border-radius: 24px;
      margin-bottom: 12px;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        cursor: pointer;
      }
    }
    .modal {
      display: flex;
      flex-direction: column;
      padding: 32px;
      gap: 24px;
      background: $default-bg;
      border-radius: 16px;
    }
  }
}
</style>
