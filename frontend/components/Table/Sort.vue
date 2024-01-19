<template>
  <div class="sort-img">
    <img src="@/assets/icons/Sort-up.svg" alt="" v-if="props.direction === 'desc'" />
    <img src="@/assets/icons/Sort-down.svg" alt="" v-else-if="props.direction === 'asc'" />
    <img src="@/assets/icons/Sort.svg" alt="" v-else />
  </div>
</template>

<script setup>
const props = defineProps({
  direction: { type: String, default: 'none' },
});
</script>

<style lang="scss" scoped>
.sort-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
