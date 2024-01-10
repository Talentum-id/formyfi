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
        <TaskBannerUploader
          :setImage="setTaskBanner"
          :banner="bannerImage"
          :isEditingActive="true"
          :isError="!bannerImage && touched"
          errorText="Cover Image is Required"
        />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Quest Name</div>
        <Input
          v-model="questionName"
          name=""
          placeholder="Enter the quest name"
          :isError="!questionName && touched"
          errorText="Enter the quest name"
        />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Description</div>
        <div class="section_wrapper-subtitle">
          These are the instructions to complete the quest.
        </div>
        <Editor
          :description="description"
          @update="setDescription"
          :isError="!bannerImage && touched"
          errorText="Description is Required"
        />
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
            Questions #{{ index + 1 }}
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
            :id="question.type"
            fixedWidth="100%"
            @select="question.type = $event.id"
          />
          <div class="content">
            <div>
              <div class="content-block">
                <CustomUpload
                  :imagesFiles="question.images"
                  @images="question.images = $event"
                  @changeError="handleImageError"
                />
                <div class="check-btn_wrapper">
                  <div class="check-btn_title">Required</div>
                  <Switch :checkedProp="question.required" @checked="question.required = $event" />
                </div>
              </div>
              <div class="flex flex-col">
                <Input
                  name=""
                  placeholder="Question"
                  v-model="question.question"
                  :isError="!question.question && touched"
                  errorText="Question is Required"
                />
                <TextArea placeholder="Description (optional)" v-model="question.description" />
              </div>
              <div v-if="question.type === 1">
                <div class="answers">
                  <div class="answer" v-for="(answer, id) in question.answers" :key="id">
                    <div class="status">
                      <Icon
                        name="Tik"
                        :class="{ isCorrect: answer.isCorrect }"
                        @click="
                          setAllIncorrect(index);
                          answer.isCorrect = !answer.isCorrect;
                        "
                      ></Icon>
                    </div>
                    <Answer
                      v-model="answer.answer"
                      :isError="!answer.answer && touched"
                      :isCorrect="answer.isCorrect"
                      errorText="Answer is Required"
                      @setIncorrect="setAllIncorrect(index)"
                    />
                    <div
                      class="add-answer"
                      :class="{ hidden: question.answers.length - 1 !== id }"
                      @click="addAnswers(question.answers)"
                    >
                      <img src="@/assets/icons/add.svg" alt="" />
                    </div>
                  </div>
                </div>
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
          <BaseButton
            :text="statusMessage"
            :disabled="!validationCheck"
            type="normal"
            @click="check"
          />
        </div>
      </div>
    </div>
    <Alert :message="errorMessage" type="error" v-if="showError"></Alert>
  </BaseModal>
</template>
<script setup>
import { computed, ref } from 'vue';
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
import { useQAStore } from '@/store/qa';
import { useAssetsStore } from '@/store/assets';
import Alert from '@/components/Alert.vue';

const emits = defineEmits('refresh');

const show = ref(false);
const isImagesError = ref(false);
const todayDate = new Date();
const startDate = ref(todayDate);
const twoDaysFromNow = new Date(todayDate);
const endDate = ref(twoDaysFromNow);
const questsTypeItems = ref([
  { title: 'Open Question', id: 0, name: 'question' },
  { title: 'Quiz Question', id: 1, name: 'quiz' },
  // { title: 'Multiple Choice', id: 2, name: 'multiple' },
]);
const qaStore = useQAStore();
const assetsStore = useAssetsStore();

const countOfQuestions = ref([
  {
    question: '',
    questionType: '',
    type: 0,
    description: '',
    files: [],
    images: [],
    required: false,
    answers: [{ answer: '', isCorrect: false }],
  },
]);
const errorMessage = ref('Error');
const validationCheck = computed(() => {
  const questionTitleIsEmpty = countOfQuestions.value.find((item) => !item.question);
  const questionAnswerIsEmpty = countOfQuestions.value.find(
    (item) => item.type && item.answers.find((el) => !el.answer),
  );
  const imagesIsRequired = countOfQuestions.value.find(
    (item) => !item.images.length && item.required,
  );
  if (
    !questionName.value ||
    !bannerImage.value ||
    !endDate.value ||
    !startDate.value ||
    !description.value ||
    !!questionTitleIsEmpty ||
    !!questionAnswerIsEmpty ||
    !!imagesIsRequired
  ) {
    errorMessage.value = 'Some fields are empty or incorrect';
    return false;
  } else {
    return true;
  }
});
const answers = ref([0]);
const bannerImage = ref(null);
const showError = ref(false);
const questionName = ref('');
const description = ref('');
const setDescription = (event) => {
  description.value = event;
};
const setTaskBanner = (value) => {
  bannerImage.value = value;
};
const setAllIncorrect = (index) => {
  countOfQuestions.value[index].answers.map((el) => (el.isCorrect = false));
};

const handleImageError = (event) => {
  isImagesError.value = event;
};

const addQuestion = () => {
  if (countOfQuestions.value.length < 8) {
    countOfQuestions.value.push({
      question: '',
      questionType: '',
      type: 0,
      description: '',
      files: [],
      images: [],
      required: false,
      answers: [{ answer: '', isCorrect: false }],
    });
  }
};

const addAnswers = (arr) => {
  arr.push({
    id: arr.length + 1,
    answer: '',
    isCorrect: false,
  });
};

const showPreview = () => {
  show.value = !show.value;
};

const shiftQuestionForward = (index) => {
  if (index < countOfQuestions.value.length - 1) {
    swapQuestions(index, index + 1);
  }
};

const shiftQuestionBackward = (index) => {
  if (index > 0) {
    swapQuestions(index, index - 1);
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
  endDate.value = isToday ? todayDate : event;
};

const setStartDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isTodayDate = eventDate.getDate() === today.getDate();
  startDate.value = isTodayDate ? todayDate : event;
};

const touched = ref(false);
const statusMessage = ref('Publish Quest');

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

const loadImages = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (typeof bannerImage.value !== 'string'){
        bannerImage.value = await assetsStore.assetManager.store(bannerImage.value);
      }

      await Promise.all(
        countOfQuestions.value.map(async (item) => {
          if (item.images.length) {
            item.files = await Promise.all(
              item.images.map(async (file) => await assetsStore.assetManager.store(file.raw)),
            );
          }
        }),
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const saveQA = async () => {
  return await qaStore
    .storeQA({
      title: questionName.value,
      description: description.value,
      image: bannerImage.value,
      participants: 0,
      shareLink: uuidv4(),
      end: Date.parse(endDate.value) / 1000,
      start: Date.parse(startDate.value) / 1000,
      questions: countOfQuestions.value.map((item) => {
        return {
          ...item,
          questionType: item.type ? 'quiz' : 'open',
          answers: item.type ? item.answers : [],
        };
      }),
    });
};

const check = async () => {
  touched.value = true;

  if (!validationCheck.value) {
    showError.value = true;
    setTimeout(() => (showError.value = false), 2000);

    return;
  }

  try {
    statusMessage.value = 'Loading images...';
    await loadImages();

    statusMessage.value = 'Loading data...';
    await saveQA();
    
    show.value = false;
    emits('refresh');
  } catch (err) {
    console.log(err);
    errorMessage.value = 'Something went wrong';
    showError.value = true;
    setTimeout(() => (showError.value = false), 2000);
  } finally {
    statusMessage.value = 'Publish Quest';
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
      dragging: false,
    };
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
  margin-top: 24px;
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
  gap: 24px;
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
  margin: 12px 0;
}
.flex-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.add-talent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 132px;
  height: 42px;
  background: #e9ecf2;
  border: 1px solid #d7dce5;
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
.status {
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;

  .isCorrect {
    filter: invert(51%) sepia(11%) saturate(2579%) hue-rotate(70deg) brightness(102%) contrast(87%);
  }
}
</style>
