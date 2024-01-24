<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import Quest from '@/components/Quest/Quest.vue';
import Default from '@/layouts/default.vue';
import { useAuthStore } from '@/store/auth';
import { useQAStore } from '@/store/qa';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import Icon from '@/components/Icons/Icon.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  useQAStore().fetchQA(route.params.id);
});

const data = computed(() => useQAStore().getQA);
const loaded = computed(() => useQAStore().getLoadingStatus);
const identity = computed(() => authStore.principal.toText());

onUnmounted(() => {
  useQAStore().qa = null;
});
async function deleteQuest() {
  await useQAStore().removeQuest(route.params.id);
  await router.push('/');
}
</script>

<template>
  <Default>
    <div class="header">
      <div class="back" @click="$router.push('/')">
        <div class="btn"><Icon name="Left-Arrow" :size="24"></Icon></div>
        Back to Q&A List
      </div>
      <div v-if="data && identity === data.owner" class="btn" @click="deleteQuest">
        <Icon name="Delete-def" :size="24"></Icon>
      </div>
    </div>
    <Quest :data="data" v-if="loaded && data"></Quest
  ></Default>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1160px;
  margin: 0 auto 48px;
  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #667085;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: $default_font;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
  }
  .btn {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: 1px solid $default-border;
    background: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
  }
}
</style>
