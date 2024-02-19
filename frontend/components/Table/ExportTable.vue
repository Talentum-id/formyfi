<script setup>
import { ref, watch } from 'vue';
import { utils, writeFileXLSX } from 'xlsx';
import downloadIcon from '@/assets/icons/Download.svg';

const props = defineProps({
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
async function check(data) {
  await startDownload();
  console.log(data);
  const ws = await utils.json_to_sheet(data);
  const wb = await utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  ws['!cols'] = formatExcelCols(data);
  await writeFileXLSX(wb, `${props.name}.xlsx`);
  await finishDownload();
}
function formatExcelCols(json) {
  let widthArr = Object.keys(json[0]).map((key) => {
    return { width: key.length + 2 }; // plus 2 to account for short object keys
  });
  for (let i = 0; i < json.length; i++) {
    let value = Object.values(json[i]);
    for (let j = 0; j < value.length; j++) {
      if (value[j] !== null && value[j].length > widthArr[j].width) {
        widthArr[j].width = value[j].length;
      }
    }
  }
  return widthArr;
}
watch(
  () => props.data,
  (data) => {
    if (data.length) {
      console.log(props.data);
      check(data);
    }
  },
);
</script>

<template>
  <div class="export-btn">
    <span>Export </span>
    <img v-if="!loading" :src="downloadIcon" alt="" />
    <span v-else class="loader"></span>
  </div>
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
