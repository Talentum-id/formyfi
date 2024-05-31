<template>
  <div class="main">
    <input
      type="file"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
      accept="image/*"
    />
    <div class="default-avatar" v-if="!avatar && !newAvatar" @click="uploadAvatar">
      <Icon class="controller" icon="Create" :size="24"></Icon>
    </div>
    <div class="avatar" v-else :style="{ backgroundImage: `url(${newAvatar || avatar})` }">
      <div class="overlay"></div>
      <div class="controllers">
        <Icon class="controller" icon="Edit" :size="32" @click="uploadAvatar"></Icon>
        <Icon class="controller" icon="Cancel" :size="32" @click="removeAvatar"></Icon>
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
  name: 'AvatarUploader',
  components: { Icon },
  data() {
    return {
      noAvatar: true,
      newAvatar: null,
      image: null,
    };
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
  },
  methods: {
    uploadAvatar() {
      this.$refs.fileInput.click();
    },
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
          let avatar;
          if (typeof this.image !== 'string') {
            avatar = await batch.store(this.image, {
              path: `/assets/${realTime}/${index}`,
            });
          }

          await batch.commit();

          const profileData = useAuthStore().getProfileData;

          await useAuthStore().saveProfile({
            fullName: profileData.fullName,
            username: profileData.username,
            avatar: [avatar],
            banner: profileData.banner,
            forms_created: profileData.forms_created,
          });

          await useAuthStore().getProfile();

          await modal.emit('closeModal', {});
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        return;
      }
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = file;
          this.newAvatar = e.target.result;
          this.loadFiles();
          this.noAvatar = false;
        };
        reader.readAsDataURL(file);
      }
      event.target.value = null;
    },
    async removeAvatar() {
      this.newAvatar = null;
      this.noAvatar = true;
      await useAuthStore().saveProfile({
        fullName: useAuthStore().getProfileData.fullName,
        username: useAuthStore().getProfileData.username,
        avatar: [],
        banner: useAuthStore().getProfileData.banner,
        forms_created: useAuthStore().getProfileData.forms_created,
      });
      await useAuthStore().getProfile();
    },
  },
};
</script>
<style scoped lang="scss">
.controller {
  display: flex;
  align-items: center;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 24px;
  &:hover {
    background: $default-border;
    cursor: pointer;
  }
}

.main {
  border-radius: 100px;
  border: 3px solid $default-bg;
  background: $default-badge-border;
  position: relative;
  z-index: 98;

  .default-avatar {
    background: url('@/assets/images/default-avatar.png') no-repeat;
    background-size: contain;
    display: flex;
    height: 160px;
    width: 160px;
    align-items: center;
    border-radius: 100px;
    * {
      margin: 0 auto;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .avatar {
    background: url('@/assets/images/default-avatar.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    height: 160px;
    width: 160px;
    align-items: center;
    border-radius: 100px;
    .overlay,
    .controllers {
      display: none;
    }

    &:hover {
      border-radius: 100px;
      cursor: pointer;
      .overlay {
        display: block;
        position: absolute;
        height: 160px;
        width: 160px;
        padding: 3px;
        border-radius: 100px;
        background: rgba($black, 0.5);
        z-index: 0;
      }
      .controllers {
        display: flex;
        z-index: 1;
        gap: 10px;
        align-items: center;
        margin: 0 auto;
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
