<template>
  <Auth>
    <div class="main">
      <span class="title">Welcome to Formify!</span>
      <div class="form-block">
        <AuthButton @click="connectWallet">
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
        <div class="agreement">
          By proceeding, you agree to <span> Terms of Service</span> & <span>Privacy Policy</span>.
        </div>
      </div>
    </div>
  </Auth>
</template>

<script setup>
import Auth from '@/layouts/auth.vue';
import AuthButton from '@/components/Auth/AuthButton.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  sessionStorage.account = '';
});
const nfidConnect = async () => {

};
const connectWallet = async () => {

};
</script>

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
    color: #161e2d;
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
