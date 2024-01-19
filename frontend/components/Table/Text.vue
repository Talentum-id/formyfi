<template>
  <span>{{ text }}</span>
</template>
<script>
export default {
  name: 'Text',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped lang="scss">
span {
  color: #344054;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
}
</style>
