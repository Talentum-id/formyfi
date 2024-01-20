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
        <div class="close" @click="$emit('close')"><Icon name="Cancel" :size="24"></Icon></div>
        <div class="current-item">
          <div class="flex flex-col gap-y-[24px] w-full">
            <div class="counter w-full">
              <div
                class="count"
                v-for="(i, idx) in items.length"
                :key="i"
                :class="{ active: currentIndex >= idx }"
              ></div>
            </div>
            <div class="counter-title">Quiz {{ currentIndex + 1 }}/{{ items.length }}</div>
            <div v-if="newArr[currentIndex].file" class="flex items-center justify-center">
              <img :src="newArr[currentIndex].file" alt="" width="160" height="160" />
            </div>
            <div class="question-title">{{ newArr[currentIndex].question }}</div>
            <div class="question-description" v-if="newArr[currentIndex].description">
              {{ newArr[currentIndex].description }}
            </div>
            <div
              class="answer-textarea"
              v-if="!newArr[currentIndex].answers || !newArr[currentIndex].answers.length"
            >
              <TextArea
                placeholder="Your Answer"
                v-model="newArr[currentIndex].answer"
                class="w-full"
              />
              <CustomUpload
                :imagesFiles="newArr[currentIndex].files"
                @images="newArr[currentIndex].files = $event"
              ></CustomUpload>
            </div>
            <div v-else>
              <el-radio-group
                v-model="newArr[currentIndex].answer"
                class="flex flex-col gap-y-[8px] container-radio"
                :border="false"
              >
                <el-radio-button
                  class="radio"
                  :label="answer.answer"
                  :aria-selected="items[currentIndex].answer === answer.answer"
                  v-for="answer in items[currentIndex].answers"
                />
              </el-radio-group>
            </div>
          </div>
          <div class="controllers">
            <BaseButton
              type="primary"
              @click="prevSlide"
              :class="{ invisible: !items[currentIndex - 1] }"
              >Previous</BaseButton
            >
            <BaseButton
              :text="currentIndex + 1 === items.length && !isPreview ? 'Send' : 'Next'"
              type="normal"
              @click="nextSlide"
              :disabled="!newArr[currentIndex].answer"
            />
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
import { computed, ref } from 'vue';
import TextArea from '@/components/Creating/TextArea.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import { ElRadioGroup, ElRadioButton } from 'element-plus';
import { useRoute } from 'vue-router';
import { useCounterStore } from '@/store';
import { useResponseStore } from '@/store/response';

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
});
const isPreview = computed(() => route.name === 'preview');
const currentIndex = ref(findCurrentItemIndex());
const newArr = ref(
  props.items.map((item) => {
    return {
      ...item,
      files: [],
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
const emit = defineEmits(['close']);
const nextSlide = () => {
  if (newArr.value[currentIndex.value].answer) {
    if (!isPreview.value) {
      console.log(newArr.value[currentIndex.value]);
      if (newArr.value[currentIndex.value].questionType === 'open') {
        responseStore.storeResponse({
          isCorrect: true,
          answer: newArr.value[currentIndex.value].answer,
          shareLink: props.shareLink,
          file: newArr.value[currentIndex.value].files[0],
        });
      } else {
        const isCorrect = newArr.value[currentIndex.value].answers.find(
          (item) => newArr.value[currentIndex.value].answer === item.answer && item.isCorrect,
        );
        responseStore.storeResponse({
          isCorrect: !!isCorrect,
          answer: newArr.value[currentIndex.value].answer,
          shareLink: props.shareLink,
          file: '',
        });
      }
    }

    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
      counterStore.setValue(currentIndex.value);
    } else {
      counterStore.setValue(props.items.length);
      emit('close');
    }
  }
};
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
      display: flex;
      width: 100%;
      padding: 16px 24px;
      align-items: center;
      gap: 24px;
      color: #667085;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      text-overflow: ellipsis;
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
      height: 100%;
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
    border: none;
    * {
      box-shadow: none !important;
      color: $section-title !important;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
  }
  .is-focus {
    border: none;
    outline: none;
  }
  .radio {
    cursor: pointer;
    display: flex;
    padding: 9px 16px 11px 16px;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #dad9f7;
    background: $default-bg;
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
    }
  }
}
</style>
