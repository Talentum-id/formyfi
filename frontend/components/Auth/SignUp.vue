<script setup>
import Input from '@/components/Input.vue';
import VButton from '@/components/Button.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { computed, onMounted, ref } from 'vue';
import { modal } from '@/mixins/modal';
import { reloadingProviders } from '@/constants/reloadingProviders';

const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(['success', 'reject']);

const form = ref({
  fullName: ' ',
  username: '',
  loading: false,
});
const errors = ref({
  username: '',
});

onMounted(async () => {
  try {
    await authStore.findUser(authStore.getPrincipal)
      .then(async (res) => {
        if (res.length) {
          await authStore.fetchExtraIdentities(res[0].extraIdentities ?? []);
          await authStore.setUser(res[0]);

          if (!useAuthStore().isQuest) {
            await router.push('/');
            if (
              (res[0].reload !== undefined && res[0].reload) ||
              reloadingProviders.indexOf(localStorage.getItem('authenticationProvider')) !== -1
            ) {
              await window.location.reload();
            }
          }
          emit('success');
        }
      });
  } catch (e) {
    console.error(e);
    emit('reject');
  }
});

const validationError = computed(() => {
  const username = form.value.username.trim();

  if (username.length < 4 || username.length > 24) {
    return true;
  }

  return Object.values(errors.value).some((value) => !!value.trim());
});

const createAccount = () => {
  form.value.loading = true;
  if (validationError.value) {
    form.value.loading = false;
    return;
  }
  handleLoadingModal();

  authStore
    .register(form.value)
    .then(async (res) => {
      await authStore.setUser(res[0]);

      if (!useAuthStore().isQuest) {
        await router.push('/');
        modal.emit('closeModal', {});
        if (reloadingProviders.indexOf(localStorage.getItem('authenticationProvider')) !== -1) {
          await window.location.reload();
        }
      }

      localStorage.isAuthenticated = true;
      emit('success');
    })
    .catch((error) => {
      modal.emit('closeModal', {});
      handleErrorModal();
      console.error(error);
      emit('reject');
    })
    .finally(() => {
      form.value.loading = false;
    });
};
const validateUsername = () => {
  form.value.username = form.value.username.trim().toLowerCase();
  const alphaNumericWithDot = /^[a-zA-Z0-9.]+$/;

  if (form.value.username.length < 4 || form.value.username.length > 18) {
    errors.value.username = 'Username should have from 4 to 18 characters';

    return;
  }

  if (!alphaNumericWithDot.test(form.value.username)) {
    errors.value.username = 'Username can only consist of alphanumeric characters and dot';
  } else {
    authStore.findUserByUsername(form.value.username)
      .then((status) => {
        if (status) {
          errors.value.username = 'This username already exists';
        } else {
          errors.value.username = '';
        }
      })
      .catch((err) => console.error(err));
  }
};
const handleLoadingModal = () => {
  modal.emit('openModal', {
    title: 'Creating user...',
    message: 'Please wait for a while',
    type: 'loading',
  });
};
const handleErrorModal = () => {
  modal.emit('openModal', {
    title: 'Error Message',
    message: 'Something went wrong!',
    type: 'error',
    actionText: 'Try again',
    fn: createAccount,
  });
};
</script>

<template>
  <div class="main">
    <span class="title">Create account</span>
    <div class="form-block">
      <Input
        name="Username"
        placeholder="Enter your username"
        class="name"
        v-model="form.username"
        :error-text="errors.username.trim()"
        :is-error="!!errors.username.trim().length"
        @focusout="validateUsername()"
      />
      <VButton @click="createAccount()" :disabled="validationError || form.loading">
        <span class="create">{{ form.loading ? 'Loading...' : 'Create' }}</span>
      </VButton>
      <div class="agreement">
        By proceeding, you agree to <span> Terms of Service</span> & <span>Privacy Policy</span>.
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 40px;

  .title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }

  .form-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 40px;
  }

  .create {
    color: $white;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: $default_font;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }

  .agreement {
    color: $primary-text;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: $default_font;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.168px;

    span {
      color: $blue;
      cursor: pointer;
      font-weight: 500;
    }
  }
}
</style>
