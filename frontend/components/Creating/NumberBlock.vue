<script setup>
import Input from '@/components/Input.vue';
import { ref, watch } from 'vue';
import Select from '@/components/Select.vue';
import Switch from '@/components/Creating/Switch.vue';

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
const emit = defineEmits(['getNumber']);
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="title">Users will be asked to enter the number in the filed listed below.</div>
    <Input withoutName class="w-[136px]" placeholder="Number" is-number v-model="number" />
    <hr />
    <div class="title">Question Settings</div>
    <Select :options="options" :stringLength="66" :stringLengthSelected="66"></Select>
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
</style>
