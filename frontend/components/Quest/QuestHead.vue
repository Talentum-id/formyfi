<template>
  <div class="head-container">
    <CustomImage :image="banner || defaultBg" width="712" heigth="240" />
    <div class="info w-full">
      <Talent
        v-if="qaAuthor !== null"
        :text="qaAuthor.username"
        class="ml-[-16px]"
        :img="banner || defaultBg"
        square
      />
      <div class="flex items-center gap-x-[8px]">
        <Badge :text="formatDate(Number(data.start) * 1000)" transparent />
        -
        <Badge :text="formatDate(Number(data.end) * 1000)" transparent />
      </div>
      <div class="title">{{ data.title }}</div>
      <div class="counter-info w-full">
        <div>{{ data.questions.length }} steps</div>
        <QuizProgress :length="data.questions.length" :current-index="step" />
      </div>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import Talent from '@/components/Talent.vue';
import Badge from '@/components/Badge.vue';
import { formatDate, readFile } from '@/util/helpers';
import { useCounterStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { useResponseStore } from '@/store/response';
import QuizProgress from '@/components/Details/QuizProgress.vue';
import CustomImage from '@/components/CustomImage.vue';
import { useAuthStore } from '@/store/auth';

const userStore = useAuthStore();
const counterStore = useCounterStore();

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const banner = ref(null);
const qaAuthor = ref(null);

const answers = computed(() => useResponseStore().getResponse);
const step = computed(() => counterStore.getStep);

onMounted(async () => {
  await userStore
    .findUser(props.data.owner)
    .then(res => {
      if (res.length) {
        qaAuthor.value = res[0];
      }
    })
    .catch(e => console.error(e));

  banner.value = await readFile(props.data.image);
});
</script>
<style scoped lang="scss">
.head-container {
  display: flex;
  flex-direction: column;
  width: 760px;
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
