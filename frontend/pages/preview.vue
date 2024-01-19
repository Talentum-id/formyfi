<script setup>
import { computed, onMounted } from 'vue';
import Quest from '@/components/Quest/Quest.vue';
import BaseButton from '@/components/BaseButton.vue';
const data = computed(() => JSON.parse(localStorage.previewData));

const closeTab = () => {
  window.close();
};
onMounted(() => {
  if (!data.value) {
    closeTab();
  }
});
</script>

<template>
  <div class="preview-container" v-if="data">
    <div class="header">
      <img src="@/assets/images/logo-dark.svg" alt="logo" width="108" height="28" />
      <base-button text="Back to Creating" @click="closeTab()" type="return"></base-button>
    </div>
    <div class="content"><quest :data="data"></quest></div>
  </div>
</template>

<style scoped lang="scss">
.preview-container {
  display: flex;
  flex-direction: column;
  background-color: $default-bg;

  .header {
    display: flex;
    height: 72px;
    padding: 16px 32px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    background: #344054;
  }
  .content {
    padding: 48px 40px 120px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }
}
</style>
