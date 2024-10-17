<template>
  <Default>
    <p class="text-5xl mb-10">Statistics</p>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div class="px-4 py-2 sm:px-6 text-lg">
          Total indicators
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex gap-3 items-center">
              <p class="truncate text-gray-900 inline-block">Users - </p>
              <span
                class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-3 py-1.5 text-green-700 ring-1 ring-inset ring-green-600/20">
                {{ userStats }}
              </span>
            </div>
            <div class="flex gap-3 items-center">
              <p class="truncate text-gray-900 inline-block">Forms - </p>
              <span
                class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-3 py-1.5 text-green-700 ring-1 ring-inset ring-green-600/20">
                {{ qaStats }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div class="px-4 py-2 sm:px-6 text-lg">
          Admin management
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="flex gap-x-2 items-start justify-between">
            <Input
              without-name
              v-model="addingAdminUsername"
              placeholder="Username"
            />
            <button
              class="bg-blue-600 px-4 py-2 rounded-md text-white disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
              :disabled="addingAdminUsername.trim().length < 4 || addingLoading"
              @click="addAdmin()"
            >
              Add
            </button>
          </div>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="flex gap-x-2 items-start justify-between">
            <Input
              without-name
              v-model="deletingAdminUsername"
              placeholder="Username"
            />
            <button
              class="bg-red-600 px-4 py-2 rounded-md text-white disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
              :disabled="deletingAdminUsername.trim().length < 4 || deletingLoading"
              @click="removeAdmin()"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { modal } from '@/mixins/modal';
import router from '@/router';
import Default from '@/layouts/default.vue';
import { useQAStore } from '@/store/qa';
import Input from '@/components/Input.vue';

const authStore = useAuthStore();
const qaStore = useQAStore();

const addingAdminUsername = ref('');
const deletingAdminUsername = ref('');
const addingLoading = ref(false);
const deletingLoading = ref(false);

const admins = computed(() => authStore.getAdmins);
const qaStats = computed(() => qaStore.getStats);
const userStats = computed(() => authStore.getStats);
const user = computed(() => authStore.getUser);

onMounted(async () => {
  await authStore.fetchAdmins();

  if (admins.value.indexOf(user.value.username) === -1) {
    modal.emit('openModal', {
      title: 'Access forbidden',
      message: 'You have no Admin right!',
      type: 'error',
      actionText: 'Back',
      fn: () => router.push('/'),
    });
  } else {
    await authStore.fetchStats();
    await qaStore.fetchStats();
  }
});

const addAdmin = async () => {
  if (addingAdminUsername.value.trim().length > 4) {
    addingLoading.value = true;
    await authStore.addAdmin(addingAdminUsername.value)
      .then(() => {
        modal.emit('openModal', {
          title: 'Success',
          message: 'Operation completed',
          type: 'success',
          actionText: 'Ok',
          fn: () => router.push('/stats'),
        });
        addingAdminUsername.value = '';
      })
      .catch((e) => {
        console.log(e)
        modal.emit('openModal', {
          title: 'Bad request',
          message: 'Username may not exist, is Admin already or You have not Admin rights',
          type: 'error',
          actionText: 'Back',
          fn: () => router.push('/stats'),
        });
        addingAdminUsername.value = '';
      })
      .finally(() => addingLoading.value = false);
  }
};

const removeAdmin = async () => {
  if (deletingAdminUsername.value.trim().length > 4) {
    deletingLoading.value = true;
    await authStore.deleteAdmin(deletingAdminUsername.value)
      .then(() => {
        modal.emit('openModal', {
          title: 'Success',
          message: 'Operation completed',
          type: 'success',
          actionText: 'Ok',
          fn: () => router.push('/stats'),
        });
        deletingAdminUsername.value = '';
      })
      .catch((e) => {
        console.log(e)
        modal.emit('openModal', {
          title: 'Bad Request',
          message: 'Username may not exist, is not Admin yet, cannot be deleted or You have no Admin rights',
          type: 'error',
          actionText: 'Back',
          fn: () => router.push('/stats'),
        });
      })
      .finally(() => deletingLoading.value = false);
  }
};
</script>

<style scoped lang="scss">

</style>