<template>
  <div class="input">
    <span v-if="!noArrows" class="arrow arrow-up" @click="incrementValue"
      ><img src="@/assets/images/select.svg" alt="" draggable="false"
    /></span>
    <span v-if="!noArrows" class="arrow arrow-down" @click="decrementValue"
      ><img src="@/assets/images/select.svg" alt="" draggable="false"
    /></span>
    <input
      type="number"
      step="any"
      :class="{ error: !rule, isDisabled }"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :step="step"
      @keydown="handleKeyDown"
    />
  </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    placeholder: {
      type: String,
      default: 'Input text',
    },
    name: {
      type: String,
      default: 'Email',
    },
    modelValue: {
      type: String,
      default: '',
    },
    rule: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    noArrows: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    handleIsOnChainEdit: {
      require: false,
    },
    allowDecimal: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    updateValue(event) {
      if (this.isDisabled) return;

      if (!this.required && !event.target.value) {
        this.$emit('update:modelValue', event.target.value);
      }

      if (this.allowDecimal && event.target.value.includes('.')) {
        const [integerPart, decimalPart] = String(event.target.value).split('.');
        const shortDecimal = decimalPart ? decimalPart.slice(0, 6) : '';
        const newNum = integerPart + (shortDecimal ? '.' + shortDecimal : '');
        event.target.value = newNum;
        this.$emit('update:modelValue', newNum);
        return;
      }

      if (/^0[0-9]+$/.test(event.target.value)) {
        const trimmedValue = String(Number(event.target.value));
        event.target.value = trimmedValue;
        this.$emit('update:modelValue', trimmedValue);
        return;
      }

      if (isNaN(event.target.value) || event.target.value < 0) return;

      if (this.required && event.target.value === '') {
        event.target.value = '0';
        this.$emit('update:modelValue', '0');
      }

      if (/^[\d.]+$/.test(event.target.value)) {
        this.$emit('update:modelValue', event.target.value);
      }
    },
    handleKeyDown(event) {
      const decimalKey = event.key === '.' || event.key === ',' || event.key === 'Decimal';
      if (this.allowDecimal && decimalKey) {
        const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
        event.preventDefault();
        document.execCommand('insertText', false, decimalSeparator);
        return;
      } else if (decimalKey) {
        event.preventDefault();
      }
    },
    toResult(value) {
      const [_, decimals] = String(this.step).split('.');
      if (decimals?.length > 0) {
        return value.toFixed(decimals.length).toString();
      }
      return value.toString();
    },
    incrementValue() {
      if (this.isDisabled) return;
      const currentValue = parseFloat(this.modelValue) || 0;
      this.$emit('update:modelValue', this.toResult(currentValue + this.step));
      if (this.handleIsOnChainEdit) {
        this.handleIsOnChainEdit();
      }
    },
    decrementValue() {
      if (this.isDisabled) return;
      const currentValue = parseFloat(this.modelValue) || 0;
      const isNegative = currentValue <= 0;
      if (isNegative) return;
      this.$emit('update:modelValue', this.toResult(currentValue - this.step));
      if (this.handleIsOnChainEdit) {
        this.handleIsOnChainEdit();
      }
    },
  },
};
</script>

<style scoped lang="scss">
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 120px;

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }

  .arrow-up {
    transform: rotate(180deg);
    top: calc(50% - 15px);
    left: calc(100% - 32px);
  }

  .arrow-down {
    left: calc(100% - 30px);
    top: calc(50% + 10px);
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
    height: 40px;
    width: 100%;
    outline: none;
    background: $white;
    border: 1px solid $colabs-bg;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
    padding-right: 34px;

    &.isDisabled {
      background: transparent;
      color: $secondary;
    }

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
      box-shadow: 0 0 0 3px $default-border;
    }
  }
}
</style>
