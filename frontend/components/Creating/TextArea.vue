<template>
  <div class="input">
    <textarea
      type="text"
      :class="{ error: !rule }"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    placeholder: {
      type: String,
      default: 'Input text',
    },
    modelValue: {
      type: String,
      default: '',
    },
    rule: {
      type: Boolean,
      default: true,
    },
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
  .error {
    border-color: $error-border;
  }
  .name {
    font-family: 'Basis Grotesque Pro';
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
  textarea {
    min-height: 120px;
    outline: none;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
    &::placeholder {
      font-family: 'Basis Grotesque Pro';
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
