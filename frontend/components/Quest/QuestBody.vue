<template>
  <div class="body-container">
    <div class="section">
      <div class="title">Description</div>
      <div class="description" v-html="data.description"></div>
    </div>
    <div class="section">
      <div class="title">Question List</div>
      <div class="quest-list">
        <QuestItem
          v-for="(item, idx) in data.questions"
          :key="item.id"
          :data="item"
          :is-active="step === idx"
          :is-completed="step > idx"
          @view="openQuestion($event)"
        ></QuestItem>
      </div>
      <template v-if="currentItem">
        <VerticalCarousel
          :visible="showQuestion"
          @close="showQuestion = false"
          :current-item="currentItem"
          :items="data.questions"
          :share-link="data.shareLink"
          :answers="answers"
          :branches="branches"
          :thank-you-message="data.thxMessage"
          :ref-code-points="data.refCodePoints"
        />
      </template>
    </div>
  </div>
</template>
<script setup>
import QuestItem from '@/components/Quest/QuestItem.vue';
import VerticalCarousel from '@/components/Details/Carousel/VerticalCarousel.vue';
import { computed, onMounted, ref } from 'vue';
import { useCounterStore } from '@/store';
import { useResponseStore } from '@/store/response';

const counterStore = useCounterStore();

const step = computed(() => counterStore.getStep);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const showQuestion = ref(false);
const currentItem = ref(null);
const answers = computed(() => useResponseStore().getResponse);
const isAvailable = computed(() => Date.now() > Number(props.data.start) * 1000);
const branches = computed(() => {
  if (props.data.branches?.length > 0) {
    return JSON.parse(props.data.branches);
  }
});
onMounted(() => {
  props.data.questions.forEach((item) => {
    if (item.verificationAmount === undefined) {
      item.verificationAmount = 0;
    }
  });
});

const openQuestion = (item) => {
  if (!isAvailable.value) return;

  document.body.style.overflow = 'hidden';

  showQuestion.value = true;
  currentItem.value = item;
};
</script>
<style scoped lang="scss">
.body-container {
  display: flex;
  width: 760px;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 16px;
  border: 1px solid $default-border;
  background: $white;

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .description {
      color: $primary-text;
      font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
      font-feature-settings:
        'dlig' on,
        'ss04' on;
      font-family: $default_font;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }

    .title {
      color: $primary-text;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 32px;
      font-style: normal;
      font-weight: 500;
      line-height: 40px;
    }

    .quest-list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;
    }
  }
}
</style>
