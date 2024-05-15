<template>
  <div class="rank" :class="{ top: isTop }">{{ value }}</div>
</template>
<script setup>
const props = defineProps({
  value: { type: String, default: '1' },
  isTop: { type: Boolean, default: false },
});
</script>

<style scoped lang="scss">
.rank {
  padding: 0 8px;
  border-radius: 24px;
  display: flex;
  min-width: 24px;
  width: fit-content;
  height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 12px;
  font-family: 'Basis Grotesque Pro';
  font-weight: 500;
  line-height: initial;
  background: $default-badge-border;
  font-feature-settings: 'zero' on;

  color: $default;
}
.top {
  color: $orange;
  background: $rounded-bg;
}
</style>
