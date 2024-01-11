<template>
  <div class="head-container">
    <div class="banner" :style="`background:url(${data.image || defaultBg})`"></div>
    <div class="info">
      <Talent text="Portal" :img="data.image || defaultBg" square />
      <div class="flex items-center gap-x-[8px]">
        <Badge :text="formatDate(Number(data.start) * 1000)" type="claim"></Badge> -
        <Badge :text="formatDate(Number(data.end) * 1000)" type="claim"></Badge>
      </div>
      <div class="title">{{ data.title }}</div>
      <div></div>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import Talent from '@/components/Talent.vue';
import Badge from '@/components/Badge.vue';
import { formatDate } from '@/util/helpers';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>
<style scoped lang="scss">
.head-container {
  display: flex;
  width: 1160px;
  height: fit-content;
  padding: 24px;
  align-items: flex-start;
  gap: 24px;
  border-radius: 16px;
  border: 1px solid $default-border;
  background: $white;
  .banner {
    width: 240px;
    height: 240px;
    border-radius: 8px;
    overflow: hidden;
    background: none;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    .title {
      color: $primary-text;
      font-family: $default_font;
      font-size: 48px;
      font-style: normal;
      font-weight: 500;
      line-height: 64px;
    }
  }
}
</style>
