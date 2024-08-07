<script setup>
import Input from '@/components/Input.vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
  question: {
    required: true,
    type: Object,
  },
});

const email = ref('');
const regexFailed = ref(false);

onMounted(() => {
  props.question.parameters = {};

  props.question.answers = [{
    answer: '',
    isCorrect: false,
  }];
});

const setValue = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    email.value = '';
    regexFailed.value = true;
  } else {
    regexFailed.value = false;
  }

  props.question.answers = [{
    answer: email.value,
    isCorrect: !!email.value.length,
  }];
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="title">Users will be asked to enter the Email in the filed listed below.</div>
    <Input
      withoutName
      placeholder="formyfi@gmail.com"
      v-model="email"
      @focusout="setValue"
    />
    <span v-if="regexFailed" class="invalid-feedback">Email is invalid</span>
  </div>
</template>

<style scoped lang="scss">
.title, .invalid-feedback {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on,
  'lnum' on,
  'zero' on;
  color: $secondary;
}

.invalid-feedback {
  color: $red;
}
</style>
