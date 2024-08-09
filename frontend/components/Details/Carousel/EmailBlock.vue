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

const regexFailed = ref(false);

const setValue = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (props.answer.answer.trim() !== '' && !emailRegex.test(props.answer.answer)) {
    props.answer.answer = '';
    regexFailed.value = true;
  } else {
    regexFailed.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <Input
      withoutName
      placeholder="formyfi@gmail.com"
      v-model="answer.answer"
      :disabled="disabled"
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
