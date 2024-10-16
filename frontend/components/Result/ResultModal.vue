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
import ResultCard from '@/components/Result/ResultCard.vue';
import CustomImage from '@/components/CustomImage.vue';
import { useAuthStore } from '@/store/auth';
import { readFile } from '@/util/helpers';

const responseStore = useResponseStore();

const props = defineProps({
  userInfo: {
    type: Object,
    default: null,
  },
});

const answerFiles = ref([]);
const questionFiles = ref([]);

const user = computed(() => useAuthStore().getUser);
const data = computed(() => useQAStore().getQA);
const answers = computed(() => responseStore.getResponse);

watch(
  () => props.userInfo.identity,
  async (value) => {
    await responseStore.fetchResponse(data.value.shareLink, value);

    for (const answer of answers.value) {
      const index = answers.value.indexOf(answer);

      if (answer.file) {
        answerFiles.value[index] = await readFile(answer.file);
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
      questionFiles.value[index] = await readFile(question.file);
    } else {
      questionFiles.value[index] = null;
    }
  }
});
const isAdditionalAnswer = (answer, variants) => {
  return !variants.find((variant) => variant.answer === answer);
};

const isAdditionalMultipleAnswer = (answer, variants) => {
  const variantAnswers = variants.map(({ answer }) => answer);
  const additionalAnswer = JSON.parse(answer).find((item) => variantAnswers.indexOf(item) === -1);

  if (additionalAnswer !== undefined) {
    return additionalAnswer;
  }

  return null;
};
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
          <span>{{ data?.title }}</span>

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
            <Link :text="userInfo.username || user.username" :size="0"></Link>
          </div>
          <div>
            Filled
            <Badge :text="formatDate(userInfo.filled * 1000)" type="claim"></Badge>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full gap-[16px] mt-[32px]">
        <ResultCard v-for="(question, idx) in data.questions" :key="idx">
          <div class="head flex justify-between w-full">
            <div class="step">{{ idx + 1 }}/{{ data.questions.length }}</div>
            <div class="required" v-if="question.required">Required</div>
          </div>
          <div v-if="question.file" class="w-full flex justify-center">
            <CustomImage :image="questionFiles[idx]" width="160" heigth="160" />
          </div>
          <span class="title">{{ question.question }}</span>
          <div v-if="answers[idx]">
            <div class="flex flex-col gap-[16px] w-full" v-if="question.questionType === 'quiz'">
              <Variant
                v-for="i in question.answers"
                :key="i"
                :text="i.answer"
                :is-correct="answers[idx].answer === i.answer && answers[idx].isCorrect"
                :is-incorrect="answers[idx].answer === i.answer && !answers[idx].isCorrect"
              />
              <Variant
                v-if="
                  question.openAnswerAllowed &&
                  isAdditionalAnswer(answers[idx].answer, question.answers)
                "
                :text="answers[idx].answer"
                is-correct
              />
            </div>
            <div
              class="flex flex-col gap-[16px] w-full"
              v-else-if="question.questionType === 'multiple'"
            >
              <Variant
                v-for="i in question.answers"
                :key="i"
                :text="i.answer"
                :is-correct="
                  answers[idx].answer && JSON.parse(answers[idx].answer).indexOf(i.answer) !== -1
                "
                :is-incorrect="
                  answers[idx].answer && JSON.parse(answers[idx].answer).indexOf(i.answer) === -1
                "
              />
              <Variant
                v-if="
                  question.openAnswerAllowed &&
                  isAdditionalMultipleAnswer(answers[idx].answer, question.answers)
                "
                :text="isAdditionalMultipleAnswer(answers[idx].answer, question.answers)"
                is-correct
              />
            </div>
            <div class="w-full" v-else>
              <Variant
                v-if="question.questionType === 'address'"
                :text="
                  answers[idx].answer
                    ? Object.values(JSON.parse(answers[idx].answer)).join(', ')
                    : 'No Answer'
                "
                :is-correct="!!answers[idx].answer || answers[idx].isCorrect"
              />
              <Variant
                v-else-if="question.questionType === 'date'"
                :text="new Date(answers[idx].answer * 1000).toDateString()"
                :is-correct="!!answers[idx].answer || answers[idx].isCorrect"
              />
              <Variant
                v-else
                :text="answers[idx].answer || 'No Answer'"
                :is-correct="!!answers[idx].answer || answers[idx].isCorrect"
              />
            </div>
          </div>
          <div v-if="answers[idx]?.file">
            <CustomImage :image="answerFiles[idx]" width="160" heigth="160" />
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

  .required {
    color: $red;
    font-size: 0.8em;
  }

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
</style>
