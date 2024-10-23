<template>
  <div class="relative">
    <div class="tooltip-checkbox" v-if="show">Link copied to clipboard</div>

    <div v-if="text" class="badge_wrapper" :class="[type]" @click="copyRefLink()">
      <span class="text">{{ size ? shortenAddress(text, size) : text }}</span>
      <Icon name="Link" class="icon" :size="16" />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';
import Alert from '@/components/Alert.vue';
import Tooltip from '@/components/Table/Tooltip.vue';
import TooltipIcon from '@/components/Creating/TooltipIcon.vue';
import { shortenAddress } from '@/util/helpers';

export default {
  name: 'Link',
  components: { TooltipIcon, Tooltip, Alert, Icon },
  props: {
    text: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 6,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    shortenAddress,
    async copyRefLink() {
      if (window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(this.text);
        this.show = true;
        setTimeout(() => (this.show = false), 2000);
      } else {
        this.unsecuredCopyToClipboard(this.text);
      }
    },

    unsecuredCopyToClipboard(link) {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        this.show = true;
        setTimeout(() => (this.show = false), 2000);
      } catch (err) {
        console.error('Unable to copy to clipboard', err);
      }
      document.body.removeChild(textArea);
    },
  },
};
</script>

<style scoped lang="scss">
.status-icon {
  width: 8px;
  height: 8px;
}
.badge_wrapper {
  background: transparent;
  padding: 4px 8px;
  border-radius: 6px;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid $default-badge-border;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;

  .text {
    font-family: $default_font;
    font-style: normal;
    color: $default;
    width: 100%;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    /* identical to box height, or 133% */

    text-align: center;
    letter-spacing: 0.014em;
    &.deadline {
      color: $red;
    }
  }
  .icon {
    margin-left: 8px;
  }
}
.tooltip-checkbox {
  position: absolute;
  // width: 200px;
  min-width: 170px;
  width: fit-content;
  background: $default;
  box-shadow: 0 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  z-index: 9999999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $white;
  text-align: left;
  bottom: 60px;
  left: 50%;
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    z-index: -1;
    top: 18px;
    left: 50%;
  }
}
</style>
