<template>
  <Default>
    <div class="profile" v-if="user">
      <BannerUploader :banner="user.bannerUri" />
      <div class="naming w-full">
        <AvatarUploader :avatar="user.avatarUri" />
        <div class="info">
          <InputName v-model="name" :placeholder="user.username" @input="setName"></InputName>
        </div>
      </div>
      <div class="info-block">
        <div class="content">
          <div class="info-cards">
            <StatCardSmall
              title="Forms Completed"
              icon="Tasks"
              :value="stats.forms_completed"
            />
            <StatCardSmall
              title="Forms Created"
              icon="Tik-Tik"
              :value="stats.forms_created"
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

  const authStore = useAuthStore();
  const statsStore = useStatsStore();

  const stats = computed(() => statsStore.getStatistics);
  const user = computed(() => authStore.getProfileData);

  let name = ref('');

  onMounted(async () => {
    await statsStore.findStatistics();
  });

  const setName = useDebounceFn(
    async () => {
      await authStore.saveProfile({
        fullName: user.value.fullName,
        username: name.value,
        avatar: user.value.avatar,
        banner: user.value.banner,
        forms_created: user.value.forms_created,
      });

      await authStore.getProfile();
    },
    2500,
  );
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
