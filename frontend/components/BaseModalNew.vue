<template>
  <TransitionRoot :show="open" as="template" :key="'modal-one'">
    <Dialog as="div" class="relative z-[9999]" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 m-3">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto relative w-screen max-w-xl">
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-500"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-500"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <div class="absolute left-0 top-0 -ml-12 flex pr-2 pt-4">
                    <button type="button" class="relative close-modal-btn" @click="closeModal">
                      <button>
                        <Icon name="Delete" :size="24" />
                      </button>
                    </button>
                  </div>
                </TransitionChild>
                <div class="modal-body">
                  <div class="relative flex-1">
                    <slot></slot>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import Icon from '@/components/Icons/Icon.vue';
const emit = defineEmits(['close']);

const props = defineProps({
  visible: { type: Boolean, default: false },
});

const open = ref(props.visible);

function closeModal() {
  open.value = false;
  setTimeout(() => {
    emit('close', open.value);
  }, 500);
}
watch(props.visible, () => {
  setTimeout(() => {
    open.value = props.visible;
  }, 500);
});
</script>
<style lang="scss">
.close-modal-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: $default-bg;
  border-radius: 24px;
  border: none;
  color: $default;

  cursor: pointer;
  &.btnLeft {
    top: 20px;
    right: 0;
    left: -50px;
  }

  &:hover {
    background: $default-badge-border;
  }
}

.modal-body {
  overflow-y: scroll;
  background: $default-bg;
  border-radius: 16px;
  max-height: 100%;
  &.isScrollOff {
    overflow-y: inherit;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 90%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }

  &.fullHeight {
    height: 100%;
  }
}
</style>
