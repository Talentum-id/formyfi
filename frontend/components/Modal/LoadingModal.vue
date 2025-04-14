<template>
  <div class="connect-loading">
    <div class="connect-loading_title">{{ title }}</div>
    <div class="connect-loading_subtitle">{{ subtitle }}</div>
    <div class="connect-loading_body">
      <div class="custom-loading-icon spin">
        <img :src="loadingIcon" alt="" />
      </div>
      <!--      <img class="wallet-icon" :src="getCurrentWalletIcon(type)" alt="" />-->
    </div>
  </div>
</template>

<script setup>
import loadingIcon from '@/assets/icons/loading-ellipse.svg';

const props = defineProps({
  type: { type: String, default: '' },
  title: { type: String, default: 'Connecting Your Wallet' },
  subtitle: { type: String, default: 'Please connect your wallet to continue' },
});
</script>

<style lang="scss" scoped>
.spin {
  animation: spin 2s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.connect-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    color: #1a1d29;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
  }
  &_subtitle {
    color: #1a1d29;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
.wallet-icon {
  position: absolute;
  width: 88px;
  height: 88px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.connect-loading_body {
  position: relative;
}
.custom-loading-icon {
  position: relative;
  width: 136px;
  height: 136px;
  border: 5px solid #dad9f7;
  border-radius: 50%;
  img {
    position: absolute;
    top: -6px;
    left: -6px;
  }
}
</style>
