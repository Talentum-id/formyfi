<template>
  <header class="header">
    <div class="title">
      <img src="@/assets/images/logo-ligth.svg" @click="goHome" alt="" class="cursor-pointer" />
    </div>
    <div class="info relative" ref="notificationContainer" v-if="user">
      <div class="avatar" @click="showTooltips = !showTooltips" ref="menu">
        <div
          v-if="user.avatar.length"
          :style="{ background: `url(${user.avatarUri})` }"
          style="background-size: cover; background-position: center"
          class="avatar-img"
        />
        <img v-else src="@/assets/images/default-avatar.png" alt="" class="cursor-pointer" />

        <div class="user-info">
          <span>{{ user.username }}</span>
          <span class="fullname">{{ user.fullName.trim() || 'User' }} </span>
        </div>
        <div v-if="showTooltips" id="tooltip-confirmation">
          <div class="tooltip-arrow"></div>
          <div class="menu">
            <router-link to="/profile" class="logout"> Profile</router-link>
            <hr />
            <span class="logout" @click="logout()">
              Logout
              <Icon icon="Kick-out" :size="24"></Icon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';
import defaultAvatar from '@/assets/images/User.png';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '@/components/Icons/Icon.vue';
import { useAuthStore } from '@/store/auth';
import { useDisconnect } from '@wagmi/vue';
import { readFile } from '@/util/helpers';

export default {
  name: 'Header',
  components: { Icon },
  data() {
    return {
      defaultAvatar,
    };
  },
  setup() {
    const showTooltips = ref(false);
    const menu = ref(null);

    const router = useRouter();
    const authStore = useAuthStore();
    const { disconnect } = useDisconnect();

    const user = computed(() => authStore.getProfileData);

    const goHome = () => {
      router.push('/');
    };

    const handleClickOutside = (event) => {
      if (menu.value && !menu.value.contains(event.target)) {
        showTooltips.value = false;
      }
    };

    const logout = () => {
      disconnect();
      authStore.logout();
    };

    onMounted(async () => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      menu,
      logout,
      showTooltips,
      authStore,
      goHome,
      readFile,
      user,
    };
  },
  mixins: [windowSizeMixin],
  props: {
    open: { type: Function },
  },
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 32px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  background: $default-bg;
  height: 72px;
  max-height: 72px;
  border-bottom: 1px solid $default-border;
  position: relative;
  z-index: 203;
  padding: 0 32px 0 24px;
}

#tooltip-confirmation {
  position: absolute;
  z-index: 9999999;
  right: 0;
  width: 112px;
  height: fit-content;
  margin-top: 130px;
  background: $white;
  padding: 13px 16px;
  box-shadow: 0 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
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

  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 78%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }

  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;

    .link {
      font-family: $default_font;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $default;
    }

    .logout {
      font-family: $default_font;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $secondary;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: space-between;
      text-decoration: none;
    }

    hr {
      color: #dad9f7;
    }
  }
}

.avatar {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;

  .avatar-img {
    height: 48px;
    width: 48px;
    border-radius: 50px;
    cursor: pointer;
  }

  .user-info {
    display: flex;
    flex-direction: column;

    span {
      font-family: $default_font;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $primary-text;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: space-between;
      text-decoration: none;
    }

    .fullname {
      font-size: 12px;
    }
  }
}

.notification {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    //background: $transparent-active-text;
    .icon {
      filter: invert(100%) sepia(7%) saturate(2%) hue-rotate(111deg) brightness(115%) contrast(100%);
    }
  }
}

.dot {
  position: absolute;
  background: $orange;
  width: 8px;
  height: 8px;
  border-radius: 100px;
  left: 18px;
  bottom: 15px;
}

.beta {
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  color: #fc660c;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: $default_font;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.098px;
  border-radius: 6px;
  background: #ffe6d8;
  margin-top: 8px;
}
</style>
