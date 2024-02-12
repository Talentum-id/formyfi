<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <div class="counter-title">Quiz {{ currentStep }}/{{ size }}</div>
</template>

<style scoped lang="scss">
.counter-title {
  color: #a5acbb;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
}
</style>
