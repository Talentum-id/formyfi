<template>
  <Auth>
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
        <Input
          name="Name & Surname"
          placeholder="Enter your name and surname"
          class="name"
          v-model="form.fullName"
        />
        <VButton @click="createAccount()" :disabled="validationError || form.loading">
          <span class="create">{{ form.loading ? 'Loading...' : 'Create' }}</span>
        </VButton>
        <div class="agreement">
          By proceeding, you agree to <span> Terms of Service</span> & <span>Privacy Policy</span>.
        </div>
      </div>
    </div>
  </Auth>
</template>

<script setup>
import Auth from '@/layouts/auth.vue';
import Input from '@/components/Input.vue';
import VButton from '@/components/Button.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  username: '',
  fullName: '',
  loading: false,
});
const errors = ref({
  username: '',
});

onMounted(() => {
  const user = authStore.principal?.toText() ?? authStore.email;
  console.log(user);
  authStore.actor?.findUser(user).then((res) => {
    if (res.length) {
      authStore.setUser(res[0]);

      router.push('/');
    }
  });
});

const validationError = computed(() => {
  const username = form.value.username.trim();

  if (form.value.fullName.trim() === '' || username === '') {
    return true;
  }

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

  authStore.actor
    ?.register(form.value.username, form.value.fullName)
    .then((res) => {
      authStore.setUser(res[0]);
      router.push('/');

      localStorage.isAuthenticated = true;
    })
    .catch((error) => console.log(error))
    .finally(() => (form.value.loading = false));
};

const validateUsername = () => {
  form.value.username = form.value.username.trim().toLowerCase();
  const alphaNumericWithDot = /^[a-zA-Z0-9.]+$/;

  if (form.value.username.length < 4 || form.value.username.lengt < 24) {
    errors.value.username = 'Username should have from 4 to 12 characters';

    return;
  }

  if (!alphaNumericWithDot.test(form.value.username)) {
    errors.value.username = 'Username can only consist of alphanumeric characters and dot';
  } else {
    authStore.actor
      ?.findUsername(form.value.username)
      .then((status) => {
        if (status) {
          errors.value.username = 'This username already exists';
        } else {
          errors.value.username = '';
        }
      })
      .catch((err) => console.log(err));
  }
};
</script>

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
