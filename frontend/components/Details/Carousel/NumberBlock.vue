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

const failedMessage = ref('');
const regexFailed = ref(false);

const options = computed(() => {
  return [
    { name: 'Decimal (ex: 2.34)', id: 0, type: 'decimal' },
    { name: 'Integer (ex: 2)', id: 1, type: 'integer' },
    { name: 'Percentage (ex: 2%)', id: 2, type: 'percentage' },
  ].filter(({ id }) => id === props.answer.parameters.option);
});

const setValue = () => {
  const {minEnabled, maxEnabled, min, max} = props.answer.parameters;

  if (props.answer.answer.trim() !== '' && isNaN(props.answer.answer)) {
    regexFailed.value = true;
    failedMessage.value = 'Number is invalid';
    props.answer.answer = '';
  } else if (props.answer.answer.trim() !== '') {
    const ltMin = minEnabled && min > props.answer.answer;
    const gtMax = maxEnabled && max < props.answer.answer;

    if (ltMin) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be greater than min';

      props.answer.answer = '';
    } else if (gtMax) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be less than max';

      props.answer.answer = '';
    } else {
      regexFailed.value = false;
    }
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Input
      withoutName
      class="w-[136px] inline-block"
      placeholder="Number"
      @focusout="setValue"
      :disabled="disabled"
      v-model="answer.answer"
    />
    <span v-if="regexFailed" class="invalid-feedback">{{ failedMessage }}</span>
    <hr />
    <div class="title">Question Settings</div>
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
