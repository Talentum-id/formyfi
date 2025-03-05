<script setup>
import Modal from '@/components/Quest/Modal.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const show = ref(false);
const loading = ref(false);

const authStore = useAuthStore();

const deleteAccount = async () => {
  loading.value = true;
  await authStore.deleteAccount();

  show.value = false;
  loading.value = false;
}
</script>

<template>
  <BaseButton @click="show = true" type="danger" icon="Delete-def">
    Delete account
  </BaseButton>
  <Modal v-if="show" @close="show = !show" width="520">
    <div class="modal-container">
      <span>Are you sure you want to delete the account?</span>
      <div class="controllers">
        <BaseButton text="Cancel" @click="show = !show" type="primary" />
        <BaseButton
          :text="!loading ? 'Delete' : 'Deleting...'"
          @click="deleteAccount()"
          :disabled="loading"
          type="normal"
        />
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.modal-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 32px;

  span {
    color: $section-title;
    text-align: center;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 40px;
  }

  .controllers {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    div {
      width: 184px;
    }
  }
}
</style>