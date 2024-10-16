<template>
  <div class="multi-select" @click="toggleDropdown" ref="selectContainer">
    <div class="selected">
      {{
        selectedItems.length > 0
          ? selectedItems.map((item) => item.name).join(', ')
          : 'Select options...'
      }}
      <span class="arrow" :class="{ 'arrow-up': open }"></span>
    </div>
    <transition name="dropdown">
      <div class="items" v-if="open">
        <div
          v-for="option in options"
          :key="option.id"
          @click.stop="toggleOption(option)"
          :class="{ 'item-selected': isSelected(option) }"
        >
          {{ option.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useFocusWithin } from '@vueuse/core';

export default {
  name: 'MultiSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const open = ref(false);
    const selectContainer = ref(null);

    const isSelected = (option) => selectedItems.value.includes(option);
    const selectedItems = ref([]);
    const toggleOption = (option) => {
      const index = selectedItems.value.findIndex((item) => item.id === option.id);
      if (index !== -1) {
        selectedItems.value.splice(index, 1);
      } else {
        selectedItems.value.push(option);
      }
      emit('update:modelValue', selectedItems.value);
    };

    const toggleDropdown = () => {
      open.value = !open.value;
    };

    const { focused } = useFocusWithin(selectContainer);
    watch(focused, (newFocused) => {
      if (!newFocused) open.value = false;
    });

    return {
      open,
      selectedItems,
      selectContainer,
      isSelected,
      toggleOption,
      toggleDropdown,
    };
  },
};
</script>

<style scoped lang="scss">
.multi-select {
  width: 100%;
  cursor: pointer;
  position: relative;
  display: inline-block;
  user-select: none;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
}

.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  color: #38405b;
}

.items {
  position: absolute;
  background: #fff;
  cursor: pointer;
  user-select: none;
  overflow-y: auto;
  border: 1px solid #e1e1e1;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  width: 100%;
  z-index: 10;
}

.items div {
  padding: 4px 8px;
  color: #38405b;
}

.items div:hover,
.items div.item-selected {
  background-color: #f0f0f0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.arrow {
  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  transition: transform 0.2s;
  margin-right: 5px;
  width: 12px;
  height: 7px;
}

.arrow-up {
  transform: rotate(180deg);
}
</style>
