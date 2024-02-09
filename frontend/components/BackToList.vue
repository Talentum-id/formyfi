<script setup>
import Icon from '@/components/Icons/Icon.vue';
</script>

<template>
  <div class="back" @click="$router.push('/')">
    <div class="btn">
      <Icon name="Left-Arrow" :size="24"></Icon>
    </div>
    Back to Q&A List
  </div>
</template>

<style scoped lang="scss">
.back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #667085;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
}

.btn {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 1px solid $default-border;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
}
</style>
