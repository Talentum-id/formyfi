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
