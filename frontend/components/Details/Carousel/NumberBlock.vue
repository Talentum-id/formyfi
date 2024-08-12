<script setup>
import Input from '@/components/Input.vue';
import { computed, ref } from 'vue';
import Select from '@/components/Select.vue';
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
const failedMessage = ref('');
const regexFailed = ref(false);

const options = computed(() => {
  return [
    { name: 'Decimal (ex: 2.34)', id: 0, type: 'decimal' },
    { name: 'Integer (ex: 2)', id: 1, type: 'integer' },
    { name: 'Percentage (ex: 2%)', id: 2, type: 'percentage' },
  ].filter(({ id }) => id === props.answer.parameters.option);
});

const setValue = focussedOut => {
  let error = false;
  const { minEnabled, maxEnabled, min, max } = props.answer.parameters;

  if (props.answer.answer.trim() !== '' && isNaN(answerValue.value)) {
    regexFailed.value = true;
    failedMessage.value = 'Number is invalid';

    error = true;
  } else if (answerValue.value.trim() !== '') {
    const ltMin = minEnabled && parseInt(min) > parseInt(answerValue.value);
    const gtMax = maxEnabled && parseInt(max) < parseInt(answerValue.value);

    if (ltMin) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be greater than min';

      error = true;
    } else if (gtMax) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be less than max';

      error = true;
    } else {
      regexFailed.value = false;

      error = false;
    }
  }

  if (error) {
    props.answer.answer = '';

    if (focussedOut) {
      answerValue.value = '';
    }
  } else {
    props.answer.answer = answerValue.value;
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Input
      withoutName
      class="w-[136px] inline-block"
      placeholder="Number"
      @focusout="setValue(true)"
      @input="setValue(false)"
      :disabled="disabled"
      v-model="answerValue"
    />
    <span v-if="regexFailed" class="invalid-feedback">{{ failedMessage }}</span>
    <hr />
    <Select
      :options="options"
      readonly
      :stringLength="66"
      :stringLengthSelected="66"
      disabled
    />
    <div v-if="answer.parameters.minEnabled" class="flex items-center gap-x-4">
      <div class="flex items-center gap-2 mt-2">
        <div class="wrapper-title">Min</div>
      </div>

      <Input withoutName class="w-[136px]" is-number placeholder="Value" v-model="answer.parameters.min" disabled />
    </div>

    <div v-if="answer.parameters.maxEnabled" class="flex items-center gap-x-4">
      <div class="flex items-center gap-2 mt-2">
        <div class="wrapper-title">Max</div>
      </div>
      <Input is-number withoutName class="w-[136px]" placeholder="Value" v-model="answer.parameters.max" disabled />
    </div>
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

.wrapper-title {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  font-feature-settings: 'zero' on;
  color: $default;
}

.invalid-feedback {
  color: $red;
}
</style>
