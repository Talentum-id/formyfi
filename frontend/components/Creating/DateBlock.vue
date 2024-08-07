<script setup>
import { onMounted, ref } from 'vue';
import { transformDate } from '@/util/helpers';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';

const props = defineProps({
  question: {
    required: true,
    type: Object,
  },
});

const date = ref('');
const todayDate = new Date();

onMounted(() => {
  date.value = transformDate(todayDate);

  props.question.parameters = {};

  props.question.answers = [{
    answer: date.value,
    isCorrect: !!date.value,
  }];
});

const setDate = (event) => {
  date.value = event;

  props.question.answers = [{
    answer: date.value,
    isCorrect: !!date.value,
  }];
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="title">Users will be asked to enter the date in the filed listed below.</div>
    <CustomDatePicker
      :defaultDate="transformDate(todayDate)"
      @selectedDate="setDate"
    />
  </div>
</template>

<style scoped lang="scss">
.title {
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
</style>
