<script setup>
import BaseModal from '@/components/BaseModal.vue';
import Icon from '@/components/Icons/Icon.vue';
import Badge from '@/components/Badge.vue';
import Variant from '@/components/Result/Variant.vue';
import Link from '@/components/Table/Link.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useQAStore } from '@/store/qa';
import { useResponseStore } from '@/store/response';
import { formatDate } from '@/util/helpers';
import { useAssetsStore } from '@/store/assets';
import ResultCard from '@/components/Result/ResultCard.vue';

const assetsStore = useAssetsStore();
const responseStore = useResponseStore();

const questionFiles = ref([]);
const answerFiles = ref([]);

const props = defineProps({
  userInfo: {
    type: Object,
    default: null,
  },
});

const data = computed(() => useQAStore().getQA);
const answers = computed(() => responseStore.getResponse);

watch(
  () => props.userInfo.identity,
  async (value) => {
    await responseStore.fetchResponse(data.value.shareLink, value);

    for (const answer of answers.value) {
      const index = answers.value.indexOf(answer);

      if (answer.file) {
        await assetsStore.getFile(answer.file).then((res) => (answerFiles.value[index] = res));
      } else {
        answerFiles.value[index] = null;
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(async () => {
  await responseStore.fetchResponse(data.value.shareLink, props.userInfo.identity);
  for (const question of data.value.questions) {
    const index = data.value.questions.indexOf(question);

    if (question.file) {
      await assetsStore.getFile(question.file).then((res) => (questionFiles.value[index] = res));
    } else {
      questionFiles.value[index] = null;
    }
  }
});
</script>

<template>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    class="modal"
    visible
    btnLeft
    @close="$emit('close')"
  >
    <div class="result-wrapper">
      <div class="header">
        <div class="head-title">
          <span>{{ data.title }}</span>

          <div class="controller">
            <div class="switch">
              <Icon name="Left" :size="24" @click="$emit('prev')"></Icon>
            </div>
            <div class="switch">
              <Icon name="Right" :size="24" @click="$emit('next')"></Icon>
            </div>
          </div>
        </div>
        <div class="title">{{ data.description.replace(/<[^>]*>/g, '') }}</div>
        <div class="data">
          <div>
            From
            <Link :text="userInfo.username" :size="0"></Link>
          </div>
          <div>
            Filled
            <Badge :text="formatDate(userInfo.filled * 1000)" type="claim"></Badge>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full gap-[16px] mt-[32px]">
        <ResultCard v-for="(question, idx) in data.questions" :key="idx">
          <div class="head">
            <div class="step">{{ idx + 1 }}/{{ data.questions.length }}</div>
            <div class="required" v-if="question.required">Required</div>
          </div>
          <div v-if="questionFiles[idx]" class="w-full flex justify-center">
            <div class="banner" :style="`background:url(${questionFiles[idx]})`"></div>
          </div>
          <span class="title">{{ question.question }}</span>
          <div class="flex flex-col gap-[16px] w-full" v-if="question.answers.length">
            <Variant
              v-for="i in question.answers"
              :key="i"
              :text="i.answer"
              :is-correct="answers[idx].answer === i.answer && answers[idx].isCorrect"
              :is-incorrect="answers[idx].answer === i.answer && !answers[idx].isCorrect"
            ></Variant>
            <Variant
              v-if="question.openAnswerAllowed"
              :text="answers[idx].answer"
              is-correct
            ></Variant>
          </div>
          <div class="w-full" v-else>
            <Variant
              :text="answers[idx].answer || 'No Answer'"
              :is-correct="!!answers[idx].answer"
            ></Variant>
          </div>
          <div v-if="answerFiles[idx]">
            <div class="banner" :style="`background:url(${answerFiles[idx]})`"></div>
          </div>
        </ResultCard>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.result-wrapper {
  font-family: $default_font;
  padding: 40px;

  .header {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .head-title {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      span {
        color: $default;
        font-variant-numeric: slashed-zero;
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: 40px; /* 125% */
      }

      .controller {
        display: flex;
        gap: 8px;
        align-items: center;

        .switch {
          display: flex;
          width: 32px;
          height: 32px;
          padding: 4px;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          background: $default-badge-border;
          cursor: pointer;
        }
      }
    }

    .title {
      color: $blue;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }

    .data {
      display: flex;
      align-items: center;
      gap: 24px;

      div {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a5acbb;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.168px;
      }
    }
  }
}
.banner {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background: none;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
</style>
