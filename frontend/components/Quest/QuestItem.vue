<template>
  <div
    class="item"
    :class="{ active: isActive, completed: isCompleted }"
    @click="showAnswer(isActive && !isCompleted)"
  >
    <div class="name">{{ data.question }}</div>
    <img v-if="isActive && !isCompleted" src="@/assets/icons/play.svg" alt="" />
    <img v-if="!isActive && !isCompleted" src="@/assets/icons/lock.svg" alt="" />
    <img v-if="!isActive && isCompleted" src="@/assets/icons/completed.svg" alt="" />
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view']);
const showAnswer = (canShow) => {
  if (canShow) {
    emit('view', props.data);
  }
};
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  align-self: stretch;
  border-radius: 8px;
  opacity: 0.4;
  background: #f5f7fa;
  .name {
    overflow: hidden;
    color: #344054;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: $default_font;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
}
.active {
  border-radius: 8px;
  background: $blue;
  opacity: 1;
  cursor: pointer;
  .name {
    color: $white;
  }
}
.completed {
  border-radius: 8px;
  background: #e9ecf2;
  opacity: 1;
  cursor: pointer;
  .name {
    color: #344054;
  }
}
</style>
