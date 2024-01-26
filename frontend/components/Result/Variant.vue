<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  isIncorrect: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center gap-x-[8px]">
    <img v-if="isCorrect && !isIncorrect" src="@/assets/icons/completed.svg" alt="incorrect" />
    <img v-else src="@/assets/icons/incorrect.svg" alt="incorrect" />
    <div class="item" :class="{ isCorrect, isIncorrect }">{{ text }}</div>
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 100%;
  display: flex;
  padding: 7px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  background: #f5f7fa;
  color: $primary-text;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.isCorrect {
  background: $success-bg;
}
.isIncorrect {
  background: #fae5dc;
}
</style>
