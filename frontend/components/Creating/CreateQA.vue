<template>
  <base-button text="Create a Q&A" @click="showPreview()"></base-button>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    :visible="show"
    btnLeft
    @close="showPreview"
  >
    <div class="create-task_wrapper">
      <div class="title_wrapper">
        <div class="title">Create Q&A</div>
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Cover Image</div>
        <div class="upload-requirements">
          Recommended size — 480 x 480 px. PNG, JPEG. Maximum 10 MB.
        </div>
        <TaskBannerUploader :isEditingActive="true" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Quest Name</div>
        <Input name="" placeholder="Enter the quest name" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Description</div>
        <div class="section_wrapper-subtitle">These are the instructions to complete the task.</div>
        <Editor />
      </div>
      <div class="section_wrapper last">
        <div class="section_item">
          <div class="section_wrapper-title">Start Date</div>
          <CustomDatePicker
            :defaultDate="transformDate(startDate)"
            :minDate="todayDate"
            :maxDate="transformDate(addDaysToDate(endDate, -1))"
            @selectedDate="setStartDate"
          />
        </div>
        <div class="section_item">
          <div class="section_wrapper-title">End Date</div>
          <CustomDatePicker
            :defaultDate="transformDate(endDate)"
            :minDate="transformDate(startDate)"
            @selectedDate="setEndDate"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="section_wrapper">
        <div class="section_wrapper-title flex">
          Questions
          <TooltipIcon tooltipText="tooltipText" />
        </div>
        <div class="section_wrapper-subtitle">
          Create up to 8 quiz questions. <br />
          Enter a question and up to 5 answer options, mark the correct answer.
        </div>
        <div
          class="section_wrapper rewards-type"
          v-for="(question, index) in countOfQuestions"
          :key="index"
        >
          <div class="section_wrapper-title head-control">
            Questions #{{ question }}
            <div class="controllers">
              <div class="controllers">
                <img
                  src="@/assets/icons/up.svg"
                  @click="shiftQuestionBackward(index)"
                  alt=""
                  :class="{ blur: index === 0 }"
                />
                <img
                  src="@/assets/icons/down.svg"
                  @click="shiftQuestionForward(index)"
                  alt=""
                  :class="{ blur: index === countOfQuestions.length - 1 }"
                />
                <img
                  src="@/assets/icons/delete.svg"
                  @click="deleteQuestion(index)"
                  alt=""
                  :class="{ blur: countOfQuestions.length === 1 }"
                />
              </div>
            </div>
          </div>
          <div class="section_wrapper-subtitle">
            Determine if the talent must meet certain conditions in order to validate the task
          </div>
          <FilterToggle
            :buttons="questsTypeItems"
            :id="idQuestType"
            fixedWidth="100%"
            @select="setIsShowQuestionType($event)"
          />
          <div class="content">
            <div>
              <div class="content-block">
                <CustomUpload
                  @changeError="handleImageError"
                  :imagesFiles="images"
                  @images="images = $event"
                />
                <div class="check-btn_wrapper">
                  <div class="check-btn_title">Required</div>
                  <Switch :checkedProp="true" />
                </div>
              </div>
              <div class="flex flex-col">
                <Input name="" placeholder="Question" />
                <TextArea placeholder="Description (optional)" />
              </div>
              <div v-if="idQuestType === 2">
                <draggable class="answers" :list="answers" @change="log">
                  <div class="answer" v-for="answer in answers">
                    <img src="@/assets/icons/item.svg" alt="" />
                    <Answer />
                    <div
                      class="add-answer"
                      :class="{ hidden: answers.length - 1 !== answer }"
                      @click="addAnswers"
                    >
                      <img src="@/assets/icons/add.svg" alt="" />
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
        <div class="add-talent-btn" @click="addQuestion">
          <span>Add Question</span>
          <img src="@/assets/icons/add.svg" alt="" />
        </div>
        <div class="flex footer">
          <BaseButton text="Preview" type="primary" />
          <BaseButton text="Publish Quest" type="normal" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import TaskBannerUploader from '@/components/Creating/TaskBannerUploader.vue';
import Editor from '@/components/Creating/Editor.vue';
import Answer from '@/components/Creating/Answer.vue';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import Input from '@/components/Input.vue';
import { transformDate, addDaysToDate } from '@/util/helpers';
import FilterToggle from '@/components/Creating/FilterToggle.vue';
import TooltipIcon from '@/components/Creating/TooltipIcon.vue';
import Switch from '@/components/Creating/Switch.vue';
import TextArea from '@/components/Creating/TextArea.vue';
import Icon from '@/components/Icons/Icon.vue';
const show = ref(false);
const drag = ref(false);
const images = ref([]);
const isImagesError = ref(false);
const todayDate = new Date();
const startDate = ref(todayDate);
const twoDaysFromNow = new Date(todayDate);
const oneDayFromNow = new Date(todayDate);
const endDate = ref(twoDaysFromNow);
const idQuestType = ref(0);
const setIsShowQuestionType = (event) => {
  idQuestType.value = event.id;
};
const questsTypeItems = ref([
  {
    title: `Open Question`,
    id: 0,
    name: 'question',
  },
  {
    title: `Quiz Question`,
    id: 1,
    name: 'quiz',
  },
  {
    title: `Multiple Choice`,
    id: 2,
    name: 'multiple',
  },
]);
const countOfQuestions = ref([0]);
const answers = ref([0]);

const handleImageError = (event) => {
  isImagesError.value = event;
};
const addQuestion = () => {
  if (countOfQuestions.value.length < 8) {
    countOfQuestions.value.push(countOfQuestions.value.length);
  }
};
const state = reactive({
  array: [1, 2, 3, 4, 5],
  currentElementIndex: ref(0),
});
const addAnswers = () => {
  answers.value.push(answers.value.length);
};
const showPreview = () => {
  show.value = !show.value;
};

const shiftQuestionForward = (index) => {
  if (index < countOfQuestions.value.length - 1) {
    swapQuestions(index, index + 1);
    state.currentElementIndex = index + 1; // Обновляем текущий индекс
  }
};

const shiftQuestionBackward = (index) => {
  if (index > 0) {
    swapQuestions(index, index - 1);
    state.currentElementIndex = index - 1; // Обновляем текущий индекс
  }
};
const swapQuestions = (index1, index2) => {
  const temp = countOfQuestions.value[index1];
  countOfQuestions.value[index1] = countOfQuestions.value[index2];
  countOfQuestions.value[index2] = temp;
};
const deleteQuestion = (index) => {
  if (countOfQuestions.value.length > 1) {
    countOfQuestions.value.splice(index, 1);
  }
};

const setEndDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  if (isToday) {
    endDate.value = todayDate;
  } else {
    endDate.value = event;
  }
};
const setStartDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  const isTodayDate = eventDate.getDate() === today.getDate();
  if (isTodayDate) {
    startDate.value = todayDate;
  } else {
    startDate.value = event;
  }
};
</script>
<script>
import { defineComponent } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
      dragging: false,
    };
  },
  methods: {
    log(event) {
      console.log(event);
    },
  },
});
</script>
<style scoped lang="scss">
.create-task_wrapper {
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 32px;
}
.upload-requirements {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $default;
}
.title_wrapper {
  display: flex;
  justify-content: space-between;

  .title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}
.section_wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .condition-setting {
    background-color: #eaeafb;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-title {
      color: #6a6d8f;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }

    &-item {
      &-title {
        margin-bottom: 8px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 142.857%;
        color: #1a1d29;
      }

      .blockchain-select {
        position: relative;
        width: 50%;

        &-icon {
          position: absolute;
          height: 100%;
          left: 0;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 20;
          border-right: 1px solid #dad9f7;
          border-radius: 8px 0 0 8px;
          background-color: #dad9f7;
          top: 0;

          & > svg {
            display: inline-block;
          }
        }
      }
    }
  }

  &.last {
    flex-direction: row;
    justify-content: space-between;
  }

  &-title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
  }

  &-subtitle {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $secondary;
  }

  &.gate {
    .icon-title_wrapper {
      justify-content: space-between;

      .section_wrapper-title {
        gap: 8px;
      }
    }

    .custom-condition-select {
      height: 24px;

      .arrow {
        top: 9px;
      }
    }

    .custom-condition-select .selected {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 3px 4px 3px 8px;
    }
  }
}
.line {
  width: 100%;
  height: 1px;
  background: $default-border;
}

.rewards-type {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #d7dce5;
  background: #e9ecf2;
  border-radius: 8px;

  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #667085;
  }

  .content {
    margin-top: -4px;

    &-title {
      font-size: 12px;
      line-height: 16px;
      color: $secondary;
    }

    &__block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 24px;

      &-title {
        font-size: 14px;
        line-height: 20px;
        color: $section-title;
      }
    }
  }
}
.flex {
  display: flex;
  gap: 8px;
}

.check-btn_wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  .check-btn_title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    font-feature-settings: 'zero' on;
    color: $default;
  }

  .type-label {
    background-color: #eaeafb;
    border-radius: 6px;
    padding: 3px 8px;

    & > span {
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 133.333%;
      cursor: default;
      color: #6a6d8f;
    }
  }
}

.content-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.add-talent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 132px;
  height: 42px;
  background: $default-badge-border;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}
.answers {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  .answer {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    cursor: move;
    .add-answer {
      display: flex;
      padding: 4px;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: #d7dce5;
    }
  }
}
.hidden {
  visibility: hidden;
}
.head-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    cursor: pointer;
  }
}
.blur {
  opacity: 0.4;
}
.footer {
  margin-top: 60px;
  gap: 24px;
}
</style>
