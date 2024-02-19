<template>
  <div class="head-container">
    <CustomImage :image="image || defaultBg" width="240" heigth="240"></CustomImage>
    <div class="info w-full">
      <Talent text="Portal" class="ml-[-16px]" :img="image || defaultBg" square />
      <div class="flex items-center gap-x-[8px]">
        <Badge :text="formatDate(Number(data.start) * 1000)" transparent></Badge>
        -
        <Badge :text="formatDate(Number(data.end) * 1000)" transparent></Badge>
      </div>
      <div class="title">{{ data.title }}</div>
      <div class="counter-info w-full">
        <div>{{ data.questions.length }} steps</div>
        <QuizProgress :length="data.questions.length" :current-index="step"></QuizProgress>
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
import { computed, onMounted, ref } from 'vue';
import { useResponseStore } from '@/store/response';
import { useAssetsStore } from '@/store/assets';
import QuizProgress from '@/components/Details/QuizProgress.vue';
import { ElImage } from 'element-plus';
import CustomImage from '@/components/CustomImage.vue';

const assetsStore = useAssetsStore();
const counterStore = useCounterStore();

const step = computed(() => counterStore.getStep);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const image = ref(null);
const answers = computed(() => useResponseStore().getResponse);

onMounted(async () => {
  await assetsStore
    .getFile(props.data.image)
    .then((res) => (image.value = res))
    .catch(() => (image.value = props.data.image));
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

    .counter-info {
      display: flex;
      gap: 16px;
      align-items: center;
    }
  }
}
</style>
