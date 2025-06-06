<template>
  <div class="input" :class="{
      small: type === 'small',
      symbol,
      'isError': isError && valueEntered
    }">
    <div v-if="!withoutName" class="name">{{ name }}</div>
    <div v-if="symbol" class="symbol" :class="{ small: type === 'small' }">
      <span>{{ symbol }}</span>
    </div>
    <input
      :type="isNumber ? 'number' : 'text'"
      :min="$attrs.min"
      :max="$attrs.max"
      :class="{ error: !rule && touched }"
      :value="modelValue"
      @blur="touched = true"
      @focus="touched = false"
      @input="updateValue"
      :disabled="disabled"
      :placeholder="placeholder"
    />
    <div v-if="!rule && touched" class="error-message">Please enter your {{ name }}.</div>
    <div v-if="errorText && isError && valueEntered" class="error-message">{{ errorText }}</div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: 'Input text',
    },
    name: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    rule: {
      type: Boolean,
      default: true,
    },
    isError: { type: Boolean, default: false },
    isNumber: { type: Boolean, default: false },
    withoutName: { type: Boolean, default: false },
    errorText: { type: String, default: '' },
    symbol: { type: String, default: '' },
    type: { type: String, default: '' },
  },
  data() {
    return {
      touched: false,
      valueEntered: false,
    };
  },
  methods: {
    updateValue(event) {
      this.valueEntered = true;

      const newValue = event.target.value;
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.error-message {
  color: $error-text;
  font-family: $default_font;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
}

.input {
  display: flex;
  flex-direction: column;
  position: relative;

  &.small {
    input {
      height: 32px;
    }
  }

  &.symbol {
    input {
      padding: 8px 12px 8px 50px;
    }
  }

  &.isError {
    input {
      border: 1px solid $red;
    }
  }

  .symbol {
    position: absolute;
    top: 9px;
    left: 1px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;

    width: 40px;
    background: #eaeafb;
    border-right: 1px solid $default-border;

    &.small {
      height: 30px;
    }

    span {
      font-family: $default_font;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings:
        'tnum' on,
        'lnum' on,
        'zero' on;
      color: #38405b;
    }
  }

  .error {
    border-color: $error-border;
  }

  .name {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
    margin-bottom: 8px;
  }

  input {
    outline: none;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    padding: 7px 12px;
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;

    &::placeholder {
      font-family: $default_font;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings:
        'tnum' on,
        'lnum' on,
        'zero' on;
      color: $colabs-bg;
    }

    &:focus {
      box-shadow: 2px $default-border;
    }
  }
} /* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  display: none;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
