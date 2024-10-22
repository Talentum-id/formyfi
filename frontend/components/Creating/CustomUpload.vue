<template>
  <ElUpload
    action="/"
    v-model:file-list="fileList"
    list-type="picture"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :limit="1"
    :auto-upload="false"
    :accept="fileExtensions[image]"
    :class="{
      'hide-upload': fileList.length >= 1,
    }"
  >
    <template #default v-if="files.length < 1">
      <div class="flex items-center gap-2">
        <el-button class="add flex items-center gap-2">
          Add File <img src="@/assets/icons/add.svg" alt="" />
        </el-button>
        <TooltipIcon
          :tooltipText="`Allowed formats: ${fileExtensions[image]}. File size 5 mb max.`"
        />
      </div>
    </template>
    <template #file="{ file }">
      <div :class="{ 'file-with-error': file.isError }" class="uploader-wrapper" :title="file.name">
        <img
          v-if="!checkIfFilePdf(file)"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        />

        <div v-else class="uploaded-pdf-file-gray">
          <div class="name">
            {{ extractName(file.name) }}
          </div>
          <div class="type">PDF</div>
        </div>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <div class="icon-wrapper">
              <img src="@/assets/icons/upload/view.svg" alt="" />
            </div>
          </span>
          <span class="el-upload-list__item-preview" @click="handleRemove(file)">
            <div class="icon-wrapper">
              <img src="@/assets/icons/upload/remove.svg" alt="" />
            </div>
          </span>
        </span>
      </div>
    </template>
  </ElUpload>
  <span :class="{ 'd-block': isShowFileError.isError }" class="invalid-image">
    {{ isShowFileError.message }}
  </span>
  <ElDialog append-to-body v-model="dialogVisible">
    <img :src="dialogImageUrl" alt="Preview Image" />
  </ElDialog>
</template>

<script setup>
import { ref, reactive, toRef, watch, computed } from 'vue';
import 'element-plus/dist/index.css';
import { ElDialog, ElUpload } from 'element-plus';
import TooltipIcon from '@/components/Creating/TooltipIcon.vue';
import {
  image,
  fileExtensions
} from '@/constants/fileCategories';

const props = defineProps({
  files: {
    type: Array,
    default: null,
  },
});
const fileList = ref(props.files);

const emit = defineEmits(['images', 'changeError', 'remove']);
const filesPropRef = toRef(props, 'files');

watch(filesPropRef, (value) => {
  if (value && value.length) {
    fileList.value = value;
  }
});

watch(
  () => fileList.value,
  (value) => {
    const isValid = checkImageSize();
    if (isValid) {
      emit('images', value);
    }
  },
);

const isShowFileError = reactive({
  isError: false,
  message: 'error',
});

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const checkImageSize = () => {
  const maxSizeInMB = 5;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!fileList.value.length) {
    isShowFileError.isError = false;
    isShowFileError.message = '';
  } else {
    for (const file of fileList.value) {
      if (file && (file.size || file.raw)) {
        if (file.raw.size > maxSizeInBytes || file.size > maxSizeInBytes) {
          isShowFileError.isError = true;
          isShowFileError.message = `The file size can't be more than ${maxSizeInMB} MB`;
          handleRemove(file);
          emit('changeError', isShowFileError.isError);

          return false;
        } else {
          isShowFileError.isError = false;
          isShowFileError.message = '';

          return true;
        }
      }
    }
  }
  emit('changeError', isShowFileError.isError);
};

const handleClose = (value) => {
  dialogVisible.value = value;
};
const nameRegex = /^([^\n\r]+)\./;

function extractName(filename) {
  const match = filename.match(nameRegex);
  if (match) {
    return match[1];
  }
  return null;
}

const checkIfFilePdf = (file) => {
  // return file.raw.type.indexOf('pdf') !== -1;
  return file.name.indexOf('pdf') !== -1;
};

const handleRemove = (uploadFile, uploadFiles) => {
  const index = fileList.value.indexOf(uploadFile);
  fileList.value.splice(index, 1);
  // const isValid = checkImageSize();
  emit('remove', uploadFile);
  // if (isValid) {
  //   emit('images', fileList.value);
  // }
};

const handlePictureCardPreview = async (uploadFile) => {
  if (checkIfFilePdf(uploadFile)) {
    window.open(uploadFile.url, '_blank');
    return;
  }
  // const image = await fetch(uploadFile.url);
  // const imageBlog = await image.blob();
  // const imageURL = URL.createObjectURL(imageBlog);
  dialogImageUrl.value = uploadFile.url;
  // dialogImageUrl.value = imageURL;
  dialogVisible.value = true;
};
</script>

<style lang="scss">
.el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-upload-list--picture-card .el-upload-list__item {
  display: flex;
  align-items: center;
}

.hide-upload {
  margin-top: -35px;

  .el-upload--picture-card {
    width: 120px;
    height: 120px;
    display: none;
  }
}

.invalid-image {
  display: none;
  color: $red;
}

.d-block {
  display: block;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #f5f5fd;
  border-radius: 24px;
}

.uploaded-pdf-file-gray {
  background: $default-badge-border;
  position: absolute;
  left: 50%;
  width: 100%;
  height: 50%;
  transform: translate(-50%, -50%);
  padding: 0 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  font-family: $default_font;

  .name {
    color: #38405b;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type {
    color: $colabs-bg;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.168px;
  }
}

.add {
  background: #d7dce5;
  border-radius: 6px;
  padding: 8px 12px;
  color: #344054;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-size: 14px;
  font-style: normal;
  font-weight: 450;
  line-height: 16px;
  letter-spacing: 0.168px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    width: 16px;
    height: 16px;
  }
}

.el-upload-list__item-thumbnail {
  padding: 0;
  width: 120px !important;
  height: 120px !important;
  border-radius: 8px;
  position: relative;
}

.el-upload-list--picture .el-upload-list__item {
  padding: 0;
  width: 120px;
  height: 120px;
}

.uploader-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  position: relative;

  &:hover {
    .el-upload-list__item-actions {
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      width: 120px;
      height: 120px;
      position: absolute;
      border-radius: 8px;
      padding: 4px 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      z-index: 9999999;
      top: 0;
      gap: 8px;
    }
  }
}

.el-upload-list__item-actions {
  display: none;
}
</style>
