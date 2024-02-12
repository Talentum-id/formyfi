<script setup>
defineProps({
  item: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="item">{{ item }}</div>
</template>

<style scoped lang="scss">
.item {
  width: 100%;
  padding: 16px 24px;
  color: #667085;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  text-overflow: ellipsis;
  display: block;
  overflow: clip;
  white-space: nowrap;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  border-radius: 16px;
  background: $default-border;
}
</style>
