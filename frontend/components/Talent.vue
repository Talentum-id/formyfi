<template>
  <div class="talent cursor-pointer" :class="{ square, big }">
    <div v-if="status" class="status" :class="status"></div>
    <div
      :style="{ background: `url(${img || defaultBg})` }"
      class="img"
      style="background-repeat: no-repeat; background-size: cover; background-position: center"
    />
    <span v-if="isText">{{ reduceStringLength(text, reduceLength) }}</span>
    <span v-else v-html="text"></span>
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
    img: String,
    square: { type: Boolean, default: false },
    isText: { type: Boolean, default: true },
    big: { type: Boolean, default: false },
    reduceLength: { type: Number, default: 20 },
    status: { type: String, default: '' }
  },
};
</script>

<style scoped lang="scss">
.talent {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  position: relative;
  padding: 8px 12px;

  &.big {
    .img {
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 16px;
      line-height: 24px;
    }
  }
  &.square {
    .img {
      border-radius: 6px;
    }
  }
  .status {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .in_progress {
    background-color: #396ACC;
  }
  .done {
     background-color: #1D8F1D;
  }
  .overdue {
     background-color: #E04F31;
  }
  span {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    margin-right: 4px;
  }
  .img {
    width: 24px;
    height: 24px;
    border-radius: 40px;
  }
}
</style>
