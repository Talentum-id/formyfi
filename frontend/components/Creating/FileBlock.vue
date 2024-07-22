<script setup>
import { ref } from 'vue';
import { ElUpload } from 'element-plus';
import 'element-plus/dist/index.css';

const file = ref([]);
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="title">Users will be asked to download a file.</div>
    <el-upload
      class="upload-demo"
      drag
      action="/"
      v-model:file-list="file"
      :limit="1"
      :auto-upload="false"
      accept=".png, .jpg, .svg, .mvk, .mp4, .mov, webm, .wmv"
    >
      <div class="el-upload__text flex justify-center items-center gap-1">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.25 15.25V8H15.75V16C15.75 16.4142 16.0858 16.75 16.5 16.75H24.5V15.25H17.25ZM14.5 16.75H8.5V15.25H14.5V16.75ZM17.25 18V24H15.75V18H17.25Z"
            fill="#A5ACBB"
          />
        </svg>
        Click to choose a file or drag here
      </div>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $secondary;
}
.el-upload__text {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: #a5acbb;
}
</style>
