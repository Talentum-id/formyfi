<template>
  <div class="layout">
    <div class="slider">
      <FirstEmptyItem v-if="items[currentIndex - 2]"></FirstEmptyItem>
      <Item v-if="items[currentIndex - 1]" :item="items[currentIndex - 1].question"></Item>
      <CurrentItem
        :class="{
          marginTop: !items[currentIndex - 1],
          marginBottom: !items[currentIndex + 1],
        }"
        @close="$emit('close')"
      >
        <div class="flex flex-col gap-y-[24px] w-full content">
          <QuizProgress :length="items.length" :current-index="currentIndex"></QuizProgress>
          <QuizProgressTitle
            :size="items.length"
            :current-step="currentIndex + 1"
          ></QuizProgressTitle>
          <div v-if="questionFiles[currentIndex]" class="flex items-center justify-center">
            <div class="banner" :style="`background:url(${questionFiles[currentIndex]})`"></div>
          </div>
          <div class="question-title">{{ newArr[currentIndex].question }}</div>
          <div class="question-description" v-if="newArr[currentIndex].description">
            {{ newArr[currentIndex].description }}
          </div>
          <div class="answer-textarea" v-if="isOpenQuestion">
            <TextArea
              placeholder="Your Answer"
              v-model="newArr[currentIndex].answer"
              class="w-full"
              :disabled="cacheAnswer"
            />

            <div
              v-if="answerFiles[currentIndex] || (newArr[currentIndex].uploadedFile && cacheAnswer)"
              class="banner"
              :style="`background:url(${
                answerFiles[currentIndex] || newArr[currentIndex].uploadedFile
              })`"
            ></div>
            <CustomUpload
              v-else-if="disableUploader"
              :imagesFiles="newArr[currentIndex].answerFile"
              @images="newArr[currentIndex].answerFile = $event"
            ></CustomUpload>
            <div
              class="w-full text-center mt-[20px]"
              v-if="newArr[currentIndex].answer || newArr[currentIndex].files.length"
            >
              <IsCorrectMessage></IsCorrectMessage>
            </div>
          </div>
          <div v-else>
            <el-radio-group
              v-model="newArr[currentIndex].answer"
              class="flex flex-col gap-y-[8px] items-center content-center container-radio"
              :border="false"
            >
              <el-radio-button
                class="radio"
                :label="answer.answer"
                :aria-selected="items[currentIndex].answer === answer.answer"
                v-for="answer in items[currentIndex].answers"
                :disabled="cacheAnswer"
              /><input
                class="allowed-input"
                type="text"
                v-model="newArr[currentIndex].myAnswer"
                v-if="newArr[currentIndex].openAnswerAllowed && isAdditionalAnswer"
                @focus="newArr[currentIndex].answer = ''"
                :placeholder="cacheAnswer || 'Your answer...'"
                :disabled="cacheAnswer"
                :class="{
                  selected:
                    cacheAnswer || (!newArr[currentIndex].answer && newArr[currentIndex].myAnswer),
                }"
              />
            </el-radio-group>
            <div
              class="w-full text-center mt-[20px]"
              v-if="newArr[currentIndex].myAnswer || newArr[currentIndex].answer"
            >
              <IsCorrectMessage
                v-if="isCorrect || newArr[currentIndex].openAnswerAllowed"
              ></IsCorrectMessage>
              <IsIncorrectMessage
                :correct-answer="correctItem.answer"
                v-if="!newArr[currentIndex].openAnswerAllowed && !isCorrect"
              ></IsIncorrectMessage>
            </div>
          </div>
        </div>
        <div class="controllers">
          <BaseButton
            type="primary"
            @click="prevSlide"
            :class="{ invisible: !items[currentIndex - 1] }"
          >
            Previous
          </BaseButton>
          <BaseButton :text="btnStatus" type="normal" @click="nextSlide" :disabled="disableBtn" />
        </div>
      </CurrentItem>
      <Item v-if="items[currentIndex + 1]" :item="items[currentIndex + 1].question"></Item>
      <LastEmptyItem v-if="items[currentIndex + 2]"></LastEmptyItem>
    </div>
  </div>
</template>
<script setup>
import BaseButton from '@/components/BaseButton.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import TextArea from '@/components/Creating/TextArea.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import { ElRadioGroup, ElRadioButton } from 'element-plus';
import { useRoute } from 'vue-router';
import { useCounterStore } from '@/store';
import { useResponseStore } from '@/store/response';
import { useAssetsStore } from '@/store/assets';
import { modal } from '@/mixins/modal';
import Item from '@/components/Details/Carousel/Item.vue';
import LastEmptyItem from '@/components/Details/Carousel/LastEmptyItem.vue';
import FirstEmptyItem from '@/components/Details/Carousel/FirstEmptyItem.vue';
import CurrentItem from '@/components/Details/Carousel/CurrentItem.vue';
import QuizProgress from '@/components/Details/QuizProgress.vue';
import IsCorrectMessage from '@/components/Details/IsCorrectMessage.vue';
import IsIncorrectMessage from '@/components/Details/IsIncorrectMessage.vue';
import QuizProgressTitle from '@/components/Details/QuizProgressTitle.vue';

const assetsStore = useAssetsStore();
const route = useRoute();
const counterStore = useCounterStore();
const responseStore = useResponseStore();
const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
  shareLink: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  answers: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['close', 'success']);

const currentIndex = ref(findCurrentItemIndex());
const loading = ref(false);
const newArr = ref(
  props.items.map((item) => {
    return {
      ...item,
      files: [],
      answer: '',
      uploadedFile: '',
      answerFile: [],
    };
  }),
);
const questionFiles = ref([]);
const answerFiles = ref([]);
const rerenderImages = ref(false);
const result = ref([]);
const realTime = computed(() => Math.floor(Date.now() / 1000));
const cacheAnswer = computed(() => {
  if (props.answers.length && props.answers[currentIndex.value]) {
    return props.answers[currentIndex.value].answer;
  } else {
    return null;
  }
});
const step = computed(() => counterStore.getStep);
const isAdditionalAnswer = computed(() => {
  return !props.items[currentIndex.value].answers.find((item) => {
    return item.answer === cacheAnswer.value;
  });
});
const btnStatus = computed(() => {
  if (currentIndex.value + 1 === props.items.length && !isPreview.value && !loading.value) {
    return 'Send';
  } else if (loading.value) {
    return 'Loading...';
  } else {
    return 'Next';
  }
});
const disableBtn = computed(() => {
  if (
    !newArr.value[currentIndex.value].required &&
    !newArr.value[currentIndex.value].answers.length
  ) {
    return false;
  } else
    return !newArr.value[currentIndex.value].answer && !newArr.value[currentIndex.value].myAnswer;
});
const isPreview = computed(() => route.name === 'preview');
const noCorrectAnswers = computed(() => {
  return newArr.value[currentIndex.value].answers.every((el) => !el.isCorrect);
});
const isCorrect = computed(() => {
  return newArr.value[currentIndex.value].answers.find(
    (item) => newArr.value[currentIndex.value].answer === item.answer && item.isCorrect,
  );
});
const correctItem = computed(() => {
  return newArr.value[currentIndex.value].answers.find((item) => item.isCorrect);
});
const disableUploader = computed(() => {
  return (
    newArr.value[currentIndex.value].fileAllowed &&
    !newArr.value[currentIndex.value].uploadedFile &&
    !answerFiles.value[currentIndex.value] &&
    !rerenderImages.value &&
    !cacheAnswer.value
  );
});
const isOpenQuestion = computed(() => {
  return (
    !newArr.value[currentIndex.value].answers || !newArr.value[currentIndex.value].answers.length
  );
});

onMounted(async () => {
  newArr.value[currentIndex.value].answer = cacheAnswer.value ?? '';
  document.body.style.overflow = 'hidden';

  for (const question of newArr.value) {
    const index = newArr.value.indexOf(question);

    if (question.file) {
      await assetsStore
        .getFile(question.file)
        .then((res) => (questionFiles.value[index] = res))
        .catch(() => (questionFiles.value[index] = question.file));
    } else {
      questionFiles.value[index] = null;
    }
  }

  for (const answer of props.answers) {
    const index = props.answers.indexOf(answer);

    if (answer.file) {
      await assetsStore
        .getFile(answer.file)
        .then((res) => (answerFiles.value[index] = res))
        .catch(() => (answerFiles.value[index] = answer.file));
    } else {
      answerFiles.value[index] = null;
    }
  }
});
onUnmounted(() => {
  document.body.style.overflow = '';
});

function findCurrentItemIndex() {
  return props.items.findIndex((item) => item.question === props.currentItem.question);
}
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const loadImages = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let index = currentIndex.value;
      result.value.map(async (item) => {
        if (item.file) {
          item.file = await assetsStore.assetManager.store(item.file?.[0].raw, {
            path: `/assets/${props.shareLink}/${realTime.value}/${index}`,
          });
          index++;
        }
      });
      resolve();
    } catch (error) {
      handleErrorModal();
      reject(error);
    }
  });
};
const handleSuccessModal = () => {
  modal.emit('openModal', {
    title: 'Q&A Form Submitted',
    message: 'Your request sent successfully',
    type: 'success',
    actionText: 'Great!',
    fn: () => modal.emit('closeModal', {}),
  });
};

const handleErrorModal = () => {
  modal.emit('openModal', {
    title: 'Error Message',
    message: 'Something went wrong!',
    type: 'error',
    actionText: 'Try again',
    fn: nextSlide,
  });
};
const handleLoadingModal = () => {
  modal.emit('openModal', {
    title: 'Uploading answers...',
    message: 'Please wait for a while',
    type: 'loading',
  });
};

const storeResponseAndClose = async () => {
  await handleLoadingModal();
  await responseStore.storeResponse({
    filled: realTime.value,
    shareLink: props.shareLink,
    answers: result.value,
  });
  await counterStore.setValue(props.items.length);
  await emit('close');
  await handleSuccessModal();
};

const nextSlide = async () => {
  if (cacheAnswer.value || isPreview.value) {
    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
    } else {
      emit('close');
    }
    return;
  }

  const currentQuestion = newArr.value[currentIndex.value];

  if (currentQuestion.answer || !currentQuestion.required) {
    await counterStore.setValue(currentIndex.value);
    if (step.value === currentIndex.value) {
      const answerValue = currentQuestion.answer || currentQuestion.myAnswer;
      result.value.push({
        isCorrect: isOpenQuestion.value || noCorrectAnswers.value || !!isCorrect.value,
        answer: answerValue,
        file: currentQuestion.answerFile.length ? currentQuestion.answerFile : '',
        isOpen: isOpenQuestion.value || !!currentQuestion.myAnswer,
      });
    }
    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
    } else {
      try {
        await loadImages();
        await storeResponseAndClose();
      } catch (e) {
        console.error(e);
        loading.value = false;
        handleErrorModal();
      }
    }
  }
};
const rerender = async () => {
  rerenderImages.value = true;
  await nextTick();
  rerenderImages.value = false;
};
watch(currentIndex, (value) => {
  newArr.value[value].answer = cacheAnswer.value ?? '';
  rerender();
});
</script>
<style lang="scss">
.layout {
  background: rgba(26, 29, 41, 0.4);
  backdrop-filter: blur(16px);
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;

  .slider {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 696px;
    position: relative;
    height: 100%;
    padding: 18px 0;

    .question-title {
      color: $primary-text;
      text-align: center;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 32px;
      font-style: normal;
      font-weight: 500;
      line-height: 40px; /* 125% */
    }

    .question-description {
      color: $section-title;
      text-align: center;
      font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
      font-feature-settings:
        'dlig' on,
        'ss04' on;
      font-family: $default_font;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 32px; /* 160% */
    }

    .answer-textarea {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: flex-end;
    }

    .answers {
      min-height: 234px;
      display: flex;
      width: 320px;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .answer {
      }
    }

    .controllers {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;

      div {
        width: 120px;
      }
    }
    .allowed-input {
      display: flex;
      padding: 9px 16px 11px 16px;
      align-items: center;
      gap: 24px;
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid $default-border;
      background: #f5f7fa;
      color: #344054;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      outline: none;
      &::placeholder {
        color: #344054;
        font-variant-numeric: slashed-zero;
        font-family: $default_font;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
      }
      &:focus {
        border-radius: 8px;
        background: #eaeafb;
        border: 1px solid #2637c0;
      }
    }
    .selected {
      background: #eaeafb !important;
      border: 1px solid #2637c0 !important;
    }

    .marginTop {
      margin-top: 64px;
    }

    .marginBottom {
      margin-bottom: 64px;
    }
  }
}

.container-radio {
  .is-active {
    border-radius: 8px;
    background: #eaeafb !important;
    border: 1px solid #2637c0 !important;

    * {
      box-shadow: none !important;
      color: $section-title !important;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      padding: 0 !important;
      white-space: pre-wrap;
      text-align: left;
    }
  }

  .is-focus {
    border: none;
    outline: none;
  }

  .radio {
    width: auto;
    cursor: pointer;
    display: flex;
    padding: 9px 16px 11px 16px;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #dad9f7;
    width: 300px;

    * {
      background: transparent !important;
      color: $default;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
      border: none !important;
      padding: 0 !important;
      white-space: pre-wrap;
      text-align: left;
    }
  }
}

.content {
  max-height: 90%;
  overflow-y: scroll;
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
