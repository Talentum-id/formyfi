<template>
  <div class="modal-container" v-if="visible">
    <div ref="modalContainer" class="body">
      <div class="close" @click="closeModal" v-if="!isLoading">
        <Icon icon="Cancel" :size="24"></Icon>
      </div>
      <div class="modal">
        <div v-if="customImg" v-html="customImg" class="h-20 w-20"></div>
        <component v-else :is="getIcon(type)" />
        <span class="title">{{ title }}</span>
        <span class="message">{{ message }}</span>
        <div class="action" v-if="showActionBtn" @click="handleAction()">
          {{ actionText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { modal } from '@/mixins/modal';
import Icon from '@/components/Icons/Icon.vue';
import warning from '@/assets/icons/modal/warning.vue';
import success from '@/assets/icons/modal/success.vue';
import error from '@/assets/icons/modal/error.vue';
import loading from '@/assets/icons/modal/loading.vue';
const visible = ref(false);
const title = ref('');
const message = ref('');
const actionText = ref('');
const customImg = ref('');
const type = ref('');
let action = null;

const closeModal = () => {
  visible.value = false;
};
const handleAction = () => {
  if (action && typeof action === 'function') {
    action();
  }
  closeModal();
};

const getIcon = (type) => {
  switch (type) {
    case 'warning':
      return warning;
    case 'success':
      return success;
    case 'error':
      return error;
    case 'loading':
      return loading;
    default:
      return warning;
  }
};
const openModal = (data) => {
  visible.value = true;
  title.value = data.title;
  message.value = data.message;
  type.value = data.type;
  actionText.value = data.actionText;
  customImg.value = data.customImg;
  action = data.fn;
};
const isLoading = computed(() => {
  return type.value === 'loading';
});
const showActionBtn = computed(() => {
  return !isLoading.value && action;
});
modal.on('openModal', openModal);
modal.on('closeModal', closeModal);
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
      border-radius: 24px;
      background: #f5f7fa;
      margin-left: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        cursor: pointer;
      }
    }
    .modal {
      display: flex;
      width: 480px;
      padding: 32px;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      border-radius: 16px;
      background: #f5f7fa;
      img {
        width: 80px;
        height: 80px;
      }
      .title {
        color: $primary-text;
        font-variant-numeric: slashed-zero;
        font-family: $default_font;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: 40px; /* 166.667% */
      }
      .message {
        color: $primary-text;
        text-align: center;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-family: $default_font;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
      .action {
        cursor: pointer;
        width: 100%;
        display: flex;
        height: 40px;
        padding: 7px 12px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex: 1 0 0;
        border-radius: 8px;
        background: $blue;
        color: $white;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-family: $default_font;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
    }
  }
}
</style>
