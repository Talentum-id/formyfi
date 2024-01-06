<template>
  <div class="input">
    <input
      type="text"
      :value="modelValue"
      @input="updateValue"
      placeholder="Answer Option"
      :class="{ error: isError }"
    />
    <!--    <div v-if="errorText && isError" class="error-message">{{ errorText }}</div>-->
  </div>
</template>

<script>
import Input from '@/components/Input.vue';

export default {
  name: 'Answer',
  components: { Input },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    isError: { type: Boolean, default: false },
    errorText: { type: String, default: '' },
  },
  methods: {
    updateValue(event) {
      const newValue = event.target.value;
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
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
    &.error {
      border-color: $error-border;
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
</style>
