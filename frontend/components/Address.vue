<template>
  <div v-if="props.address" class="address_wrapper" @click.self="copy">
    <span> {{ makeShortenWalletAddress(props.address) }} </span> <Icon name="Copy" :size="20" />
  </div>
</template>

<script setup>
import { makeShortenWalletAddress } from '@/util/web3';

const props = defineProps({
  address: { type: String, default: '' },
});

const copy = async (link) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(props.address);
  } else {
    unsecuredCopyToClipboard(props.address);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};
</script>

<style lang="scss" scoped>
.address_wrapper {
  position: relative;
  z-index: 500;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 8px;
  gap: 8px;
  cursor: pointer;

  min-width: 117px;
  width: fit-content;
  height: 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 6px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $default;
  }
}
</style>
