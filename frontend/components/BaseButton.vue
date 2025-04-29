<template>
  <div :class="[type, { disabled }]" @click="$emit('clickFromComponent', id)">
    <img v-if="type === 'return'" src="@/assets/icons/return.svg" alt="" />
    <span v-if="text">{{ text }}</span>
    <img v-if="type === 'base'" src="@/assets/icons/plus.svg" alt="" />
    <Icon v-if="icon" :name="icon" :size="24"></Icon>
    <slot></slot>
  </div>
</template>

<script setup>
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'base',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.normal {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  background: $blue;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $white;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
    &:hover {
      background-color: $secondary;
    }
  }
}
.base {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: fit-content;
  background: $blue;
  display: flex;
  cursor: pointer;
  align-items: center;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  span {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: $white;
  }
  img {
    margin-left: 8px;
  }
}
.return {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: fit-content;
  background: $blue;
  display: flex;
  cursor: pointer;
  align-items: center;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  span {
    margin-left: 8px;
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: $white;
  }
}
.danger {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: fit-content;
  background: $danger-bg;
  display: flex;
  cursor: pointer;
  align-items: center;
  color: $danger-text;

  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  span {
    margin-left: 8px;
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: $danger-text;
  }
}
.primary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-family: $default_font, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: #344054;
  background: $default-border;

  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  span {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: #344054;
  }
  img {
    margin-left: 8px;
  }
}
</style>
