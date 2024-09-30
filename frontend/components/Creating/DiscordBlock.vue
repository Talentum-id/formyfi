<template>
  <hr />
  <form class="flex flex-col gap-3" ref="target">
    <span> Question Settings </span>
    <div class="check-btn_wrapper">
      <div class="check-btn_title">Check for Discord server membership</div>
      <Switch :checkedProp="required" @checked="required = $event" />
    </div>
    <div v-if="required" class="flex flex-col gap-6">
      <Input
        name=""
        placeholder="Invite Link"
        v-model="discord.link"
        :isError="!discord.link && !focused"
        errorText="Invite Link is Required"
      />
      <Input
        name=""
        placeholder="Discord server name"
        v-model="discord.server"
        :isError="!discord.server && !focused"
        errorText="Discord server name is Required"
      />
    </div>
  </form>
</template>
<script setup>
import Switch from '@/components/Creating/Switch.vue';
import { ref, watch } from 'vue';
import { useFocusWithin } from '@vueuse/core';

import Input from '@/components/Input.vue';

const target = ref();
const emit = defineEmits(['input']);
const { focused } = useFocusWithin(target);
const required = ref(false);
const discord = ref({
  server: '',
  link: '',
});

watch(
  () => required,
  () => {
    if (!required.value) {
      discord.value = {
        server: '',
        link: '',
      };
    }
  },
);

watch(focused, (focused) => {
  if (!focused) {
    emit('input', discord.value);
  }
});
</script>
<style scoped lang="scss">
.check-btn_wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  .check-btn_title {
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

  .type-label {
    background-color: #eaeafb;
    border-radius: 6px;
    padding: 3px 8px;

    & > span {
      font-family: $default_font;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 133.333%;
      cursor: default;
      color: #6a6d8f;
    }
  }
}
</style>
