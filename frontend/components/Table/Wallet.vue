<template>
  <div v-if="text" class="badge_wrapper" :class="[type]">
    <span class="text">{{ text }}</span>
    <Icon name="Copy" class="icon" :size="16" />
  </div>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'Wallet',
  components: { Icon },
  props: {
    text: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: '',
    },

    icon: String,
  },
};
</script>

<style scoped lang="scss">
.status-icon {
  width: 8px;
  height: 8px;
}
div {
  background: $default-bg;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
  display: flex;
  align-items: center;
  border: 1px solid $default-badge-border;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;

  .text {
    font-family: $default_font;
    font-style: normal;
    color: $default;

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
</style>
