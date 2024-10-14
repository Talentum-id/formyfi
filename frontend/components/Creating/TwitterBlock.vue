<template>
  <hr />
  <form class="flex flex-col gap-3" ref="target">
    <span> Question Gates </span>
    <div class="check-btn_wrapper">
      <div class="check-btn_title">Encourage follow</div>
      <Switch :checkedProp="requiredFollow" @checked="requiredFollow = $event" />
    </div>
    <div v-if="requiredFollow" class="flex flex-col gap-6">
      <Input
        name=""
        placeholder="Username "
        v-model="twitter.follow"
        :isError="!twitter.follow"
        errorText="Username is Required"
      />
    </div>
    <div class="check-btn_wrapper">
      <div class="check-btn_title">Encourage reply</div>
      <Switch :checkedProp="requiredReply" @checked="requiredReply = $event" />
    </div>
    <div v-if="requiredReply" class="flex flex-col gap-6">
      <Input
        name=""
        placeholder="Tweet URLs"
        v-model="twitter.reply"
        :isError="!twitter.reply"
        errorText="Tweet URLs is not valid"
      />
    </div>
    <div class="check-btn_wrapper">
      <div class="check-btn_title">Encourage retweet</div>
      <Switch :checkedProp="requiredRetweet" @checked="requiredRetweet = $event" />
    </div>
    <div v-if="requiredRetweet" class="flex flex-col gap-6">
      <Input
        name=""
        placeholder="Tweet URLs"
        v-model="twitter.retweet"
        :isError="!twitter.retweet"
        errorText="Tweet URLs is not valid"
      />
    </div>
  </form>
</template>
<script setup>
import Switch from '@/components/Creating/Switch.vue';
import { ref, watch } from 'vue';
import Input from '@/components/Input.vue';
import { useFocusWithin } from '@vueuse/core';

const requiredReply = ref(false);
const requiredFollow = ref(false);
const requiredRetweet = ref(false);
const twitter = ref({
  follow: '',
  reply: '',
  retweet: '',
});
const target = ref();
const emit = defineEmits(['input']);
const { focused } = useFocusWithin(target);
watch(
  () => [requiredReply, requiredFollow, requiredRetweet],
  ([requiredReply, requiredFollow, requiredRetweet]) => {
    if (!requiredReply.value) {
      twitter.value.reply = '';
    }
    if (!requiredFollow.value) {
      twitter.value.follow = '';
    }
    if (!requiredRetweet.value) {
      twitter.value.retweet = '';
    }
  },
);

watch(focused, (focused) => {
  if (!focused) {
    emit('input', twitter.value);

    const twitterUrlRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)(\/.*)?$/i;

    if (!twitterUrlRegex.test(twitter.value.reply)) {
      twitter.value.reply = '';
    }

    if (!twitterUrlRegex.test(twitter.value.retweet)) {
      twitter.value.retweet = '';
    }
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
