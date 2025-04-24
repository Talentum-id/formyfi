<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import Quest from '@/components/Quest/Quest.vue';
import BaseButton from '@/components/BaseButton.vue';
import localforage from 'localforage';
const data = ref(null);

localforage.getItem('previewData', function (err, value) {
  data.value = JSON.parse(value);
});
const closeTab = () => {
  window.close();
};
</script>

<template>
  <div class="preview-container" v-if="data">
    <div class="header">
      <img src="@/assets/images/logo-dark.svg" alt="logo" width="108" height="28" />
      <BaseButton text="Back to Creating" @click="closeTab()" type="return"></BaseButton>
    </div>
    <div class="content" :style="{ backgroundColor: data?.backgroundColor }"><Quest :data="data"></Quest></div>
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
