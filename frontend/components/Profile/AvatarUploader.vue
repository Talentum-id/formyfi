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

  <Alert :message="errorMessage" type="error" v-if="showError" />
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';
import { modal } from '@/mixins/modal';
import { useAuthStore } from '@/store/auth';
import Alert from '@/components/Alert.vue';
import axiosService from '@/services/axiosService';

export default {
  name: 'AvatarUploader',
  components: {
    Alert,
    Icon,
  },
  data() {
    return {
      noAvatar: true,
      newAvatar: null,
      image: null,
      errorMessage: null,
      showError: false,
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

          const profileData = await useAuthStore().getProfileData;

          let avatar;

          if (typeof this.image !== 'string') {
            if (profileData.avatar.length) {
              await axiosService.post(`${process.env.API_URL}delete-files`, {
                paths: [profileData.avatar[0]],
              });
            }

            const formData = new FormData();

            formData.append('files[]', this.image);
            formData.append('paths[]', `/${process.env.DFX_NETWORK}/assets/${useAuthStore().getPrincipal}/avatar`);

            await axiosService.post(`${process.env.API_URL}upload-files`, formData)
              .then(({ data }) => avatar = data[0])
              .catch(e => console.error(e));
          }

          await useAuthStore().saveProfile({
            fullName: profileData.fullName,
            username: profileData.username,
            avatar: [avatar],
            banner: profileData.banner,
            provider: profileData.provider,
            title: profileData.title,
            connector: profileData.connector,
            extraIdentities: profileData.extraIdentities,
            forms_created: profileData.forms_created,
            zkLoginAddress: profileData.zkLoginAddress,
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
      const maxSizeInMB = 1;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        this.errorMessage = 'The file size can\'t be more than 1 MB';
        this.showError = true;

        setTimeout(() => this.showError = false, 3000);

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
      await modal.emit('openModal', {
        title: 'Removing file...',
        message: 'Please wait for a while',
        type: 'loading',
      });

      this.newAvatar = null;
      this.noAvatar = true;

      const profileData = useAuthStore().getProfileData;

      if (profileData.avatar.length) {
        await axiosService.post(`${process.env.API_URL}delete-files`, {
          paths: [profileData.avatar[0]],
        });
      }

      await useAuthStore().saveProfile({
        fullName: profileData.fullName,
        username: profileData.username,
        avatar: [],
        banner: profileData.banner,
        provider: profileData.provider,
        title: profileData.title,
        connector: profileData.connector,
        extraIdentities: profileData.extraIdentities,
        forms_created: profileData.forms_created,
        zkLoginAddress: profileData.zkLoginAddress,
      });

      await useAuthStore().getProfile();

      await modal.emit('closeModal', {});
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
