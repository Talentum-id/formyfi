<script setup>
import Input from '@/components/Input.vue';
import { onMounted, ref, watch } from 'vue';

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

const data = ref({
  address: '',
  address2: '',
  country: '',
  city: '',
  region: '',
  post: '',
});

onMounted(() => {
  if (!!props.answer.answer.length) {
    data.value = JSON.parse(props.answer.answer);
  }
});

watch(data, value => {
  props.answer.answer = JSON.stringify(value);
}, {
  deep: true,
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Input
      withoutName
      placeholder="Address"
      v-model="data.address"
      :disabled="disabled"
    />
    <Input
      withoutName
      placeholder="Address Line 2"
      v-model="data.address2"
      :disabled="disabled"
    />
    <Input
      withoutName
      placeholder="Country"
      v-model="data.country"
      :disabled="disabled"
    />
    <Input
      withoutName
      placeholder="City"
      v-model="data.city"
      :disabled="disabled"
    />
    <div class="flex items-start gap-4">
      <Input
        withoutName
        placeholder="State / Province / Region / Prefecture"
        v-model="data.region"
        class="w-2/3"
        :disabled="disabled"
      />
      <Input
        withoutName
        placeholder="Postal Code"
        :disabled="disabled"
        v-model="data.post"
        class="w-1/3"
      />
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
  font-feature-settings: 'tnum' on,
  'lnum' on,
  'zero' on;
  color: $secondary;
}
</style>
