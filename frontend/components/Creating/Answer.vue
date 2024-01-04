<template>
  <div class="input">
    <input type="text" :value="modelValue" @input="updateValue" placeholder="Answer Option" />
  </div>
</template>

<script>
export default {
  name: 'Answer',
  props: {
    modelValue: {
      type: String,
      default: '',
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
