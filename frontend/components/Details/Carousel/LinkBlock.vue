<script setup>
import Input from '@/components/Input.vue';
import { ref } from 'vue';
import RadioGroup from '@/components/Creating/RadioGroup.vue';

const props = defineProps({
  answer: {
    required: true,
    type: Object,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const answerValue = ref(props.answer.answer);
const regexFailed = ref(false);

const setValue = focussedOut => {
  const linkRegex = /(<a[^>]*>.*?<\/a>|https?:\/\/[^\s<]+)/g;

  if (answerValue.value.trim() === '' || linkRegex.test(answerValue.value)) {
    regexFailed.value = false;

    props.answer.answer = answerValue.value
  } else {
    regexFailed.value = true;
    props.answer.answer = '';

    if (focussedOut) {
      answerValue.value = '';
    }
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <Input
      withoutName
      placeholder="https://formyfi.io"
      @input="setValue(false)"
      @focusout="setValue(true)"
      :disabled="disabled"
      v-model="answerValue"
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
