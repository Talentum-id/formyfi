<template>
  <div class="modal-container" v-if="visible">
    <div ref="modalContainer" class="body">
      <div class="close" @click="closeModal" v-if="!isLoading">
        <Icon icon="Cancel" :size="24"></Icon>
      </div>
      <div class="modal">
        <div v-if="customImg">
          <img :src="customImg" :alt="title" class="rounded !h-40 !w-40" />
        </div>
        <component v-else :is="getIcon(type)" />
        <span class="title">{{ title }}</span>
        <span class="message">{{ message }}</span>
        <div v-if="refBonusData && refBonusData.link" class="w-full text-center">
          <span class="text-center text-2xl title"
            >Earn more points +{{ refBonusData.bonus }} per invite</span
          >
          <Link
            class="bg-white mt-4"
            :text="refBonusData.link"
            :value="refBonusData.link"
            :size="30"
          ></Link>
        </div>
        <div v-if="isEmail" class="flex flex-col gap-4 w-full">
          <Input placeholder="Email me a copy of my responses at" v-model="email"></Input>
        </div>
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
import Link from '@/components/Table/Link.vue';
import Input from '@/components/Input.vue';
const visible = ref(false);
const isEmail = ref(false);
const title = ref('');
const refBonusData = ref(null);
const message = ref('');
const email = ref('');
const actionText = ref('');
const customImg = ref('');
const type = ref('');
let action = null;
let sendEmail = null;

const closeModal = () => {
  visible.value = false;
};
const handleAction = () => {
  if (action && typeof action === 'function') {
    if (isEmail.value && email.value) {
      sendEmail(email.value);
    }
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
  refBonusData.value = data.refBonusData;
  isEmail.value = data.isEmail;
  action = data.fn;
  sendEmail = data.sendEmail;
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
