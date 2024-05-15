<template>
  <input
    ref="inputElement"
    type="text"
    :placeholder="placeholder"
    @input="updateValue"
    :value="modelValue"
  />
</template>

<script>
export default {
  name: 'InputName',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Shen Yufei',
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  methods: {
    resizeInput() {
      const input = this.$refs.inputElement;
      input.style.width = 'auto';
      input.style.width = input.scrollWidth + 'px';
    },
    updateValue(event) {
      const newValue = event.target.value;
      this.resizeInput();
      this.$emit('update:modelValue', newValue);
    },
  },
  mounted() {
    this.resizeInput();
  },
};
</script>

<style scoped lang="scss">
input {
  background: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  outline: none;
  color: $default;
  width: fit-content;
  max-width: 760px;
  min-width: 400px;
  font-feature-settings: 'zero' on;
  &::placeholder {
    padding: 5px;
    color: $default;
  }
  &:focus {
    background: $default-badge-border;
  }
}
</style>
