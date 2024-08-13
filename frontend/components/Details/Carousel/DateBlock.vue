<script setup>
import { onMounted, ref } from 'vue';
import { dateTimeToSeconds, transformDate } from '@/util/helpers';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';

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

const answerValue = ref(new Date());

onMounted(() => {
  if (!props.answer.answer.length) {
    answerValue.value = new Date(props.answer.answer * 1000);
  }

  answerValue.value = transformDate(answerValue.value);
});

const setDate = (event) => {
  props.answer.answer = dateTimeToSeconds(event);
};
</script>

<template>
  <div class="text-center">
    <CustomDatePicker
      class="inline-block"
      :disabled="disabled"
      :defaultDate="answerValue"
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
