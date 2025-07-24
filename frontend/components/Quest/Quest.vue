<script setup>
import QuestHead from '@/components/Quest/QuestHead.vue';
import QuestBody from '@/components/Quest/QuestBody.vue';
import { useCounterStore } from '@/store';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { modal } from '@/mixins/modal';
import router from '@/router';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const auth = useAuthStore();

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

    if (auth.getPrincipal !== props.data.owner) {
      const { start, end } = props.data;
      const currentDate = new Date();
      const startDate = new Date(start * 1000);
      const endDate = new Date(end * 1000);
      const startTimeDifference = startDate.getTime() - currentDate.getTime();
      const endTimeDifference = endDate.getTime() - currentDate.getTime();

      if (Math.ceil(startTimeDifference / (1000 * 60 * 60 * 24)) > 0) {
        modal.emit('openModal', {
          title: 'This form has not been started yet',
          message: 'The form you are trying to access is not available yet',
          type: 'warning',
          actionText: 'Go to Homepage',
          fn: () => router.push('/'),
        });

        setTimeout(() => {
          modal.emit('closeModal');
          router.push('/');
        }, 5000);
      }

      if (Math.ceil(endTimeDifference / (1000 * 60 * 60 * 24)) < 0) {
        modal.emit('openModal', {
          title: 'This form has expired',
          message: 'The form you are trying to access is no longer available',
          type: 'warning',
          actionText: 'Go to Homepage',
          fn: () => router.push('/'),
        });

        setTimeout(() => {
          modal.emit('closeModal');
          router.push('/');
        }, 5000);
      }
    }
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
