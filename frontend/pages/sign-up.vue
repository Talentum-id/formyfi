<template>
  <Auth>
    <div class="main">
      <span class="title">Create account</span>
      <div class="form-block">
        <Input name="Username" placeholder="Enter your username" class="name" />
        <Input name="Name & Surname" placeholder="Enter your name and surname" class="name" />
        <Button @click="createAccount()">
          <span class="create">Create</span>
        </Button>
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
import Button from '@/components/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const createAccount = () => {
  router.push('/');
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
