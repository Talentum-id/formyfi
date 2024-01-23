<template>
  <div
    v-if="text || value"
    class="badge_wrapper"
    :class="[type, { big: big, transparent, noBorder }]"
  >
    <img v-if="type === 'image'" :src="img || defaultBg" alt="" />
    <Icon v-if="icon" :name="icon" :size="24" class="mr-2" />
    <span class="text" :class="{ deadline: isDeadline }">{{ text }}</span>
    <span v-if="value" class="value">{{ value }}</span>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';
import { isMoreThan3Days, isLessThan3DaysLeft, isLessThan3HoursLeft } from '@/util/helpers';
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'Badge',
  components: { Icon },
  data() {
    return {
      defaultBg,
      isMoreThan3Days,
      isLessThan3DaysLeft,
      isLessThan3HoursLeft,
    };
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
    img: String,
    icon: String,
    pastDate: { type: String, default: '' },
    futureDate: { type: String, default: '' },
    futureHours: { type: String, default: '' },
    isStatusIcon: { type: Boolean, default: false },
    transparent: {
      type: Boolean,
      default: false,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDeadline() {
      if (this.pastDate) {
        return this.isMoreThan3Days(this.pastDate);
      } else if (this.futureDate) {
        return this.isLessThan3DaysLeft(this.futureDate);
      } else if (this.futureHours) {
        return this.isLessThan3HoursLeft(this.futureHours);
      } else return false;
    },
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

  img {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 4px;
  }

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
  .value {
    margin-left: 6px;
    font-size: 10px;
  }
}

.claim {
  border: 1px solid $default-badge-border;
  background: $transparent-active-bg;
  span {
    color: $default !important;
  }
}
.chip {
  border: 1px solid $default-border;
  background: $default-badge-border;
  span {
    color: $default;
  }
}

.success {
  border: none;
  background: $success-bg;
  span {
    color: $success-text;
  }
}

.all {
  border: none;
  background: $default-bg;
  span {
    color: $default;
  }
}

.warning {
  border: none;
  background: $warning-bg;
  span {
    color: $warning-text;
  }
}

.danger {
  border: none;
  background: $danger-bg;
  span {
    color: $danger-text;
  }
}

.primary {
  border: none;
  background: $primary-bg;
  span {
    color: $primary-text;
  }
}

.info {
  border: none;
  background: $info-bg;
  span {
    color: $info-text;
  }
}

.mint {
  border: none;
  background: $mint-bg;
  span {
    color: $mint-text;
  }
}

.rounded {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  border: none;
  background: $rounded-bg;
  span {
    color: $orange;
  }
}

.transparent {
  border: 1px solid $default-border;
  background: transparent;
  span {
    color: $default;
  }
}

.noBorder {
  border: 0 !important;
}

.task {
  position: relative;
  border: 1px solid $default-border;
  background: transparent;
  &:hover {
    background: $default-bg;
  }
  span {
    color: $default;
  }
}

.disabled {
  border: 1px solid $colabs-bg;
  background: $colabs-bg;
  span {
    color: $white;
  }
}
.image {
  padding-left: 2px;
  border: 1px solid $default-border;
  background: transparent;
  span {
    color: $default;
  }
}

.big {
  height: 32px;
  width: 100%;
  max-width: fit-content;
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
    line-height: 20px;
  }
  .value {
    font-size: 12px;
  }
}
</style>
