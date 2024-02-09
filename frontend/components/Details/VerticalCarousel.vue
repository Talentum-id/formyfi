<template>
  <div class="layout">
    <div class="slider">
      <div class="first-empty" v-if="items[currentIndex - 2]"></div>
      <div class="item" v-if="items[currentIndex - 1]">{{ items[currentIndex - 1].question }}</div>
      <div
        class="main"
        :class="{
          marginTop: !items[currentIndex - 1],
          marginBottom: !items[currentIndex + 1],
        }"
      >
        <div class="close" @click="$emit('close')">
          <Icon name="Cancel" :size="24"></Icon>
        </div>
        <div class="current-item">
          <div class="flex flex-col gap-y-[24px] w-full content">
            <div class="counter w-full">
              <div
                class="count"
                v-for="(i, idx) in items.length"
                :key="i"
                :class="{ active: currentIndex >= idx }"
              ></div>
            </div>
            <div class="counter-title">Quiz {{ currentIndex + 1 }}/{{ items.length }}</div>
            <div v-if="questionFiles[currentIndex]" class="flex items-center justify-center">
              <div class="banner" :style="`background:url(${questionFiles[currentIndex]})`"></div>
            </div>
            <div class="question-title">{{ newArr[currentIndex].question }}</div>
            <div class="question-description" v-if="newArr[currentIndex].description">
              {{ newArr[currentIndex].description }}
            </div>
            <div
              class="answer-textarea"
              v-if="!newArr[currentIndex].answers || !newArr[currentIndex].answers.length"
            >
              {{}}
              <TextArea
                placeholder="Your Answer"
                v-model="newArr[currentIndex].answer"
                class="w-full"
                :disabled="cacheAnswer"
              />

              <div
                v-if="
                  answerFiles[currentIndex] || (newArr[currentIndex].uploadedFile && cacheAnswer)
                "
                class="banner"
                :style="`background:url(${
                  answerFiles[currentIndex] || newArr[currentIndex].uploadedFile
                })`"
              ></div>
              <CustomUpload
                v-else-if="
                  newArr[currentIndex].openAnswerAllowed &&
                  !newArr[currentIndex].uploadedFile &&
                  !answerFiles[currentIndex] &&
                  !rerenderImages
                "
                :imagesFiles="newArr[currentIndex].files"
                @images="newArr[currentIndex].files = $event"
              ></CustomUpload>
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
                />
              </el-radio-group>

              {{ newArr[currentIndex].openAnswerAllowed }}
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
        </div>
      </div>
      <div class="item" v-if="items[currentIndex + 1]">{{ items[currentIndex + 1].question }}</div>
      <div class="last-empty" v-if="items[currentIndex + 2]"></div>
    </div>
  </div>
</template>
<script setup>
import Icon from '@/components/Icons/Icon.vue';
import BaseButton from '@/components/BaseButton.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import TextArea from '@/components/Creating/TextArea.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import { ElRadioGroup, ElRadioButton } from 'element-plus';
import { useRoute } from 'vue-router';
import { useCounterStore } from '@/store';
import { useResponseStore } from '@/store/response';
import { useAssetsStore } from '@/store/assets';
import defaultBg from '@/assets/images/default-avatar.png';

const assetsStore = useAssetsStore();

const route = useRoute();
const counterStore = useCounterStore();
const responseStore = useResponseStore();
const questionFiles = ref([]);
const answerFiles = ref([]);

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
const step = computed(() => counterStore.getStep);
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
  } else return !newArr.value[currentIndex.value].answer;
});
const isPreview = computed(() => route.name === 'preview');
const currentIndex = ref(findCurrentItemIndex());
const loading = ref(false);
const cacheAnswer = computed(() => {
  if (props.answers.length && props.answers[currentIndex.value]) {
    return props.answers[currentIndex.value].answer;
  } else {
    return null;
  }
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
const newArr = ref(
  props.items.map((item) => {
    return {
      ...item,
      files: [],
      answer: '',
      uploadedFile: '',
      answerFile: '',
    };
  }),
);

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
      let index = 0;
      const realTime = Math.floor(new Date().getTime() / 1000);
      if (typeof newArr.value[currentIndex.value].files[0] !== 'string') {
        newArr.value[currentIndex.value].answerFile = await assetsStore.assetManager.store(
          newArr.value[currentIndex.value].files[0].raw,
          {
            path: `/assets/${props.shareLink}/${realTime}/${index}`,
          },
        );

        await assetsStore
          .getFile(newArr.value[currentIndex.value].answerFile)
          .then((res) => (newArr.value[currentIndex.value].uploadedFile = res));

        index++;
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
const emit = defineEmits(['close', 'success']);
const nextSlide = async () => {
  if (newArr.value[currentIndex.value].answer || !newArr.value[currentIndex.value].required) {
    if (!isPreview.value && step.value === currentIndex.value) {
      loading.value = true;
      if (newArr.value[currentIndex.value].questionType === 'open') {
        if (newArr.value[currentIndex.value].files[0]) {
          await loadImages();
        }
        await responseStore
          .storeResponse({
            answer: {
              isCorrect: true,
              answer: newArr.value[currentIndex.value].answer || '',
              file: newArr.value[currentIndex.value].answerFile || '',
            },
            filled: Math.floor(Date.now() / 1000),
            shareLink: props.shareLink,
          })
          .then(() => {
            loading.value = false;
          });
      } else {
        const noCorrectAnswers = newArr.value[currentIndex.value].answers.every(
          (el) => !el.isCorrect,
        );
        const isCorrect = newArr.value[currentIndex.value].answers.find(
          (item) => newArr.value[currentIndex.value].answer === item.answer && item.isCorrect,
        );

        await responseStore
          .storeResponse({
            answer: {
              isCorrect: noCorrectAnswers ? true : !!isCorrect,
              answer: newArr.value[currentIndex.value].answer || '',
              file: '',
            },
            shareLink: props.shareLink,
            filled: Math.floor(Date.now() / 1000),
          })
          .then(() => {
            loading.value = false;
          });
      }
      if (currentIndex.value === props.items.length - 1) {
        emit('success');
      }
    }

    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
    } else {
      counterStore.setValue(props.items.length);
      emit('close');
    }
  }
};
const rerenderImages = ref(false);
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

    .first-empty {
      width: 696px;
      position: absolute;
      height: 12px;
      top: 0;
      border-radius: 0 0 16px 16px;
      background: $default-border;
    }

    .last-empty {
      width: 696px;
      position: absolute;
      height: 12px;
      bottom: 0;
      border-radius: 16px 16px 0 0;
      background: $default-border;
    }

    .item {
      width: 100%;
      padding: 16px 24px;
      color: #667085;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      text-overflow: ellipsis;
      display: block;
      overflow: clip;
      white-space: nowrap;
      font-family: $default_font;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      border-radius: 16px;
      background: $default-border;
    }

    .main {
      height: calc(100% - 128px);
      position: relative;

      .close {
        display: flex;
        padding: 8px;
        align-items: flex-start;
        gap: 10px;
        position: absolute;
        right: -40px;
        top: -40px;
        border-radius: 24px;
        background: #f5f7fa;
        height: 40px;
        width: 40px;
        cursor: pointer;
      }

      .current-item {
        display: flex;
        width: 720px;
        height: 100%;
        padding: 40px;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        border-radius: 16px;
        background: #f5f7fa;

        .counter {
          display: flex;
          padding-top: 4px;
          align-items: flex-start;
          gap: 2px;
          height: fit-content;

          .count {
            height: 4px;
            width: 100%;
            border-radius: 4px;
            background: $default-border;
          }

          .active {
            background: #344054;
          }
        }

        .counter-title {
          color: #a5acbb;
          text-align: center;
          font-variant-numeric: lining-nums tabular-nums slashed-zero;
          font-family: $default_font;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px; /* 150% */
        }

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
      }
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
    background: $default-bg;
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
