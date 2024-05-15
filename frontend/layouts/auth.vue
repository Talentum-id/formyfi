<template>
  <div class="auth-wrapper">
    <div class="wrapper-image">
      <img src="@/assets/images/auth_bg.png" alt="Login" />
    </div>
    <div class="auth-container">
      <div class="header">
        <img
          class="logo cursor-pointer"
          @click="goLogin"
          src="@/assets/images/logo-ligth.svg"
          width="134"
        />
      </div>
      <div class="auth w-full">
        <div class="content">
          <slot />
        </div>
      </div>
      <div class="footer">
        <div>Copyright © Formyfi 2024</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goLogin = () => {
  router.push('login');
};

const goToSocial = (link) => {
  window.open(link, '_blank');
};
</script>
<style scoped lang="scss">
.auth-wrapper {
  margin: 0;
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  // Internet computer cannot read background image, this needs to be fixed
  //background: url('@/assets/images/auth_bg.png') no-repeat;
  //background-size: cover;
  .wrapper-image {
    position: fixed;
    width: 100vw;
    height: 100vh;
    img {
      width: 100vw;
      height: 100vh;
    }
  }
}

.auth-container {
  position: relative;
  z-index: 10;
  margin: 0;
  width: 100vw;
  display: flex;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  height: min-content;
  flex-direction: column;

  .header {
    position: absolute;
    top: 0;
    padding: 32px;
    width: 100vw;
  }

  .auth {
    max-width: 520px;
    margin: auto;
    background: $default-bg;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      padding: 60px 64px;
    }
  }

  .footer {
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    max-width: 100vw;

    div {
      font-family: $default_font;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $dark;
    }

    .socials {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      * {
        filter: invert(100%) sepia(98%) saturate(8%) hue-rotate(178deg) brightness(101%)
          contrast(101%);
      }
    }
  }
}
</style>
