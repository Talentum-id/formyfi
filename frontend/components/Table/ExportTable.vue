<script setup>
import downloadExcel from 'vue-json-excel3';
import downloadIcon from '@/assets/icons/Download.svg';
import { ref } from 'vue';
defineProps({
  data: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    default: 'default',
  },
});
const loading = ref(false);
function startDownload() {
  loading.value = true;
}
function finishDownload() {
  loading.value = false;
}
</script>

<template>
  <downloadExcel
    class="export-btn"
    :data="data"
    :name="name + '.xls'"
    :before-generate="startDownload"
    :before-finish="finishDownload"
  >
    <span>Export </span>
    <img v-if="!loading" :src="downloadIcon" alt="" />
    <span v-else class="loader"></span>
  </downloadExcel>
</template>

<style scoped lang="scss">
.export-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  height: fit-content;
  border: none;
  width: fit-content;
  background: transparent;

  span {
    color: $default;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  &:hover {
    border-radius: 8px;
    background: $default-badge-border;
  }
  .loader {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite;
  }

  .loader::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 2px solid $default;
    animation: prixClipFix 2s linear infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
