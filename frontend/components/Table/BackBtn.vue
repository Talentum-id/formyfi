<template>
  <div class="back-btn">
    <Icon v-if="showBackArrow" @click="router.push(to)" name="Left-Arrow" :size="24" />
    <Talent square @click="router.push(to)" :text="text" :img="img" :reduceLength="15" big />
    <div class="edit-btn">
      <Icon v-if="isEdit" name="Edit" :size="24" @click="emit('action')" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Icon from '@/components/Icons/Icon.vue';
import Talent from '@/components/Talent.vue';

const router = useRouter();

const emit = defineEmits(['action']);

const props = defineProps({
  text: { type: String, default: '' },
  img: { type: String, default: '' },
  to: {
    type: String,
    default: '/',
  },
  isEdit: { type: Boolean, default: false },
  isRounded: { type: Boolean, default: false },
  showBackArrow: { type: Boolean, default: true },
});
</script>

<style lang="scss" scoped>
.back-btn {
  width: fit-content;
  padding: 4px 12px 4px 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid $default-border;
  border-radius: 8px;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: $default-badge-border;
  }
}

.edit-btn {
  padding: 4px;

  &:hover {
    border-radius: 8px;
    background: $default-border;
  }
}
</style>
