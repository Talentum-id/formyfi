<template>
  <Alert :message="errorMessage" type="error" v-if="showError" />
  <div class="main">
    <input
      type="file"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
      accept="image/*"
    />
    <div
      v-if="!banner && !image"
      :class="{ error: errorText && isError }"
      class="default-block"
      @click="uploadImage"
    >
      <div class="add-image"><Icon icon="Add" :size="24" /></div>
    </div>
    <div v-else class="background-block" :style="{ backgroundImage: `url(${image || banner})` }">
      <div v-if="isEditingActive" class="overlay">
        <div class="requirements">
          <span class="requirements__title">
            Recommended size — 480 x 760 px. PNG, JPEG. Maximum 1 MB.
          </span>
        </div>
        <div class="controllers">
          <div class="controller"><Icon icon="Edit" :size="24" @click="uploadImage" /></div>
        </div>
      </div>
    </div>
    <div v-if="errorText && isError" class="error-message">{{ errorText }}</div>
  </div>
</template>

<script setup>
import Icon from '@/components/Icons/Icon.vue';
import Alert from '@/components/Alert.vue';
import { ref } from 'vue';

const props = defineProps({
  banner: {
    type: String,
    default: '',
  },
  setImage: {
    type: Function,
    default: '',
  },
  isEditingActive: {
    type: Boolean,
    default: false,
  },
  isError: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
});

const hover = ref(false);
const noImage = ref(true);
const image = ref(null);
const fileInput = ref(null);
const showError = ref(false);
const errorMessage = ref('')

const handleFileUpload = () => {
  const file = fileInput.value.files[0];

  const maxSizeInMB = 1;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    image.value = null;
    noImage.value = true;

    errorMessage.value = 'The file size can\'t be more than 1 MB';
    showError.value = true;

    setTimeout(() => showError.value = false, 3000);

    return;
  }

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      image.value = e.target.result;
      noImage.value = false;

      props.setImage(file);
    };
    reader.readAsDataURL(file);
  }
};
const uploadImage = () => {
  fileInput.value.click();
};
</script>

<style scoped lang="scss">
.main {
  width: 360px;
  height: 130px;
  position: relative;
  z-index: 0;
  border-radius: 16px;

  .default-block {
    background: no-repeat center;
    background: white;
    background-size: cover;
    border-radius: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #dad9f7;

    cursor: pointer;
    &.error {
      border-color: $error-border;
    }
    .add-image {
      display: flex;
      align-items: center;
      padding: 4px;
      position: absolute;

      width: 32px;
      height: 32px;
      border-radius: 24px;
    }
  }
  .background-block {
    background: url('@/assets/images/default-back.png') no-repeat center;
    background-size: cover;
    width: 360px;
    height: 130px;
    border-radius: 16px;

    .overlay {
      display: none;
      border-radius: 16px;
    }

    &:hover {
      cursor: pointer;

      .overlay {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: rgba(56, 64, 91, 0.5);
        z-index: 100000;
        height: 100%;
        padding: 16px;
        align-items: flex-end;

        .requirements {
          width: 205px;

          &__title {
            font-size: 12px;
            line-height: 16px;
            font-weight: 500;
            font-family: $default_font;
            color: $white;
          }
        }

        .controllers {
          display: flex;
          align-items: center;
          gap: 16px;

          .controller {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            width: 32px;
            height: 32px;
            background: $default-bg;
            border-radius: 24px;
            &:hover {
              background: $default-border;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
.error-message {
  color: $error-text;
  font-family: $default_font;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
}
</style>
