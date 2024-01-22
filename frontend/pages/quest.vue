<script setup>
import { computed, onMounted } from 'vue';
import Quest from '@/components/Quest/Quest.vue';
import Default from '@/layouts/default.vue';
import { useQAStore } from '@/store/qa';
import { useRoute } from 'vue-router';
import Icon from '@/components/Icons/Icon.vue';
import { useResponseStore } from '@/store/response';

onMounted(() => {
  useQAStore().fetchQA(useRoute().params.id);
});
onMounted(() => {});
const data = computed(() => useQAStore().getQA);
const loaded = computed(() => useQAStore().getLoadingStatus);
</script>

<template>
  <Default>
    <div class="header">
      <div class="back" @click="$router.push('/')">
        <div class="btn"><Icon name="Left-Arrow" :size="24"></Icon></div>
        Back to Q&A List
      </div>
      <div class="btn"><Icon name="Delete-def" :size="24"></Icon></div>
    </div>
    <quest :data="data" v-if="loaded && data"></quest
  ></Default>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1160px;
  margin: 0 auto 48px;
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
}
</style>
