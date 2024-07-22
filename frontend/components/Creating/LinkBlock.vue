<script setup>
import Input from '@/components/Input.vue';
import { ref } from 'vue';

const link = ref('');
const emit = defineEmits(['getLink']);
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="title">Users will be asked to enter the link in the filed listed below.</div>
    <Input withoutName placeholder="https://www.figma.com" v-model="link" />
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
