<template>
  <div class="head-container">
    <div class="banner" :style="`background:url(${data.image || defaultBg})`"></div>
    <div class="info w-full">
      <Talent text="Portal" class="ml-[-16px]" :img="data.image || defaultBg" square />
      <div class="flex items-center gap-x-[8px]">
        <Badge :text="formatDate(Number(data.start) * 1000)" transparent></Badge> -
        <Badge :text="formatDate(Number(data.end) * 1000)" transparent></Badge>
      </div>
      <div class="title">{{ data.title }}</div>
      <div class="counter w-full">
        <div>{{ data.questions.length }} steps</div>
        <div class="items">
          <div
            class="item"
            v-for="(i, idx) in data.questions"
            :key="i"
            :class="{ active: idx <= step }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import Talent from '@/components/Talent.vue';
import Badge from '@/components/Badge.vue';
import { formatDate } from '@/util/helpers';
import { useCounterStore } from '@/store';
import { computed } from 'vue';
import { useResponseStore } from '@/store/response';
const counterStore = useCounterStore();

const step = computed(() => counterStore.getStep);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const answers = computed(() => useResponseStore().getResponse);
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
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    max-width: 848px;
    align-self: stretch;
    .title {
      color: $primary-text;
      font-family: $default_font;
      font-size: 48px;
      font-style: normal;
      font-weight: 500;
      line-height: 64px;
      max-width: 800px;
    }
    .counter {
      display: flex;
      gap: 16px;
      align-items: center;
      .items {
        display: flex;
        padding-top: 4px;
        align-items: flex-start;
        gap: 2px;
        flex: 1 0 0;
        .item {
          height: 4px;
          width: 100%;
          border-radius: 4px;
          background: $default-border;
        }
        .active {
          background: #344054;
        }
      }
    }
  }
}
</style>
