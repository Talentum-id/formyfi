<script setup>
import Input from '@/components/Input.vue';
import { onMounted, ref, watch } from 'vue';
import Select from '@/components/Select.vue';
import Switch from '@/components/Creating/Switch.vue';

const props = defineProps({
  question: {
    required: true,
    type: Object,
  },
});

const failedMessage = ref('');
const regexFailed = ref(false);
const number = ref('');
const min = ref('');
const minEnabled = ref(false);
const max = ref('');
const maxEnabled = ref(false);
const options = [
  { name: 'Decimal (ex: 2.34)', id: 0, type: 'decimal' },
  { name: 'Integer (ex: 2)', id: 1, type: 'integer' },
  { name: 'Percentage (ex: 2%)', id: 2, type: 'percentage' },
];

onMounted(() => {
  props.question.parameters = {
    minEnabled: minEnabled.value,
    maxEnabled: maxEnabled.value,
    min: min.value,
    max: max.value,
    option: 0,
  };

  props.question.answers = [{
    answer: '',
    isCorrect: false,
  }];
});

const setOption = ({ id }) => {
  props.question.parameters.option = id;
};

const setValue = () => {
  if (number.value.trim() !== '' && isNaN(number.value)) {
    regexFailed.value = true;
    failedMessage.value = 'Number is invalid';
    number.value = '';
  } else if (number.value.trim() !== '') {
    const ltMin = minEnabled.value && parseInt(min.value) > parseInt(number.value);
    const gtMax = maxEnabled.value && parseInt(max.value) < parseInt(number.value);

    if (ltMin) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be greater than min';

      number.value = '';
    } else if (gtMax) {
      regexFailed.value = true;
      failedMessage.value = 'Number should be less than max';

      number.value = '';
    } else {
      regexFailed.value = false;
    }
  }

  props.question.answers = [{
    answer: number.value,
    isCorrect: !!number.value.length,
  }];
};

watch(minEnabled, value => {
  props.question.parameters.minEnabled = value;

  const ltMin = minEnabled.value && parseInt(min.value) > parseInt(number.value);

  if (ltMin) {
    regexFailed.value = true;
    failedMessage.value = 'Number should be greater than min';

    number.value = '';
  } else {
    regexFailed.value = false;
  }
});
watch(maxEnabled, value => {
  props.question.parameters.maxEnabled = value;

  const gtMax = maxEnabled.value && parseInt(max.value) < parseInt(number.value);

  if (gtMax) {
    regexFailed.value = true;
    failedMessage.value = 'Number should be less than max';

    number.value = '';
  } else {
    regexFailed.value = false;
  }
});
watch(min, value => {
  props.question.parameters.min = value;

  const ltMin = minEnabled.value && parseInt(min.value) > parseInt(number.value);

  if (ltMin) {
    regexFailed.value = true;
    failedMessage.value = 'Number should be greater than min';

    number.value = '';
  } else {
    regexFailed.value = false;
  }
});
watch(max, value => {
  props.question.parameters.max = value;

  const gtMax = maxEnabled.value && parseInt(max.value) < parseInt(number.value);

  if (gtMax) {
    regexFailed.value = true;
    failedMessage.value = 'Number should be less than max';

    number.value = '';
  } else {
    regexFailed.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="title">Users will be asked to enter the number in the filed listed below.</div>
    <Input
      withoutName
      class="w-[136px]"
      placeholder="Number"
      @focusout="setValue"
      v-model="number"
    />
    <span v-if="regexFailed" class="invalid-feedback">{{ failedMessage }}</span>
    <hr />
    <div class="title">Question Settings</div>
    <Select :options="options" @input="setOption" :stringLength="66" :stringLengthSelected="66" />
    <div class="flex items-center gap-x-4">
      <div class="flex items-center gap-2 mt-2">
        <div class="wrapper-title">Min</div>
        <Switch :checkedProp="minEnabled" @checked="minEnabled = $event" />
      </div>

      <Input withoutName class="w-[136px]" is-number placeholder="Value" v-model="min" />
    </div>
    <div class="flex items-center gap-x-4">
      <div class="flex items-center gap-2 mt-2">
        <div class="wrapper-title">Max</div>
        <Switch :checkedProp="maxEnabled" @checked="maxEnabled = $event" />
      </div>
      <Input is-number withoutName class="w-[136px]" placeholder="Value" v-model="max" />
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
