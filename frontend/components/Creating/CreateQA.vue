<template>
  <BaseModalNew :visible="true" @close="$emit('close')">
    <div class="create-task_wrapper">
      <div class="title_wrapper">
        <div class="title">Create Q&A</div>
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Cover Image</div>
        <div class="upload-requirements">
          Recommended size — 480 x 760 px. PNG, JPG, GIF, SVG, JPEG. Maximum 5 MB.
        </div>
        <TaskBannerUploader :setImage="setTaskBanner" :banner="bannerImage" :isEditingActive="true"
          :isError="!bannerImage && touched" errorText="Cover Image is Required" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Q&A title</div>
        <Input v-model="questionName" name="" placeholder="Enter Q&A title" :isError="!questionName && touched"
          errorText="Enter Q&A title" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Description</div>
        <div class="section_wrapper-subtitle">These are the instructions to complete Q&A.</div>
        <Editor :description="description" @update="setDescription"
          :isError="!description.replace(/<[^>]*>/g, '') && touched" errorText="Description is Required" />
      </div>
      <div class="section_wrapper last">
        <div class="section_item">
          <div class="section_wrapper-title">Start Date</div>
          <CustomDatePicker :defaultDate="transformDate(startDate)" :minDate="todayDate"
            :maxDate="transformDate(addDaysToDate(endDate, -1))" @selectedDate="setStartDate" />
        </div>
        <div class="section_item">
          <div class="section_wrapper-title">End Date</div>
          <CustomDatePicker :defaultDate="transformDate(endDate)" :minDate="transformDate(startDate)"
            @selectedDate="setEndDate" />
        </div>
      </div>
      <div class="line"></div>
      <div class="section_wrapper">
        <div class="section_wrapper-title flex gap-6">
          Questions
          <!--          <TooltipIcon tooltipText="tooltipText" />-->
        </div>
        <div class="section_wrapper-subtitle">
          Create up to 30 questions. <br />
          Enter a question and up to 5 answer options, mark the correct answer.
        </div>
        <div class="section_wrapper rewards-type" v-for="(question, index) in countOfQuestions" :key="question.id">
          <div class="section_wrapper-title head-control">
            Questions #{{ index + 1 }}
            <div class="flex items-center">
              <img src="@/assets/icons/up.svg" @click="shiftQuestionBackward(index)" alt=""
                :class="{ 'blur-custom': index === 0 }" />
              <img src="@/assets/icons/down.svg" @click="shiftQuestionForward(index)" alt=""
                :class="{ 'blur-custom': index === countOfQuestions.length - 1 }" />
              <img src="@/assets/icons/delete.svg" @click="deleteQuestion(index)" alt=""
                :class="{ 'blur-custom': countOfQuestions.length === 1 }" />
            </div>
          </div>
          <div class="section_wrapper-subtitle">
            Set a descriptive header and outline the criteria the user must meet to complete and
            answer this question
          </div>
          <Select :options="questsTypeItems" @input="
            question.type = $event;
          question.parameters = {};
          " />
          <div class="body">
            <span class="section_wrapper-subtitle">{{ question.type?.info?.description }}</span>
            <div class="content-block">
              <div v-if="question.type?.info" class="flex-col">
                <SocialConnect :data="question.type?.info"></SocialConnect>
              </div>
              <div v-else class="flex items-center gap-4">
                <CustomUpload :files="question.image" @images="question.image = $event"
                  @changeError="handleImageError" />
              </div>

              <div class="check-btn_wrapper">
                <div class="check-btn_title">Required</div>
                <Switch :checkedProp="question.required" @checked="question.required = $event" />
              </div>
            </div>
            <div class="flex gap-6 flex-col">
              <Input name="" placeholder="Question" v-model="question.question" :isError="!question.question && touched"
                errorText="Question is Required" />
              <TextArea placeholder="Description (optional)" v-model="question.description" />
              <div class="flex items-center gap-x-[8px]" v-if="question.type?.id === 0">
                <Checkbox label="Allow respondent to add file" @check="question.fileAllowed = $event" />
                <!--                <TooltipIcon tooltipText="tooltipText" />-->
              </div>
              <TwitterBlock v-if="question.type?.id === 3" :question="question" @input="question.twitter = $event" />
              <DiscordBlock v-if="question.type?.id === 4" :question="question" @input="question.discord = $event" />
              <Rating v-if="question.type?.id === 6" :question="question" />
              <NumberBlock v-if="question.type?.id === 7" :question="question" />
              <EmailBlock v-if="question.type?.id === 8" :question="question" />
              <LinkBlock v-if="question.type?.id === 9" :question="question" />
              <DateBlock v-if="question.type?.id === 10" :question="question" />
              <AddressBlock v-if="question.type?.id === 11" :question="question" />
              <PaymentsBlock v-if="question.type?.id === 12" :question="question" @input="question.payment = $event" />
              <div v-if="question.type?.id === 2">
                <div class="section_wrapper-subtitle">
                  Users will be asked to choose answers from listed below.
                </div>
                <div class="answers">
                  <div class="answer" v-for="(answer, id) in question.answers" :key="id">
                    <CheckboxAnswer @check="answer.isCorrect = !answer.isCorrect" />
                    <Answer v-model="answer.answer" :isError="!answer.answer && touched" :isCorrect="answer.isCorrect"
                      errorText="Answer is Required" :is-last="question.answers.length === 1"
                      @remove="question.answers.splice(id, 1)" />
                    <div class="add-answer" :class="{ hidden: question.answers.length - 1 !== id }"
                      @click="addAnswers(question.answers)">
                      <img src="@/assets/icons/add.svg" alt="" />
                    </div>
                  </div>
                  <div class="flex items-center gap-x-[8px] ml-[40px]">
                    <Checkbox label="Allow own answer" @check="question.openAnswerAllowed = $event" />
                    <!--                    <TooltipIcon tooltipText="tooltipText" />-->
                  </div>
                </div>
              </div>
            </div>
            <div v-if="question.type?.id === 1">
              <div class="answers">
                <div class="answer" v-for="(answer, id) in question.answers" :key="id">
                  <div class="status">
                    <div class="tooltip-checkbox">Mark this answer as correct.</div>
                    <Icon name="Tik" :class="{ isCorrect: answer.isCorrect }" @click="setAllIncorrect(index, id)"
                      :size="24"></Icon>
                  </div>
                  <Answer v-model="answer.answer" :isError="!answer.answer && touched" :isCorrect="answer.isCorrect"
                    errorText="Answer is Required" :is-last="question.answers.length === 1"
                    @remove="question.answers.splice(id, 1)" />
                  <div class="add-answer" :class="{ hidden: question.answers.length - 1 !== id }"
                    @click="addAnswers(question.answers)">
                    <img src="@/assets/icons/add.svg" alt="" />
                  </div>
                </div>
                <div class="flex items-center gap-x-[8px] ml-[40px]">
                  <Checkbox label="Allow own answer" @check="question.openAnswerAllowed = $event"></Checkbox>
                  <!--                  <TooltipIcon tooltipText="tooltipText" />-->
                </div>
              </div>
            </div>
            <div class="line my-6" />
            <div class="section_wrapper-subtitle mb-4">Points Reward</div>
            <NumberInput class="w-[136px]" placeholder="Points" v-model="question.points"
              :rule="question.points < 1 || question.points > 10" :isError="question.points < 1 || question.points > 10"
              errorText="Points value must be in the range of 1 and 10" />
          </div>
        </div>
        <div class="add-talent-btn" @click="addQuestion">
          <img src="@/assets/icons/add.svg" alt="" />
          <span>Add Question</span>
        </div>
        <div class="line my-8" />
        <div class="section_wrapper">
          <div class="flex justify-between">
            <div class="section_item">
              <div class="section_wrapper-title">Thank you Page</div>
              <div class="upload-requirements">Edit and customise</div>
            </div>
            <div class="check-btn_wrapper">
              <Switch :checkedProp="thxRequired" @checked="thxRequired = $event" />
            </div>
          </div>
          <div class="flex flex-col gap-y-4 mt-2" v-if="thxRequired">
            <div class="section_wrapper">
              <div class="section_wrapper-title">Cover Image</div>
              <div class="upload-requirements">
                Recommended size — 480 x 760 px. PNG, JPEG. Maximum 1 MB.
              </div>
              <CustomUpload :files="thxMessage.image" @images="thxMessage.image = $event"
                @changeError="handleImageError" />
            </div>
            <div class="section_wrapper">
              <div class="section_wrapper-title">Title</div>
              <Input v-model="thxMessage.title" name="" placeholder="Title" :isError="!thxMessage.title && touched"
                errorText="Enter the title" />
            </div>
            <div class="section_wrapper">
              <div class="section_wrapper-title">Description</div>
              <div class="section_wrapper-subtitle">
                These are the instructions to complete Q&A.
              </div>
              <TextArea placeholder="Description (optional)" v-model="thxMessage.description" />
            </div>
          </div>
        </div>
        <div class="line my-8" />

        <div class="flex justify-between">
          <div class="section_item">
            <div class="section_wrapper-title">Reff Link</div>
            <div class="upload-requirements">Edit and customise</div>
          </div>
          <div class="check-btn_wrapper">
            <Switch :checkedProp="refCode" @checked="refCode = $event" />
          </div>
        </div>
        <div class="section_wrapper" v-if="refCode">
          <div class="section_wrapper-title">Referral Bonus Points</div>
          <NumberInput withoutName class="w-[136px]" placeholder="Number" v-model="refCodePoints"
            :isError="(refCode && !refCodePoints) || refCodePoints > 10 || refCodePoints < 1"
            errorText="Points value must be in the range of 1 and 10" />
        </div>
        <div class="line my-8" />
        <div class="flex justify-between">
          <div class="section_item">
            <div class="section_wrapper-title">Logic Branching</div>
            <div class="upload-requirements">Edit and customise</div>
          </div>
          <div class="check-btn_wrapper">
            <Switch :checkedProp="branchRequired" @checked="branchRequired = $event" />
          </div>
        </div>
        <LogicBranching :quests="countOfQuestions" v-if="branchRequired" @input="branches = $event" />
        <div class="line my-8" />
        <div class="flex justify-between">
          <div class="section_item">
            <div class="section_wrapper-title">Rewards</div>
          </div>
          <div class="check-btn_wrapper">
            <Switch :checkedProp="rewardRequired" @checked="rewardRequired = $event" />
          </div>
        </div>
        <PaymentsBlock v-if="rewardRequired" @input="reward = $event" />
        <div class="flex gap-6 footer">
          <BaseButton type="primary" @click="preview" icon="View"> Preview</BaseButton>
          <BaseButton :text="statusMessage" :disabled="!validationCheck || loading" type="normal" @click="check" />
        </div>
      </div>
    </div>
  </BaseModalNew>
  <Alert :message="errorMessage" type="error" v-if="showError"></Alert>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import Select from '@/components/Select.vue';
import BaseButton from '@/components/BaseButton.vue';
import TaskBannerUploader from '@/components/Creating/TaskBannerUploader.vue';
import Editor from '@/components/Creating/Editor.vue';
import Answer from '@/components/Creating/Answer.vue';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import Input from '@/components/Input.vue';
import { transformDate, addDaysToDate, chunkData } from '@/util/helpers';
import Switch from '@/components/Creating/Switch.vue';
import TextArea from '@/components/Creating/TextArea.vue';
import Icon from '@/components/Icons/Icon.vue';
import { useQAStore } from '@/store/qa';
import Alert from '@/components/Alert.vue';
import Checkbox from '@/components/Creating/Checkbox.vue';
import { modal } from '@/mixins/modal';
import localForage from 'localforage';
import SocialConnect from '@/components/Creating/SocialConnect.vue';
import Rating from '@/components/Creating/Rating.vue';
import NumberBlock from '@/components/Creating/NumberBlock.vue';
import EmailBlock from '@/components/Creating/EmailBlock.vue';
import LinkBlock from '@/components/Creating/LinkBlock.vue';
import CheckboxAnswer from '@/components/Creating/CheckboxAnswer.vue';
import DateBlock from '@/components/Creating/DateBlock.vue';
import AddressBlock from '@/components/Creating/AddressBlock.vue';
import axiosService from '@/services/axiosService';
import TwitterBlock from '@/components/Creating/TwitterBlock.vue';
import DiscordBlock from '@/components/Creating/DiscordBlock.vue';
import LogicBranching from '@/components/Creating/LogicBranching.vue';
import NumberInput from '@/components/NumberInput.vue';
import BaseModalNew from '@/components/BaseModalNew.vue';
import { TransitionRoot } from '@headlessui/vue';
import PaymentsBlock from '@/components/Creating/PaymentBlock.vue';

const emits = defineEmits('refresh');
const loading = ref(false);
const isImagesError = ref(false);
const thxRequired = ref(false);
const branchRequired = ref(false);
const rewardRequired = ref(false);
const refCode = ref(false);
const todayDate = new Date();
const startDate = ref(todayDate);
const twoDaysFromNow = new Date(todayDate);
const endDate = ref(twoDaysFromNow);
const reward = ref(null);
const questsTypeItems = ref([
  { name: 'Open Question', id: 0, type: 'open' },
  { name: 'Quiz Question', id: 1, type: 'quiz' },
  { name: 'Multiple Choice', id: 2, type: 'multiple' },
  {
    name: 'Twitter Connect',
    id: 3,
    type: 'twitter',
    info: {
      icon: 'Twitter-Default',
      title: 'Connect X',
      description:
        'Users will be asked to connect their Twitter Account by clicking the button bellow.',
    },
  },
  {
    name: 'Discord Connect',
    id: 4,
    type: 'discord',
    info: {
      icon: 'Discord-Default',
      title: 'Connect Discord',
      description:
        'Users will be asked to connect their Discord Account by clicking the button bellow.',
    },
  },
  {
    name: 'Wallet Connect',
    id: 5,
    type: 'wallet',
    info: {
      icon: 'Wallet-Default',
      title: 'Connect Wallet',
      description: 'Users will be asked to connect their wallet by clicking the button bellow.',
    },
  },
  { name: 'Rate the List', id: 6, type: 'rate' },
  { name: 'Number', id: 7, type: 'number' },
  { name: 'Email Address', id: 8, type: 'email' },
  { name: 'Link', id: 9, type: 'link' },
  { name: 'Date', id: 10, type: 'date' },
  { name: 'Address', id: 11, type: 'address' },
  {
    name: 'Payments', id: 12, type: 'payment', info: {
      icon: 'NFT-Default',
      title: 'Mint NFT',
      description: 'Users will be asked to mint an NFT by clicking the button bellow.',
    },
  },
]);

const qaStore = useQAStore();
const thxMessage = ref({
  title: '',
  description: '',
  image: [],
  file: null,
});
const branches = ref([]);
const countOfQuestions = ref([
  {
    id: uuidv4(),
    question: '',
    questionType: '',
    fileAllowed: false,
    openAnswerAllowed: false,
    type: null,
    description: '',
    points: 1,
    file: '',
    image: [],
    parameters: {},
    twitter: {},
    discord: {},
    payment: {},
    required: false,
    answers: [{ answer: '', isCorrect: false }],
  },
]);
const errorMessage = ref('Error');
const thxValidation = computed(() => {
  if (thxRequired.value) {
    return !!(thxMessage.value.title && thxMessage.value.image.length);
  } else {
    return true;
  }
});
const validationCheck = computed(() => {
  const questionTitleIsEmpty = countOfQuestions.value.find((item) => !item.question);
  const questionPointsIsEmptyOrBiggerThenMax = countOfQuestions.value.find(
    (item) => !item.points || item.points > 10,
  );
  const questionAnswerIsEmpty = countOfQuestions.value.find(
    (item) => item.type?.id === 1 && item.answers.find((el) => !el.answer),
  );

  if ((refCode.value && refCodePoints.value < 1) || refCodePoints.value > 10) {
    return false;
  }

  if (
    !questionName.value ||
    !bannerImage.value ||
    !endDate.value ||
    !startDate.value ||
    !description.value ||
    !!questionTitleIsEmpty ||
    !!questionPointsIsEmptyOrBiggerThenMax ||
    !!questionAnswerIsEmpty ||
    !thxValidation.value
  ) {
    errorMessage.value = 'Some fields are empty or incorrect';
    return false;
  }

  return true;
});
const bannerImage = ref(null);
const showError = ref(false);
const questionName = ref('');
const description = ref('');
const refCodePoints = ref(5);
const setDescription = (event) => {
  description.value = event;
};
const setTaskBanner = (value) => {
  bannerImage.value = value;
};
const setAllIncorrect = (index, item) => {
  countOfQuestions.value[index].answers.map((el, id) => {
    if (item === id) {
      el.isCorrect = !el.isCorrect;
    } else {
      el.isCorrect = false;
    }
    return {
      el,
    };
  });
};

const handleImageError = (event) => {
  isImagesError.value = event;
};

const addQuestion = () => {
  if (countOfQuestions.value.length < 30) {
    countOfQuestions.value.push({
      id: uuidv4(),
      question: '',
      questionType: '',
      fileAllowed: false,
      openAnswerAllowed: false,
      type: 0,
      points: 1,
      description: '',
      file: '',
      image: [],
      required: false,
      parameters: {},
      twitter: {},
      discord: {},
      payment: {},
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
const statusMessage = ref('Publish Q&A');

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

const loadFiles = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let index = 0;
      const realTime = Math.floor(new Date().getTime() / 1000);
      if (typeof bannerImage.value !== 'string') {
        const formData = new FormData();

        formData.append('files[]', bannerImage.value);
        formData.append('paths[]', `/${process.env.DFX_NETWORK}/qa/${realTime}/${index}`);

        await axiosService
          .post(`${process.env.API_URL}upload-files`, formData)
          .then(({ data }) => (bannerImage.value = data[0]))
          .catch((e) => {
            throw e;
          });

        index++;
      }

      let filePaths = [];
      let files = [];
      if (countOfQuestions.value.some(({ image }) => !!image.length)) {
        for (const item of countOfQuestions.value) {
          if (item.image.length) {
            files.push(item.image[0].raw);
            filePaths.push(`/${process.env.DFX_NETWORK}/qa/${realTime}/${index}`);

            index++;
          }
        }

        const chunkedPaths = chunkData(filePaths);
        const chunkedFiles = chunkData(files);
        let uploadFilePaths = [];

        for (let i = 0; i < chunkedPaths.length; i++) {
          const formData = new FormData();

          chunkedPaths[i].forEach((path) => formData.append('paths[]', path));
          chunkedFiles[i].forEach((file) => formData.append('files[]', file));

          await axiosService
            .post(`${process.env.API_URL}upload-files`, formData)
            .then(({ data }) => (uploadFilePaths = [...uploadFilePaths, ...data]))
            .catch((e) => {
              throw e;
            });
        }

        let resultIndex = 0;
        for (const item of countOfQuestions.value) {
          if (item.image.length) {
            item.file = uploadFilePaths[resultIndex];

            resultIndex++;
          }
        }
      }

      if (thxMessage.value.image.length > 0 && thxRequired.value) {
        const formData = new FormData();

        formData.append('files[]', thxMessage.value.image[0].raw);
        formData.append('paths[]', `/${process.env.DFX_NETWORK}/qa/${realTime}/${index}`);

        await axiosService
          .post(`${process.env.API_URL}upload-files`, formData)
          .then(({ data }) => (thxMessage.value.file = data[0]))
          .catch((e) => {
            throw e;
          });
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
const convertImage = (file) => {
  return new Promise((resolve) => {
    if (file && FileReader) {
      const fr = new FileReader();
      fr.onload = function () {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

const preview = async () => {
  touched.value = true;
  if (!validationCheck.value) {
    showError.value = true;
    setTimeout(() => (showError.value = false), 2000);
    return;
  } else {
    touched.value = false;
  }

  const banner = await convertImage(bannerImage.value);

  const questionsPromises = countOfQuestions.value.map(async (item) => {
    const file = item.image[0] ? await convertImage(item.image[0].raw) : null;

    return {
      ...item,
      questionType: item.type.type,
      answers: item.answers.map(({ answer, isCorrect }) => {
        return {
          answer: answer.toString(),
          isCorrect,
        };
      }),
      file: file,
      answer: null,
      parameters: item.parameters,
    };
  });

  const questions = await Promise.all(questionsPromises);
  const obj = {
    title: questionName.value,
    refCodePoints: refCode.value ? [parseInt(refCodePoints.value)] : [],
    description: description.value,
    image: banner,
    participants: 0,
    shareLink: uuidv4(),
    end: Date.parse(endDate.value) / 1000,
    start: Date.parse(startDate.value) / 1000,
    questions: questions,
    thxMessage: thxRequired.value ? [thxMessage.value] : [],
    branches: branchRequired.value ? [branches.value] : [],
    rewards: rewardRequired.value && reward.value ? [reward.value] : [],
  };

  localStorage.previewData = JSON.stringify(obj);
  await localForage.setItem('previewData', JSON.stringify(obj), () => { });
  await window.open('/preview', '_blank');
};
const saveQA = async () => {
  return await qaStore.storeQA({
    title: questionName.value,
    refCodePoints: refCode.value ? [parseInt(refCodePoints.value)] : [],
    description: description.value,
    image: bannerImage.value,
    participants: 0,
    shareLink: uuidv4(),
    end: Date.parse(endDate.value) / 1000,
    start: Date.parse(startDate.value) / 1000,
    questions: countOfQuestions.value.map((item) => {
      if (!Object.keys(item.parameters).length) {
        item.parameters = [];
      } else {
        item.parameters = [JSON.stringify(item.parameters)];
      }

      return {
        ...item,
        questionType: item.type.type,
        answers: item.answers.map(({ answer, isCorrect }) => {
          return {
            answer: answer.toString(),
            isCorrect,
          };
        }),
        points: [parseInt(item.points)],
        twitter: Object.keys(item.twitter).length ? [item.twitter] : [],
        discord: Object.keys(item.discord).length ? [item.discord] : [],
        payment: Object.keys(item.payment).length ? [item.payment] : [],
      };
    }),
    thxMessage: thxRequired.value ? [thxMessage.value] : [],
    branches: branchRequired.value && branches.value ? [branches.value] : [],
    rewards: rewardRequired.value && reward.value ? [reward.value] : [],
  });
};

const resetFields = () => {
  bannerImage.value = '';
  questionName.value = description.value = '';
  thxRequired.value = false;
  countOfQuestions.value = [
    {
      question: '',
      questionType: '',
      type: null,
      description: '',
      file: '',
      image: [],
      required: false,
      fileAllowed: false,
      openAnswerAllowed: false,
      points: 1,
      answers: [{ answer: '', isCorrect: false }],
    },
  ];
};

const check = async () => {
  let uploadFailed = false;
  touched.value = true;
  if (!validationCheck.value) {
    showError.value = true;
    setTimeout(() => (showError.value = false), 2000);
    return;
  }

  loading.value = true;
  try {
    await modal.emit('openModal', {
      title: 'Loading files...',
      message: 'Please wait for a while',
      type: 'loading',
    });

    await loadFiles();
  } catch (err) {
    uploadFailed = true;
    console.error(err);
  } finally {
    statusMessage.value = 'Publish Quest';
    loading.value = false;
  }

  if (uploadFailed) {
    modal.emit('openModal', {
      title: 'Files upload failed',
      message: 'Please, make sure uploaded files meet the requirements!',
      type: 'error',
    });
    return;
  }

  try {
    await modal.emit('openModal', {
      title: 'Loading data...',
      message: 'Please wait for a while',
      type: 'loading',
    });
    await saveQA();
    await resetFields();
    touched.value = false;
    await modal.emit('closeModal', {});
    emits('refresh');
    emits('close');
  } catch (err) {
    console.error(err);
    modal.emit('openModal', {
      title: 'Error Message',
      message: 'Something went wrong!',
      type: 'error',
      actionText: 'Try again',
      fn: check,
    });
  } finally {
    statusMessage.value = 'Publish Quest';
    loading.value = false;
  }
};

watch(thxRequired, (value) => {
  if (!value) {
    thxMessage.value = {
      title: '',
      description: '',
      image: [],
      file: null,
    };
  }
});
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
        color: $section-title;
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
          border-right: 1px solid $default-border;
          border-radius: 8px 0 0 8px;
          background-color: #dad9f7;
          top: 0;

          &>svg {
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
  border: 1px solid $default-border;
  background: #e9ecf2;
  border-radius: 8px;
  margin-top: 12px;

  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #667085;
  }

  .body {
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

    &>span {
      font-family: $default_font;
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

.add-talent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  background: #e9ecf2;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;

  font-family: $default_font;
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
      background: transparent;

      &:hover {
        background: $default-border;
      }
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

.blur-custom {
  opacity: 0.4;
}

.footer {
  margin-top: 60px;
  gap: 24px;
}

.status {
  display: flex;
  padding: 4px;
  align-items: center;
  border-radius: 8px;
  position: relative;
  background: transparent;

  .tooltip-checkbox {
    display: none;
  }

  &:hover {
    background: $default-border;

    .tooltip-checkbox {
      display: block;
      position: absolute;
      width: 125px;

      background: $default;
      box-shadow: 0 2px 8px rgba(26, 29, 41, 0.24);
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 12px;
      z-index: 9999999;
      transform: translateY(100%) translateX(-50%);
      margin-bottom: 5px;

      font-family: $default_font;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings:
        'tnum' on,
        'lnum' on,
        'zero' on;
      color: $white;
      text-align: left;
      bottom: 76px;
      left: 50%;

      &::after {
        content: '';
        position: absolute;
        width: 28px;
        height: 18px;
        background: $default;
        transform: rotate(45deg) translateX(-50%);
        z-index: -1;
        top: 32px;
        left: 44%;
      }
    }
  }

  .isCorrect {
    filter: invert(51%) sepia(11%) saturate(2579%) hue-rotate(70deg) brightness(102%) contrast(87%);
  }
}
</style>
