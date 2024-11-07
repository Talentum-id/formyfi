<template>
  <Default>
    <div class="profile" v-if="user">
      <BannerUploader :banner="user.bannerUri" />
      <div class="naming w-full">
        <AvatarUploader :avatar="user.avatarUri" />
        <div class="info">
          <InputName v-model="name" :placeholder="user.username" @input="setName()" />
        </div>
      </div>
      <div class="info-block">
        <div class="content">
          <div class="info-cards">
            <StatCardSmall
              @click="router.push('my-responses')"
              title="Forms Completed"
              icon="Tasks"
              :value="stats.forms_completed"
            />
            <StatCardSmall
              title="Forms Created"
              icon="Tik-Tik"
              :value="stats.forms_created"
              @click="router.push('/')"
            />
          </div>
          <div class="container">
            <span>Role</span>
            <Badge text="User" type="claim" transparent />
          </div>
          <div class="container">
            <span>Pricing Plan</span>
            <Badge text="Free" type="claim" transparent />
          </div>
          <div class="flex gap-2 is-text flex-wrap w-[90%]">
            <SocialTag
              v-for="i in socialButtons"
              :data="i"
              @connect="i.fn()"
              @remove="i.rm()"
              :key="i.id"
              :hide-remove="i.noRemove"
            ></SocialTag>
          </div>
        </div>
        <div class="sidebar">
          <div class="points">
            <span>Points</span> <span> {{ stats.points }} QP</span>
          </div>
        </div>
      </div>
    </div>
  </Default>
  <Alert :message="error" type="error" v-if="error.trim().length > 0" />
</template>
<script setup>
import BannerUploader from '@/components/Profile/BannerUploader.vue';
import AvatarUploader from '@/components/Profile/AvatarUploader.vue';
import InputName from '@/components/Profile/InputName.vue';
import { ref, computed, onMounted } from 'vue';
import Default from '@/layouts/default.vue';
import Badge from '@/components/Badge.vue';
import StatCardSmall from '@/components/StatCards/StatCardSmall.vue';
import { useAuthStore } from '@/store/auth';
import { useDebounceFn } from '@vueuse/core';
import { useStatsStore } from '@/store/stats';
import Alert from '@/components/Alert.vue';
import { useRouter } from 'vue-router';
import SocialTag from '@/components/Profile/SocialTag.vue';
import { shortenAddress } from '@/util/helpers';

const authStore = useAuthStore();
const statsStore = useStatsStore();

const router = useRouter();

const stats = computed(() => statsStore.getStatistics);
const user = computed(() => authStore.getProfileData);

let name = ref('');
const error = ref('');

onMounted(async () => {
  await statsStore.findStatistics();
});

const setName = useDebounceFn(async () => {
  const validatedName = name.value.trim().toLowerCase();
  const alphaNumericWithDot = /^[a-zA-Z0-9.]+$/;

  if (validatedName.length < 4 || validatedName.length > 18) {
    error.value = 'Username should have from 4 to 18 characters';

    return;
  }

  if (!alphaNumericWithDot.test(validatedName)) {
    error.value = 'Username can only consist of alphanumeric characters and dot';
  } else {
    error.value = '';
    name.value = validatedName;

    await authStore.saveProfile({
      fullName: user.value.fullName,
      username: name.value,
      avatar: user.value.avatar,
      banner: user.value.banner,
      forms_created: user.value.forms_created,
    });

    await authStore.getProfile();
  }

  setTimeout(() => (error.value = ''), 3000);
}, 2500);

const canRemoveSocial = (socialName) => {};

const socialButtons = computed(
  () => [
    {
      id: 2,
      icon: getSocialName('google') ? 'Google' : 'Email-Default',
      status: getSocialName('google') || '',
      name: 'google',
      value: getSocialName('google') ? getSocialName('google').name : '',
      fn: () => connectSocial('google'),
      rm: () => {},
      noRemove: !canRemoveSocial('google'),
    },
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialName('twitter'),
      name: 'twitter',
      value: getSocialName('twitter')?.name,
      fn: () => connectSocial('twitter'),
      rm: () => removeSocial('twitter'),
      noRemove: !canRemoveSocial('twitter'),
    },
    {
      id: 4,
      icon: 'Discord-Default',
      status: getSocialName('discord'),
      name: 'discord',
      value: getSocialName('discord')?.name,
      fn: () => connectSocial('discord'),
      rm: () => removeSocial('discord'),
      noRemove: !canRemoveSocial('discord'),
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getSocialName('telegram'),
      name: 'telegram',
      value: getSocialName('telegram')?.name,
      fn: () => connectSocial('telegram'),
      rm: () => removeSocial('telegram'),
      noRemove: !canRemoveSocial('telegram'),
    },
    {
      id: 7,
      icon: 'Reddit-Default',
      status: getSocialName('reddit'),
      name: 'reddit',
      value: getSocialName('reddit')?.name,
      fn: () => connectSocial('reddit'),
      rm: () => removeSocial('reddit'),
      noRemove: !canRemoveSocial('reddit'),
    },
    {
      id: 8,
      icon: 'YouTube-Default',
      status: getSocialName('youtube'),
      name: 'youtube channel',
      value: getSocialName('youtube')?.name,
      fn: () => connectSocial('youtube'),
      rm: () => removeSocial('youtube'),
      noRemove: false,
    },
    {
      id: 9,
      icon: 'Facebook-Default',
      status: getSocialName('facebook'),
      name: 'facebook',
      value: getSocialName('facebook')?.name,
      fn: () => connectSocial('facebook'),
      rm: () => removeSocial('facebook'),
      noRemove: !canRemoveSocial('facebook'),
    },
    {
      id: 6,
      icon: 'Wallet-Default',
      status: '123',
      name: 'Wallet',
      value: '123' ? shortenAddress('123') : null,
      fn: () => {},
      rm: () => {},
      noRemove: true,
    },
  ],
  { dependsOn: [] },
);

const getSocialName = (social) => {
  return null;
};

async function connectSocial(socialName) {}
async function removeSocial(socialName) {}
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  .naming {
    margin-top: 140px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info {
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 80px;
    gap: 40px;
    .sidebar {
      min-width: 360px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      .points {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 24px;
        padding: 24px;
        background: $white;
        border: 1px solid $default-border;
        border-radius: 16px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      min-width: 760px;
      width: 100%;
      gap: 24px;
      padding: 24px;
      background: $white;
      border: 1px solid $default-border;
      border-radius: 16px;
      .info-cards {
        display: flex;
        gap: 16px;
      }
      .container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }
  }
}
</style>
