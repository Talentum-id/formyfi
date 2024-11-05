<template>
  <div v-show="visible" class="layout">
    <div class="slider">
      <FirstEmptyItem v-if="items[currentIndex - 2]"></FirstEmptyItem>
      <Item v-if="items[currentIndex - 1]" :item="items[currentIndex - 1].question"></Item>
      <CurrentItem
        :class="{
          marginTop: !items[currentIndex - 1],
          marginBottom: !items[currentIndex + 1],
        }"
        @close="closeModal()"
      >
        <div class="flex flex-col gap-y-[24px] w-full content">
          <QuizProgress :length="items.length" :current-index="currentIndex"></QuizProgress>
          <QuizProgressTitle
            :size="items.length"
            :current-step="currentIndex + 1"
          ></QuizProgressTitle>

          <div
            class="flex items-center justify-center"
            v-if="newArr[currentIndex].file && questionFiles[currentIndex]"
          >
            <video v-if="isVideo" controls>
              <source :src="questionFiles[currentIndex]" type="video/mp4" />
            </video>
            <audio class="w-full" controls v-else-if="isAudio">
              <source :src="questionFiles[currentIndex]" type="audio/ogg" />
              <source :src="questionFiles[currentIndex]" type="audio/mp3" />
              <source :src="questionFiles[currentIndex]" type="audio/mpeg" />
            </audio>
            <CustomImage
              v-else
              :image="questionFiles[currentIndex]"
              heigth="160"
              width="160"
            ></CustomImage>
          </div>
          <div class="question-title">{{ newArr[currentIndex].question }}</div>
          <div class="question-description" v-if="newArr[currentIndex].description">
            {{ newArr[currentIndex].description }}
          </div>
          <div v-if="getDataByType(newArr[currentIndex].questionType) === 'NOT_SOCIAL'">
            <Rating
              v-if="newArr[currentIndex].questionType === 'rate'"
              :answer="newArr[currentIndex]"
              :disabled="!!cacheAnswer"
            />
            <NumberBlock
              v-else-if="newArr[currentIndex].questionType === 'number'"
              :answer="newArr[currentIndex]"
              :disabled="cacheAnswer !== null"
            />
            <EmailBlock
              v-else-if="newArr[currentIndex].questionType === 'email'"
              :answer="newArr[currentIndex]"
              :disabled="cacheAnswer !== null"
            />
            <LinkBlock
              v-else-if="newArr[currentIndex].questionType === 'link'"
              :answer="newArr[currentIndex]"
              :disabled="cacheAnswer !== null"
            />
            <DateBlock
              v-else-if="newArr[currentIndex].questionType === 'date'"
              :answer="newArr[currentIndex]"
              :disabled="cacheAnswer !== null"
            />
            <AddressBlock
              v-else-if="newArr[currentIndex].questionType === 'address'"
              :answer="newArr[currentIndex]"
              :disabled="cacheAnswer !== null"
            />
            <div class="answer-textarea" v-else-if="isOpenQuestion">
              <TextArea
                placeholder="Your Answer"
                v-model="newArr[currentIndex].answer"
                class="w-full"
                :disabled="cacheAnswer"
              />
              <CustomImage
                v-if="answers[currentIndex] && answers[currentIndex].file"
                class="banner"
                heigth="160"
                width="160"
                :image="
                  answers[currentIndex].file
                    ? answerFiles[currentIndex]
                    : newArr[currentIndex].uploadedFile
                "
              />

              <CustomUpload
                v-if="disableUploader"
                :files="newArr[currentIndex].answerFile"
                @images="newArr[currentIndex].answerFile = $event"
              ></CustomUpload>
              <div
                class="w-full text-center mt-[20px]"
                v-if="newArr[currentIndex].answer || newArr[currentIndex].answerFile.length"
              ></div>
            </div>
            <div v-else-if="newArr[currentIndex].questionType === 'quiz'">
              <el-radio-group
                v-model="newArr[currentIndex].answer"
                class="flex flex-col gap-y-[8px] items-center content-center container-radio"
                :border="false"
              >
                <el-radio-button
                  class="radio"
                  :label="answer.answer"
                  :aria-selected="newArr[currentIndex].answer === answer.answer"
                  v-for="answer in newArr[currentIndex].answers"
                  :disabled="cacheAnswer"
                />
                <input
                  class="allowed-input"
                  type="text"
                  v-model="newArr[currentIndex].myAnswer"
                  v-if="newArr[currentIndex].openAnswerAllowed && isAdditionalAnswer"
                  @focus="newArr[currentIndex].answer = ''"
                  :placeholder="cacheAnswer || 'Your answer...'"
                  :disabled="cacheAnswer"
                  :class="{
                    selected:
                      cacheAnswer ||
                      (!newArr[currentIndex].answer && newArr[currentIndex].myAnswer),
                  }"
                />
              </el-radio-group>
            </div>
            <div v-else class="flex justify-center">
              <el-checkbox-group
                v-model="newArr[currentIndex].myAnswers"
                class="flex flex-col gap-y-[8px] items-center content-center container-radio"
                :border="false"
              >
                <el-checkbox-button
                  class="radio"
                  :label="answer.answer"
                  :aria-selected="newArr[currentIndex].myAnswers.indexOf(answer.answer) !== -1"
                  v-for="answer in newArr[currentIndex].answers"
                  :disabled="cacheAnswer"
                />
                <input
                  class="allowed-input"
                  type="text"
                  v-model="newArr[currentIndex].myAnswer"
                  v-if="
                    newArr[currentIndex].openAnswerAllowed &&
                    isAdditionalAnswer &&
                    cacheAnswer !== 'undeF1N3d'
                  "
                  @focus="newArr[currentIndex].answer = ''"
                  :placeholder="cacheAnswer || 'Your answer...'"
                  :disabled="cacheAnswer"
                  :class="{
                    selected:
                      cacheAnswer ||
                      (!newArr[currentIndex].answer && newArr[currentIndex].myAnswer),
                  }"
                />
              </el-checkbox-group>
            </div>
          </div>
          <div class="flex flex-col items-center m-auto gap-1" v-else>
            <div class="flex gap-1 items-center wrapper-title font-semibold">
              {{ getDataByType(newArr[currentIndex].questionType).info.title }}
            </div>
            <div
              class="wrapper-subtitle w-[450px] mb-4"
              v-html="getDataByType(newArr[currentIndex].questionType).info.description"
            />

            <BaseButton
              type="normal"
              @click="getDataByType(newArr[currentIndex].questionType).fn()"
            >
              <Icon
                :name="getDataByType(newArr[currentIndex].questionType).icon"
                class="icon-soc"
                :size="24"
              />
              {{ getDataByType(newArr[currentIndex].questionType).title }}
            </BaseButton>
            <SocialVerify
              class="mt-4"
              v-if="newArr[currentIndex].discord?.length && !!newArr[currentIndex].answer"
              action="invite"
              :social-icon="getDataByType(newArr[currentIndex].questionType).icon"
              :action-type="newArr[currentIndex].discord[0].link"
              :provider="newArr[currentIndex].questionType"
              :provider-id="storedProviderId"
              :title="`Join the ${newArr[currentIndex].discord[0].server}`"
              :verified="
                (cacheAnswer && !!cacheAnswer.length) ||
                Object.keys(newArr[currentIndex].discord[0]).length ===
                  newArr[currentIndex].verificationAmount
              "
              @verify="incrementVerification()"
            />
            <div
              class="w-full flex flex-col gap-2 mt-4"
              v-for="social in newArr[currentIndex].twitter"
            >
              <SocialVerify
                v-if="social.reply && !!newArr[currentIndex].answer"
                action="reply"
                :social-icon="getDataByType(newArr[currentIndex].questionType).icon"
                :action-type="social.reply"
                :provider-id="storedProviderId"
                :provider="newArr[currentIndex].questionType"
                :verified="
                  (cacheAnswer && !!cacheAnswer.length) ||
                  Object.keys(newArr[currentIndex].twitter[0]).length ===
                    newArr[currentIndex].verificationAmount
                "
                title="Reply to this post"
                @verify="incrementVerification()"
              />
              <SocialVerify
                v-if="social.retweet && !!newArr[currentIndex].answer"
                action="retweet"
                :social-icon="getDataByType(newArr[currentIndex].questionType).icon"
                :action-type="social.retweet"
                :provider-id="storedProviderId"
                :provider="newArr[currentIndex].questionType"
                :verified="
                  (cacheAnswer && !!cacheAnswer.length) ||
                  Object.keys(newArr[currentIndex].twitter[0]).length ===
                    newArr[currentIndex].verificationAmount
                "
                title="Retweet this post"
                @verify="incrementVerification()"
              />
              <SocialVerify
                v-if="social.follow && !!newArr[currentIndex].answer"
                action="follow"
                :social-icon="getDataByType(newArr[currentIndex].questionType).icon"
                :action-type="social.follow"
                :provider-id="storedProviderId"
                :provider="newArr[currentIndex].questionType"
                :title="`Follow ${social.follow}`"
                :verified="
                  (cacheAnswer && !!cacheAnswer.length) ||
                  Object.keys(newArr[currentIndex].twitter[0]).length ===
                    newArr[currentIndex].verificationAmount
                "
                @verify="incrementVerification()"
              />
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
  <TemplatePromise v-slot="{ resolve, reject }">
    <BaseModal :visible="show" width="500" @close="onClose">
      <div class="p-12">
        <Login
          @success="hasUser ? resolve(true) : (showSignUp = true)"
          @reject="reject(null)"
          @skip="resolve(true)"
          is-quest
          v-if="!showSignUp"
        ></Login>
        <SignUp v-else @success="resolve(true)" @reject="reject(null)"></SignUp>
      </div>
    </BaseModal>
  </TemplatePromise>
</template>
<script setup>
import BaseButton from '@/components/BaseButton.vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import { checkFileFormat, readFile } from '@/util/helpers';
import TextArea from '@/components/Creating/TextArea.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import { ElCheckboxGroup, ElCheckboxButton, ElRadioGroup, ElRadioButton } from 'element-plus';
import { useRoute } from 'vue-router';
import { useCounterStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import { useResponseStore } from '@/store/response';
import { modal } from '@/mixins/modal';
import Item from '@/components/Details/Carousel/Item.vue';
import LastEmptyItem from '@/components/Details/Carousel/LastEmptyItem.vue';
import FirstEmptyItem from '@/components/Details/Carousel/FirstEmptyItem.vue';
import CurrentItem from '@/components/Details/Carousel/CurrentItem.vue';
import QuizProgress from '@/components/Details/QuizProgress.vue';
import QuizProgressTitle from '@/components/Details/QuizProgressTitle.vue';
import CustomImage from '@/components/CustomImage.vue';
import BaseModal from '@/components/BaseModal.vue';
import Login from '@/components/Auth/Login.vue';
import { createTemplatePromise } from '@vueuse/core';
import SignUp from '@/components/Auth/SignUp.vue';
import Icon from '@/components/Icons/Icon.vue';
import Rating from '@/components/Details/Carousel/Rating.vue';
import NumberBlock from '@/components/Details/Carousel/NumberBlock.vue';
import EmailBlock from '@/components/Details/Carousel/EmailBlock.vue';
import LinkBlock from '@/components/Details/Carousel/LinkBlock.vue';
import DateBlock from '@/components/Details/Carousel/DateBlock.vue';
import AddressBlock from '@/components/Details/Carousel/AddressBlock.vue';
import axiosService from '@/services/axiosService';
import error from '@/assets/icons/modal/error.vue';
import SocialVerify from '@/components/Details/Carousel/SocialVerify.vue';
import { getRuleForCurrentType } from '@/constants/branchTypes';
import { reloadingProviders } from '@/constants/reloadingProviders';

const TemplatePromise = createTemplatePromise();
const showSignUp = ref(false);
const route = useRoute();
const counterStore = useCounterStore();
const responseStore = useResponseStore();
const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
  visible: {
    default: false,
    type: Boolean,
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
  branches: {
    type: Array,
    default: () => [],
  },
  thankYouMessage: {
    type: Object,
    default: null,
  },
  refCodePoints: {
    type: Array,
    default: null,
  },
  quest: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['close', 'success']);
const authStore = useAuthStore();
const show = ref(false);
const isGuest = ref(false);
const questionFiles = ref([]);
const answerFiles = ref([]);
const currentIndex = ref(findCurrentItemIndex());
const hasUser = computed(() => useAuthStore().getUser);
const loading = ref(false);
const newArr = ref(
  props.items.map((item) => {
    return {
      ...item,
      myAnswers: [],
      answer: '',
      uploadedFile: '',
      answerFile: [],
    };
  }),
);
const rerenderImages = ref(false);
const result = ref([]);
const realTime = computed(() => Math.floor(Date.now() / 1000));
const cacheAnswer = computed(() => {
  const currentAnswer = props.answers[currentIndex.value];
  const currentQuestion = newArr.value[currentIndex.value];

  if (props.answers.length && currentAnswer) {
    if (currentQuestion.questionType === 'multiple') {
      let cacheAnswer = 'undeF1N3d';
      let answers = JSON.parse(currentAnswer.answer);
      let answerValues = currentQuestion.answers.map(({ answer }) => answer);
      let custom = answers.find((answer) => !answerValues.includes(answer));

      if (custom !== undefined) {
        cacheAnswer = answers[answers.length - 1];

        answers.splice(answers.length - 1, 1);
      }

      currentQuestion.myAnswers = answers;

      return cacheAnswer;
    }

    return currentAnswer.answer;
  } else {
    return null;
  }
});
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
  const currentQuestion = newArr.value[currentIndex.value];

  const answer = currentQuestion.answer;
  const additional = currentQuestion.myAnswer;
  const files = currentQuestion.answerFile.length;

  if (currentQuestion.questionType === 'multiple') {
    return !(!currentQuestion.required || currentQuestion.myAnswers.length || additional);
  }

  if (
    ['twitter', 'discord'].indexOf(currentQuestion.questionType) !== -1 &&
    !!currentQuestion[currentQuestion.questionType].length
  ) {
    return (
      currentQuestion.verificationAmount <
      Object.values(currentQuestion[currentQuestion.questionType][0]).filter(
        (item) => !!item.length,
      ).length
    );
  }

  return !(!currentQuestion.required || answer || additional || files);
});
const isPreview = computed(() => route.name === 'preview');
const noCorrectAnswers = (item) => {
  return item.answers.every((el) => !el.isCorrect);
};
const isCorrect = (item) => {
  return item.answers.every((el) => item.answer === el.answer && el.isCorrect);
};
const disableUploader = computed(() => {
  return (
    newArr.value[currentIndex.value].fileAllowed &&
    !newArr.value[currentIndex.value].uploadedFile &&
    !rerenderImages.value &&
    !cacheAnswer.value
  );
});
const isOpenQuestion = computed(() => {
  return newArr.value[currentIndex.value].questionType === 'open';
});
const step = computed(() => counterStore.getStep);
const incrementVerification = () => {
  if (newArr.value[currentIndex.value].questionType === 'discord') {
    newArr.value[currentIndex.value].verificationAmount += 2;
  } else {
    newArr.value[currentIndex.value].verificationAmount += 1;
  }
};
const getDataByType = (type) => {
  switch (type) {
    case 'twitter':
      return {
        icon: 'Twitter-Default',
        title: !!newArr.value[currentIndex.value].answer.length
          ? `Disconnect ${newArr.value[currentIndex.value].answer}`
          : 'Connect X',
        fn: () =>
          newArr.value[currentIndex.value].answer !== '' ? disconnectSocial() : connectSocial(type),
        info: {
          title: 'What is your X username?',
          description: 'Please verify your account by clicking the button below.',
        },
      };
    case 'discord':
      return {
        icon: 'Discord-Default',
        title: !!newArr.value[currentIndex.value].answer.length
          ? `Disconnect (${newArr.value[currentIndex.value].answer})`
          : 'Connect Discord',
        fn: () =>
          newArr.value[currentIndex.value].answer !== '' ? disconnectSocial() : connectSocial(type),
        info: {
          title: 'What is your Discord handle?',
          description: 'Please verify your account by clicking the button below.',
        },
      };
    case 'wallet':
      return {
        icon: 'Wallet-Default',
        title: !!newArr.value[currentIndex.value].answer
          ? `Disconnect ${newArr.value[currentIndex.value].answer}`
          : 'Connect Wallet',
        fn: () => (newArr.value[currentIndex.value].answer !== '' ? disconnectSocial() : connect()),
        info: {
          title: 'What is your wallet address?',
          description:
            '<span>Please connect your wallet and sign the message to verify ownership <br/> NOTE: connecting your wallet will not trigger a transaction or cost any gas fees.</span>',
        },
      };
    default:
      return 'NOT_SOCIAL';
  }
};
const connectSocial = async (provider) => {
  if (!newArr.value[currentIndex.value].answer) {
    await useAuthStore().connectSocial(provider);
  }
};
const disconnectSocial = async () => {
  // remove deprecated social info for social connect and verification successful handling
  localStorage.removeItem('socialInfo');
  localStorage.removeItem('providerId');
  newArr.value[currentIndex.value].answer = '';
  storedValue.value = storedProviderId.value = '';
};
onMounted(async () => {
  if (newArr.value[currentIndex.value].verificationAmount === undefined) {
    newArr.value[currentIndex.value].verificationAmount = 0;
  }

  newArr.value[currentIndex.value].answer = cacheAnswer.value ?? '';

  for (const question of newArr.value) {
    const index = newArr.value.indexOf(question);

    if (question.file) {
      if (!isPreview.value) {
        questionFiles.value[index] = await readFile(question.file);
      } else {
        questionFiles.value[index] = question.file;
      }
    } else {
      questionFiles.value[index] = null;
    }
  }

  for (const answer of props.answers) {
    const index = props.answers.indexOf(answer);

    if (answer.file) {
      answerFiles.value[index] = await readFile(answer.file);
    } else {
      answerFiles.value[index] = null;
    }
  }

  await checkFileType();
});

function findCurrentItemIndex() {
  return props.items.findIndex((item) => item.question === props.currentItem.question);
}

const prevSlide = () => {
  newArr.value[currentIndex.value].verificationAmount = 0;

  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const loadImages = () => {
  return new Promise(async (resolve, reject) => {
    try {
      handleLoadingFilesModal();

      let index = currentIndex.value;

      const formData = new FormData();

      if (result.value.some(({ file }) => !!file.length)) {
        for (const item of result.value) {
          if (item.file) {
            formData.append('files[]', item.file?.[0].raw);
            formData.append(
              'paths[]',
              `/${process.env.DFX_NETWORK}/responses/${realTime.value}/${index}`,
            );
          }
        }

        await axiosService
          .post(`${process.env.API_URL}upload-files`, formData)
          .then(({ data }) => {
            let resultIndex = 0;

            for (const item of result.value) {
              if (item.file) {
                item.file = data[resultIndex];

                resultIndex++;
              }
            }
          })
          .catch((e) => console.error(e));
      }

      resolve();
    } catch (error) {
      handleErrorModal();
      reject(error);
    }
  });
};

const handleSuccessModal = async () => {
  const { thankYouMessage } = props;
  const { refCodePoints } = props;

  let title = 'Q&A Form Submitted';
  let message =
    'Thank you for taking the time to submit your responses! Be sure to follow us on X to stay updated!';
  let customImg = null;
  let refBonusData = {};
  if (thankYouMessage) {
    title = thankYouMessage.title;
    message = thankYouMessage.description || message;
    customImg = await readFile(thankYouMessage.file);
  }
  if (refCodePoints?.length > 0 && authStore.getPrincipal) {
    refBonusData.link = `${window.location.origin}/form/${props.shareLink}?ref-code=${authStore.getUser.username}`;
    refBonusData.bonus = Number(refCodePoints[0]);
  }

  modal.emit('openModal', {
    title,
    message,
    type: 'success',
    actionText: 'Great!',
    customImg,
    refBonusData,
    isEmail: true,
    fn: () => {
      if (
        isGuest.value &&
        reloadingProviders.indexOf(localStorage.getItem('authenticationProvider')) !== -1
      ) {
        window.location.reload();
      } else {
        modal.emit('closeModal', {});
      }
    },
    sendEmail: (email) => {
      axiosService
        .post(`${process.env.API_URL}responses/dispatch`, {
          email: email,
          quest: props.quest,
          answers: result.value,
        })
        .catch((e) => console.error(e));
    },
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
const handleLoadingFilesModal = () => {
  modal.emit('openModal', {
    title: 'Uploading files...',
    message: 'Please wait for a while',
    type: 'loading',
  });
};
const storeResponseAndClose = async () => {
  try {
    await handleLoadingModal();
    await responseStore.storeResponse({
      filled: realTime.value,
      shareLink: props.shareLink,
      answers: result.value,
      owner: authStore.getPrincipal,
    });
    await counterStore.setValue(props.items.length);

    if (route.query['ref-code'] !== undefined && route.query['ref-code'].trim() !== '') {
      await responseStore.creditPoints(props.shareLink, route.query['ref-code'].trim());
    }

    await closeModal();
    await handleSuccessModal();
  } catch (e) {
    console.error(e);
    handleErrorModal();
  }
};
const closeModal = async () => {
  await emit('close');
  document.body.style.overflow = '';
};
const checkUserIdentity = async () => {
  show.value = true;
  await TemplatePromise.start();
  showSignUp.value = false;
  show.value = false;
};
const nextSlide = async () => {
  storedValue.value = storedProviderId.value = '';

  if (cacheAnswer.value || isPreview.value || step.value > props.items.length - 1) {
    if (currentIndex.value < props.items.length - 1) {
      await branchCheck();
    } else {
      await closeModal();
    }
    return;
  }
  if (disableBtn.value) {
    return;
  }

  await counterStore.setValue(currentIndex.value);
  await branchCheck();
};
const connect = async () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const currentFullURL = window.location.origin + route.fullPath;
  const { ethereum } = window;
  if (!ethereum) {
    if (isMobile) {
      window.location.href = `https://metamask.app.link/dapp/${currentFullURL}`;
    } else {
      window.open('https://metamask.io/', '_blank');
    }
    return;
  }
  if (!newArr.value[currentIndex.value].answer) {
    const providerMM = window.ethereum.providers
      ? window.ethereum.providers.find((provider) => provider.isMetaMask)
      : window.ethereum;
    const accounts = await providerMM.request({
      method: 'eth_requestAccounts',
    });
    newArr.value[currentIndex.value].answer = accounts[0];
  }
};
const rerender = async () => {
  rerenderImages.value = true;
  await nextTick();
  rerenderImages.value = false;
};

const setCachedAnswer = (index) => {
  if (cacheAnswer.value) {
    newArr.value[index].answer = cacheAnswer.value;
  }
};

function onClose() {
  show.value = false;
  showSignUp.value = false;
}

const storedProviderId = ref(localStorage.providerId || '');
const storedValue = ref(localStorage.socialInfo || '');

const handleStorageEvent = (event) => {
  if (event.key === 'socialInfo') {
    storedValue.value = event.newValue || '';
  }

  if (event.key === 'providerId') {
    storedProviderId.value = event.newValue || '';
  }
};

onMounted(() => {
  localStorage.removeItem('socialInfo');
  localStorage.removeItem('providerId');

  window.addEventListener('storage', handleStorageEvent);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageEvent);
});

watchEffect(() => {
  storedProviderId.value = localStorage.providerId || '';
  storedValue.value = localStorage.socialInfo || '';
});

watchEffect(() => {
  storedProviderId.value = localStorage.providerId || '';
  storedValue.value = localStorage.socialInfo || '';
});

watch(
  () => storedValue.value,
  () => {
    if (storedValue.value) {
      newArr.value[currentIndex.value].answer = storedValue.value;
      localStorage.removeItem('socialInfo');
    }
  },
);

watch(
  () => storedProviderId.value,
  () => {
    if (storedProviderId.value) {
      localStorage.removeItem('providerId');
    }
  },
);
const isVideo = ref(false);
const isAudio = ref(false);

watch(currentIndex, async (value) => {
  await checkFileType();
  setCachedAnswer(value);
  await rerender();
});

const branchCheck = async () => {
  const questHasBranches = props.branches?.filter(
    (item) => item.quest === newArr.value[currentIndex.value]?.question,
  );

  if (
    questHasBranches &&
    questHasBranches.length > 0 &&
    !newArr.value.every((item) => item.passed)
  ) {
    for (const branch of questHasBranches) {
      const nextStep = getRuleForCurrentType(
        branch.type.trim(),
        newArr.value[currentIndex.value].answer || newArr.value[currentIndex.value].myAnswers,
        branch.choice,
      );

      if (nextStep) {
        newArr.value[currentIndex.value].passed = true;
        currentIndex.value = props.items.findIndex((item) => item.question === branch.step);
        const itsFinal = branch.finalStep;
        if (itsFinal) {
          newArr.value[currentIndex.value].finalStep = true;
        }
        return;
      }
    }
  }
  if (newArr.value[currentIndex.value].finalStep) {
    await finishQuest();
    return;
  }
  if (currentIndex.value < props.items.length - 1 && !newArr.value.every((item) => item.passed)) {
    newArr.value[currentIndex.value].passed = true;
    currentIndex.value++;
  } else {
    await finishQuest();
  }
};
const finishQuest = async () => {
  result.value = newArr.value.map((item) => {
    let answer = item.answer?.toString() || item.myAnswer?.toString() || '';
    const isOpenQuestion = item.questionType === 'open';
    let answerIsCorrect = isOpenQuestion || noCorrectAnswers(item) || !!isCorrect(item);
    if (item.myAnswers.length) {
      const correctAnswers = item.answers
        .filter(({ isCorrect }) => isCorrect)
        .map(({ answer }) => answer);

      if (item.myAnswer !== undefined && item.myAnswer.trim() !== '') {
        item.myAnswers.push(item.myAnswer);
      }

      answerIsCorrect = true;
      answer = JSON.stringify(item.myAnswers);

      if (correctAnswers.length) {
        answerIsCorrect =
          item.myAnswers.every((value) => correctAnswers.some((el) => el === value)) &&
          item.myAnswers.length === correctAnswers.length;
      }
    }

    return {
      isCorrect: answerIsCorrect,
      answer,
      file: item.answerFile.length ? item.answerFile : '',
      isOpen: isOpenQuestion || !!item.myAnswer,
    };
  });

  await submitResponse();
};
const submitResponse = async (identityValidationAttempt = 0) => {
  if (!hasUser.value) {
    isGuest.value = true;
    try {
      await checkUserIdentity();
    } catch (e) {
      if (identityValidationAttempt === 0) {
        await submitResponse(1);
      } else {
        loading.value = false;
        handleErrorModal();
        console.error(e);
      }
    }
  }

  await loadImages();
  await storeResponseAndClose();
};
const checkFileType = async () => {
  isVideo.value = await checkFileFormat(questionFiles.value[currentIndex.value], 'video');
  if (!isVideo.value) {
    isAudio.value = await checkFileFormat(questionFiles.value[currentIndex.value], 'audio');
  }
};
watch(currentIndex, async () => {
  isVideo.value = false;
  isAudio.value = false;
  await checkFileType();
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
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
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
      align-items: flex-start;
    }

    .answers {
      min-height: 234px;
      display: flex;
      width: 320px;
      flex-direction: column;
      align-items: center;
      gap: 8px;
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
  .is-active,
  .is-checked {
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
      color: $default !important;
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

.icon-soc {
  filter: invert(99%) sepia(0%) saturate(7494%) hue-rotate(201deg) brightness(153%) contrast(100%);
}

.wrapper-title {
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

.wrapper-subtitle {
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
  text-align: center;
}
</style>
