<template>
  <div>{{ text }}.</div>
</template>
<script>
export default {
  name: 'NumberOfEl',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped lang="scss">
div {
  color: #a5acbb;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
}
</style>
