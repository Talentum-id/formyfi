<template>
  <div class="talent" :class="{ square, big }">
    <div
      :style="{ background: `url(${img || defaultBg})` }"
      class="img"
      style="background-repeat: no-repeat; background-size: cover; background-position: center"
    />
    <span>{{ reduceStringLength(text, reduceLength) }}</span>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';
import { reduceStringLength } from '@/util/helpers';
export default {
  name: 'Talent',
  data() {
    return {
      reduceStringLength,
      defaultBg,
    };
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    big: { type: Boolean, default: false },
    img: String,
    square: { type: Boolean, default: false },
    reduceLength: { type: Number, default: 20 },
  },
};
</script>

<style scoped lang="scss">
.talent {
  display: flex;
  align-items: center;
  gap: 12px;
  &.big {
    .img {
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 16px;
    }
  }
  &.square {
    .img {
      border-radius: 6px;
    }
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
  }
  .img {
    width: 24px;
    height: 24px;
    border-radius: 40px;
  }
}
</style>
