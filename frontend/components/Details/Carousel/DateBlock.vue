<script setup>
import { onMounted } from 'vue';
import { transformDate } from '@/util/helpers';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';
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

const todayDate = new Date();

onMounted(() => {
  if (!props.answer.answer.length) {
    props.answer.answer = transformDate(todayDate);
  } else {
    props.answer.answer = transformDate(new Date(props.answer.answer));
  }
});

const setDate = (event) => {
  props.answer.answer = event;
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <CustomDatePicker
      :disabled="disabled"
      :defaultDate="answer.answer"
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
