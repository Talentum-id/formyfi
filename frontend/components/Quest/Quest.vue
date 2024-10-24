<script setup>
import QuestHead from '@/components/Quest/QuestHead.vue';
import QuestBody from '@/components/Quest/QuestBody.vue';
import { useCounterStore } from '@/store';
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const counterStore = useCounterStore();
onUnmounted(() => {
  counterStore.setValue(0);
});
onMounted(() => {
  if (!props.data) {
    useRouter().push('/');
  } else {
    // remove deprecated social info for social connect and verification successful handling
    localStorage.removeItem('socialInfo');
    localStorage.removeItem('providerId');
  }
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
