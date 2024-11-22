<template>
  <TransitionRoot appear :show="visible" as="template" :key="'modal-one'">
    <Dialog as="div" class="relative z-[999999999]" @close="closeModal">
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      ></div>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="div"
          class="body"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="relative">
            <!-- Close button -->
            <div class="close absolute -right-10 -top-10" @click="closeModal" v-if="!isLoading">
              <Icon icon="Cancel" :size="24" />
            </div>
            <!-- Content section -->
            <div class="modal">
              <div class="modal-content flex flex-col items-center gap-4">
                <!-- Media content -->
                <div v-if="customImg">
                  <video v-if="isVideo" controls class="w-full">
                    <source :src="customImg" type="video/mp4" />
                  </video>
                  <audio v-else-if="isAudio" controls class="w-full">
                    <source :src="customImg" type="audio/ogg" />
                    <source :src="customImg" type="audio/mp3" />
                  </audio>
                  <CustomImage v-else :image="customImg" height="160" width="160" />
                </div>

                <!-- Icon based on type -->
                <component v-else :is="getIcon(type)" />

                <!-- Title and message -->
                <span class="title text-lg font-semibold">{{ title }}</span>
                <span class="message text-sm text-gray-600">{{ message }}</span>

                <!-- Bonus link section -->
                <div v-if="refBonusData && refBonusData.link" class="w-full text-center mt-4">
                  <span class="text-center text-lg font-bold"
                    >Earn more points +{{ refBonusData.bonus }} per invite</span
                  >
                  <Link
                    class="bg-gray-100 mt-2 block"
                    :text="refBonusData.link"
                    :value="refBonusData.link"
                    :size="0"
                  />
                </div>

                <!-- Email input -->
                <div v-if="isEmail" class="w-full mt-4">
                  <Input placeholder="Email me a copy of my responses at" v-model="email" />
                </div>

                <!-- Action button -->
                <button
                  v-if="showActionBtn"
                  class="action mt-4 w-full bg-blue-600 text-white rounded-lg py-2 font-medium"
                  @click="handleAction"
                >
                  {{ actionText }}
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import Icon from '@/components/Icons/Icon.vue';
import CustomImage from '@/components/CustomImage.vue';
import Link from '@/components/Table/Link.vue';
import Input from '@/components/Input.vue';
import { checkFileFormat } from '@/util/helpers';
import { modal } from '@/mixins/modal';
import warning from '@/assets/icons/modal/warning.vue';
import success from '@/assets/icons/modal/success.vue';
import error from '@/assets/icons/modal/error.vue';
import loading from '@/assets/icons/modal/loading.vue';

// Props and state variables
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
const isVideo = ref(false);
const isAudio = ref(false);

// Close and action functions
const closeModal = () => {
  visible.value = false;
};
const handleAction = () => {
  if (action && typeof action === 'function') {
    if (isEmail.value && email.value) sendEmail(email.value);
    action();
  }
  closeModal();
};

// Icon component based on type
const getIcon = (type) => {
  const icons = { warning, success, error, loading };
  return icons[type] || warning;
};

// Modal open handler
const openModal = async (data) => {
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
  await checkFileType();
};

// File format checker
const checkFileType = async () => {
  isVideo.value = await checkFileFormat(customImg.value, 'video');
  if (!isVideo.value) isAudio.value = await checkFileFormat(customImg.value, 'audio');
};

// Computed properties
const isLoading = computed(() => type.value === 'loading');
const showActionBtn = computed(() => !isLoading.value && action);

// Disable scroll when modal is visible
watchEffect(() => {
  document.body.style.overflow = visible.value ? 'hidden' : '';
});

// Listen to open/close events from the modal mixin
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
  display: flex;
  justify-content: center;
}
.body {
  margin: auto;
  .close {
    width: 40px;
    height: 40px;
    border-radius: 24px;
    background: #f5f7fa;
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
    align-items: center;
    gap: 16px;
    width: 480px;
    padding: 32px;
    border-radius: 16px;
    background: #f5f7fa;
    .title {
      color: #333;
      font-size: 24px;
      font-weight: 500;
    }
    .message {
      color: #666;
      text-align: center;
      font-size: 16px;
    }
    .action {
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
