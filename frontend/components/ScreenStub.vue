<template>
  <div class="screen-stub">
    <img class="header" src="@/assets/images/logo-ligth.svg" width="134" height="24" alt="logo" />
    <div class="msg">
      <span class="title"
        >{{ device }} version<br />
        under development
      </span>
      <span class="message"
        >Please rotate your tablet to landscape orientation to view Formify</span
      >
      <div class="view-desktop-btn" @click="setDesktop">View Desktop Version</div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';

const device = computed(() => {
  const width = window.innerWidth;
  if (width <= 880) {
    return 'Mobile';
  } else if (width > 880 && width < 1024) {
    return 'Tablet';
  } else if (width >= 1024 && width < 1330) {
    return 'Small Laptop';
  }
});

onMounted(() => {
  localStorage.scale = false;
});
const width = ref(window.innerWidth);

const setDesktop = () => {
  if (device.value === 'Tablet') {
    localStorage.scale = 0.5;
  } else if (device.value === 'Mobile') {
    localStorage.scale = 0.15;
  } else if (device.value === 'Small Laptop') {
    localStorage.scale = 0.75;
  }
  window.location.href = '/';
};
</script>
<style scoped lang="scss">
.screen-stub {
  height: 100vh;
  width: 100vw;
  background: url('@/assets/images/auth_bg.png') no-repeat;
  background-size: cover;
  display: flex;
  position: relative;
  flex-direction: column;
  z-index: 9999999999999;

  .header {
    margin: 24px auto;
  }

  .msg {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 32px;
    margin-top: 25vh;

    .title {
      color: $dark;
      text-align: center;
      font-family: $default_font;
      font-size: 48px;
      font-style: normal;
      font-weight: 350;
      line-height: 64px;
    }

    .message {
      color: $dark;
      text-align: center;
      font-family: $default_font;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin: 0 25px;
    }

    .view-desktop-btn {
      cursor: pointer;
      display: flex;
      padding: 4px 8px;
      align-items: center;
      margin: 0 auto;
      gap: 8px;
      border-radius: 8px;
      background: $default-bg;
      color: $dark;
      width: fit-content;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
  }
}
</style>
