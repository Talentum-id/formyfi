<script setup>
import Input from '@/components/Input.vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
  question: {
    required: true,
    type: Object,
  },
});

onMounted(() => {
  props.question.parameters = {};

  props.question.answers = [{
    answer: '',
    isCorrect: false,
  }];
});

const link = ref('');
const regexFailed = ref(false);

const setValue = () => {
  const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;

  if (linkRegex.test(link.value)) {
    regexFailed.value = false;
  } else {
    regexFailed.value = true;
    link.value = '';
  }

  props.question.answers = [{
    answer: link.value,
    isCorrect: !!link.value.length,
  }];
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="title">Users will be asked to enter the link in the filed listed below.</div>
    <Input
      withoutName
      placeholder="https://formyfi.io"
      @focusout="setValue"
      v-model="link"
    />
    <span v-if="regexFailed" class="invalid-feedback">Link is invalid</span>
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
