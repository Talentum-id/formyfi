<template>
  <div class="action-button flex h-10">
    <div class="flex py-2 px-4 w-4/5 gap-2 items-center">
      <Icon :name="socialIcon" class="icon-soc" :size="24" />
      <div>Join Wild forest server</div>
    </div>
    <div class="w-[1px] bg-white h-10"></div>
    <div class="py-2 px-4 w-full text-center cursor-pointer" @click="verify">Verify</div>
  </div>
</template>
<script setup>
import Icon from '@/components/Icons/Icon.vue';

const props = defineProps({
  actionType: {
    type: String,
    default: 'test',
  },
  socialIcon: {
    type: String,
    default: 'twitter',
  },
});

const verify = () => {};
</script>
<style scoped lang="scss">
.action-button {
  font-family: $default_font;
  width: 100%;
  border-radius: 8px;
  background: $default-border;
  color: $default;
}
.icon-soc {
  filter: invert(99%) sepia(0%) saturate(7494%) hue-rotate(201deg) brightness(0%) contrast(100%);
}
</style>
