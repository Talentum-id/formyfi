<script setup>
import { ref } from 'vue';
import { transformDate } from '@/util/helpers';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';

const date = ref('');
const todayDate = new Date();

const setDate = (event) => {
  date.value = event;
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="title">Users will be asked to enter the date in the filed listed below.</div>
    <CustomDatePicker :defaultDate="transformDate(todayDate)" @selectedDate="setDate" />
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
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $secondary;
}
</style>
