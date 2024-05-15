<template>
  <div
    class="main cursor-pointer"
    :class="[{ no: value == 0 }, { active: isActive }, { activeTime: isTimeActive }]"
  >
    <div class="value w-full">
      {{ value == 0 ? 'No' : formatNumber(value) }}
    </div>
    <div class="info">
      <div class="title">{{ title }}</div>
      <Icon class="icon" :size="24" :icon="icon" />
    </div>
  </div>
</template>

<script>
import { getIconByName, formatNumber } from '@/util/helpers';
import Icon from '@/components/Icons/Icon.vue';
export default {
  name: 'StatCardSmall',
  components: { Icon },
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      getIconByName,
      formatNumber,
    };
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 188px;
  height: 120px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  font-family: 'Basis Grotesque Pro';
  &.no {
    &.active {
      .value {
        color: $white;
      }
      .title {
        color: $white;
      }
      .icon {
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
          contrast(102%);
      }
    }
    .value {
      color: $colabs-bg;
    }
    .title {
      color: $colabs-bg;
    }
    .icon {
      filter: invert(73%) sepia(16%) saturate(458%) hue-rotate(205deg) brightness(92%) contrast(50%);
    }
  }

  .value {
    color: $default;
    font-weight: 350;
    font-size: 56px;
    line-height: 56px;
    font-feature-settings: 'zero' on;
    &.overdue {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 144px;
    }
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: $default;
    white-space: nowrap;
  }
  .info {
    font-style: normal;
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 24px;
  }
  &:hover {
    background: $default-border;
  }
}
</style>
