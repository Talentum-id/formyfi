<template>
  <Default>
    <button type="button" @click="greet()">Click!</button>
    <p>{{ message }}!</p>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import { useAuthStore } from '@/store/auth';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const caller = ref(null);

const message = computed(() => {
  return caller.value || 'Hello, guest!';
});

const greet = () => {
  authStore.actor.greet().then((res) => {
    caller.value = res;
  });
};
</script>
<style scoped lang="scss">
p {
  color: red;
}
</style>
