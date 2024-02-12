<script setup>
defineProps({
  correctAnswer: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <span class="is-incorrect"
    >Oops 🙄 incorrect answer! <br />
    The correct answer is: {{ correctAnswer }}
  </span>
</template>

<style scoped lang="scss">
.is-incorrect {
  color: $error-border;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
  letter-spacing: 0.168px;
}
</style>
