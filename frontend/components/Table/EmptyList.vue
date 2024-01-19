<template>
  <div class="icon">
    <Icon :size="48" :icon="icon" />
    <div>{{ title }}</div>
  </div>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'EmptyList',
  components: { Icon },
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  margin: 0 auto;
  width: 100%;
  height: 352px;
  background: #e9ecf2;
  grid-column: 1 / -1;
  div {
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    margin-top: 10px;
    color: #0f1014;
  }
}
</style>
