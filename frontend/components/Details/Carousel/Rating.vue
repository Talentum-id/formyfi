<script setup>
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

const setRate = rate => {
  props.answer.answer = rate;
};
</script>

<template>
  <div class="flex">
    <RadioGroup
      class="justify-center"
      @select="setRate"
      :size="+answer.parameters.max > 10 || +answer.parameters.max < 2 ? 10 : +answer.parameters.max"
      v-model="answer.answer"
      :disabled="disabled"
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
