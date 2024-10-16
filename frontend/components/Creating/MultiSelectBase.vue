<template>
  <div
    class="custom-select"
    @click="toggleDropdown"
    ref="selectContainer"
    :style="{ zIndex: open ? 1000 : 98 }"
  >
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
          <icon icon="Tik" v-show="isSelected(option)" :size="20"></icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useFocusWithin } from '@vueuse/core';
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'MultiSelect',
  components: { Icon },
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
.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  z-index: 98;
  line-height: 47px;
  border-radius: 8px;
}

.custom-select .selected {
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 8px;
  color: $transparent-active-text;
}

.custom-select .selected.open {
  background: $white;
  border: 1px solid $default-border;
  cursor: pointer;
  user-select: none;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  z-index: 1000;
  color: $default;
}

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}

.arrow {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  background: url('@/assets/images/select.svg') no-repeat;
}

.arrow.flipped {
  transform: rotate(180deg);
}

.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  font-size: 14px;
}

.custom-select .items {
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  padding: 8px;
  line-height: 20px;
  color: $default;
  max-height: 200px;
  overflow: auto;
  border: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1000;
  word-break: break-word;
}

hr {
  margin: 8px 0;
  color: #dad9f7;
}

.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;

  &:not(:first-child) {
    margin-top: 8px;
  }
}

.custom-select .items div:hover {
  background-color: $default-border;
  border-radius: 8px;
}

.selectHide {
  display: none;
}

::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

::-webkit-scrollbar-thumb:horizontal {
}

.item-selected {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
