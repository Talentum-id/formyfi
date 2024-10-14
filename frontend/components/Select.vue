<template>
  <div
    :class="`custom-select ${mainStyles}`"
    :style="{ zIndex: open ? 1000 : 98 }"
    :tabindex="tabindex"
    ref="selectContainer"
  >
    <div class="selected" :class="`${open && 'open'} !${selectedStyle}`" @click="toggle">
      <div :class="`${selectedLabelStyle}`">
        {{ reduceStringLength(selected.name || 'Select option', stringLengthSelected) }}
      </div>
      <div
        v-if="!disabled && selected.name"
        class="arrow"
        :class="`${open && 'flipped'} ${arrowStyle}`"
      ></div>
    </div>
    <div
      v-if="!disabled && selected.name"
      class="items"
      :class="`${itemsStyles} ${!open && 'selectHide'}`"
      :style="{
        overflowX: scrollHorizontalHidden ? 'hidden' : '',
        maxHeight: height + 'px',
      }"
    >
      <div :class="`first ${firstStyles}`" @click="toggle">
        {{ reduceStringLength(selected.name, stringLengthFirst - 2) }}
        <icon icon="Tik" :size="20"></icon>
      </div>
      <hr />
      <div
        v-for="(option, i) in options.filter((i) => i.name !== selected.name)"
        :key="i"
        @click.stop="selectOption(option)"
      >
        {{ reduceStringLength(option.name, stringLength) }}
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onBeforeMount, watch } from 'vue';
import { reduceStringLength } from '@/util/helpers';
import Icon from '@/components/Icons/Icon.vue';
import { useFocusWithin } from '@vueuse/core';

export default {
  name: 'Select',
  components: { Icon },
  data() {
    return {
      reduceStringLength,
    };
  },
  props: {
    stringLengthFirst: {
      type: Number,
      default: 18,
    },
    stringLengthSelected: {
      type: Number,
      default: 18,
    },
    stringLength: {
      type: Number,
      default: 18,
    },
    mainStyles: {
      type: String,
      default: '',
    },
    itemsStyles: {
      type: String,
      default: '',
    },
    firstStyles: {
      type: String,
      default: '',
    },
    arrowStyle: {
      type: String,
      default: '',
    },
    selectedStyle: {
      type: String,
      default: '',
    },
    selectedLabelStyle: {
      type: Object,
      default: {},
    },
    tasty: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    scrollHorizontalHidden: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 200,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    smallText: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
    const open = ref(false);
    const selectContainer = ref(null);
    const toggle = () => {
      open.value = !open.value;
    };
    const { focused } = useFocusWithin(selectContainer);

    const selectOption = (option) => {
      selected.value = option;
      toggle();
      emit('input', option);
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };
    watch(
      () => props.options,
      (newValue, old) => {
        if (arraysEqual(old, newValue)) {
          return;
        }

        if (newValue && newValue.length) {
          selected.value = newValue[0];
        }
      },
    );

    watch(focused, (focused) => {
      if (!focused) {
        open.value = false;
      }
    });

    function arraysEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    onBeforeMount(() => {
      emit('input', selected.value);
      document.addEventListener('click', handleClickOutside);
    });

    return {
      selected,
      open,
      selectContainer,
      toggle,
      selectOption,
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
  border: 1px solid $default-border;
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
</style>
