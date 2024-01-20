<script setup>
import QuestHead from '@/components/Quest/QuestHead.vue';
import QuestBody from '@/components/Quest/QuestBody.vue';
import { useCounterStore } from '@/store';
import { onMounted, onUnmounted } from 'vue';
import { useResponseStore } from '@/store/response';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

onMounted(() => {
  useResponseStore().fetchResponse(props.data.shareLink);
});
const counterStore = useCounterStore();
onUnmounted(() => {
  counterStore.setValue(0);
});
</script>

<template>
  <div class="container-quest">
    <QuestHead :data="data"></QuestHead>
    <QuestBody :data="data"></QuestBody>
  </div>
</template>

<style scoped lang="scss">
.container-quest {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 48px;
}
</style>
