<script setup>
import AuthButton from '@/components/Auth/AuthButton.vue';
import { useAuthStore } from '@/store/auth';
import { googleLogout } from 'vue3-google-login';
import { onMounted, watch } from 'vue';

onMounted(() => {
  googleLogout();

  useAuthStore().setAuthenticationStorage(false);
});
const callback = async (response) => {
  try {
    await useAuthStore()
      .loginWithGoogle(response.credential)
      .then((e) => {
        emit('success');
      });
  } catch (e) {
    console.log(e);
    emit('reject');
  }
};
const authStore = useAuthStore();
const emit = defineEmits(['success', 'reject']);

const nfidConnect = async () => {};

const connect = async () => {
  try {
    await authStore.loginWithII();
  } catch (e) {
    emit('reject');
  }
};

watch(
  () => authStore.isAuthenticated,
  () => {
    emit('success');
  },
);
</script>

<template>
  <div class="main">
    <span class="title">Welcome to Formyfi!</span>
    <div class="form-block">
      <AuthButton @click="connect()">
        <div class="container">
          <img src="@/assets/images/definity.svg" alt="Dfinity" />
          <div class="name-social">Internet Identity</div>
        </div>
      </AuthButton>
      <AuthButton @click="nfidConnect">
        <div class="container">
          <img src="@/assets/images/nfid.svg" alt="NFID" />
          <div class="name-social">NFID</div>
        </div>
      </AuthButton>
      <GoogleLogin
        style="margin-top: -4px"
        :callback="callback"
        :buttonConfig="{
          logo_alignment: 'center',
          width: '392px',
          shape: 'pill',
          text: 'signin_with',
        }"
      />
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
  gap: 27px;

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
    gap: 27px;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;

    .name-social {
      color: #344054;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: $default_font;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
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
