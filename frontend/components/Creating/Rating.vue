<script setup>
import RadioGroup from '@/components/Creating/RadioGroup.vue';
import Input from '@/components/Input.vue';
import { computed, ref } from 'vue';

const points = ref(10);
const emit = defineEmits(['getRate']);
const hasError = computed(() => (hasError.value = +points.value > 10 || +points.value < 2));
const setRate = (rate) => {
  emit('getRate', rate);
};
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="title">Users will be asked to rate in the filed listed below.</div>
    <RadioGroup
      @select="setRate($event)"
      :size="+points > 10 || +points < 2 ? 10 : +points"
    ></RadioGroup>
    <hr />
    <div class="title">Number of points in the rating, min 2 - max 10</div>
    <Input
      isNumber
      class="w-[136px]"
      withoutName
      placeholder="Points"
      v-model="points"
      :max="10"
      :min="2"
      :is-error="hasError"
      error-text="Incorrect number"
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
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $secondary;
}
</style>
