<template>
  <div class="main">
    <input
      type="file"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
      accept="image/*"
    />
    <div v-if="!banner && !image" class="default-block">
      <div class="add-image"><Icon icon="Create" :size="24" @click="uploadImage" /></div>
    </div>
    <div v-else class="background-block" :style="{ backgroundImage: `url(${image || banner})` }">
      <div class="controllers">
        <div class="controller"><Icon icon="Edit" :size="24" @click="uploadImage" /></div>
        <div class="controller"><Icon icon="Cancel" :size="24" @click="removeImage" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';
import { modal } from '@/mixins/modal';
import { useAssetsStore } from '@/store/assets';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'BannerUploader',
  components: { Icon },
  data() {
    return {
      hover: false,
      noImage: true,
      image: null,
      file: null,
    };
  },
  props: {
    banner: {
      type: String,
      default: '',
    },
  },
  methods: {
    loadFiles() {
      return new Promise(async (resolve, reject) => {
        try {
          await modal.emit('openModal', {
            title: 'Loading files...',
            message: 'Please wait for a while',
            type: 'loading',
          });
          let index = 0;
          const realTime = Math.floor(new Date().getTime() / 1000);
          const batch = useAssetsStore().assetManager.batch();
          let banner;
          if (typeof this.file !== 'string') {
            banner = await batch.store(this.file, {
              path: `/assets/${realTime}/${index}`,
            });
          }

          await batch.commit();
          await useAuthStore().saveProfile({
            fullName: useAuthStore().getProfileData.fullName,
            username: useAuthStore().getProfileData.username,
            avatar: useAuthStore().getProfileData.avatar,
            banner: [banner],
          });
          await useAuthStore().getProfile();
          await modal.emit('closeModal', {});
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },

    handleFileUpload() {
      const file = this.$refs.fileInput.files[0];
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        return;
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.file = file;
          this.image = e.target.result;
          this.loadFiles();

          this.noImage = false;
        };
        reader.readAsDataURL(file);
      }
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    removeImage() {
      this.image = null;
      this.noImage = true;
      useAuthStore().saveProfile({
        fullName: useAuthStore().getProfileData.fullName,
        username: useAuthStore().getProfileData.username,
        avatar: useAuthStore().getProfileData.avatar,
        banner: [],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 260px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  .default-block {
    background: url('@/assets/images/default-back.png') no-repeat center;
    background-size: cover;
    width: 100%;
    height: 100%;
    .add-image {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .add-image {
        display: flex;
        align-items: center;
        padding: 4px;
        position: absolute;
        right: 0;
        bottom: 0;
        margin-bottom: 32px;
        margin-right: 42px;
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
  .background-block {
    background: url('@/assets/images/default-back.png') no-repeat center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    .controllers {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .controllers {
        display: flex;
        align-items: center;
        gap: 16px;
        position: absolute;
        right: 0;
        bottom: 0;
        margin-bottom: 32px;
        margin-right: 42px;
        .controller {
          display: flex;
          align-items: center;
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
</style>
