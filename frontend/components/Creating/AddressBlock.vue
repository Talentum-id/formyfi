<script setup>
import Input from '@/components/Input.vue';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  question: {
    required: true,
    type: Object,
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
  props.question.parameters = data.value;

  props.question.answers = [];
});

watch(data, value => {
  props.question.parameters = value;
}, {
  deep: true,
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="title">Users will be asked to fullfill the filed listed below.</div>
    <Input withoutName placeholder="Address" v-model="data.address" />
    <Input withoutName placeholder="Address Line 2" v-model="data.address2" />
    <Input withoutName placeholder="Country" v-model="data.country" />
    <Input withoutName placeholder="City" v-model="data.city" />
    <div class="flex items-start gap-4">
      <Input
        withoutName
        placeholder="State / Province / Region / Prefecture"
        v-model="data.region"
        class="w-2/3"
      />
      <Input withoutName placeholder="Postal Code" v-model="data.post" class="w-1/3" />
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
