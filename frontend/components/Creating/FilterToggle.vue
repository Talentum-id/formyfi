<template>
  <form
    class="filter-field"
    :style="{ width: fixedWidth + ' !important' }"
    :class="{ review, isDivided, isBig, isSmall }"
  >
    <div
      :class="{
        'filter-item': true,
        isFixed: !!fixedWidth,
        isDivided,

        'disabled animate-pulse': disabled,
      }"
      v-for="(button, idx) in buttons"
      :key="idx"
    >
      <input
        v-if="type === 'checkbox'"
        :type="type"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="selectedActionsIds.includes(String(button.id))"
        ref="checkboxes"
        @change="onSelect(button.id)"
      />
      <input
        v-else
        :type="type"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="id === idx"
        ref="checkboxes"
        @change="onSelect(button.id)"
      />
      <label
        :class="{ btnLight, bgLight, isSmall, centered }"
        @click="onSelectRadio(button)"
        :for="`${uniqueId}-${button.title}`"
        >{{ button.title }}</label
      >
    </div>
  </form>
</template>

<script setup>
import {computed, nextTick, ref} from 'vue';

defineOptions({
  name: 'FilterToggle',
});

const props = defineProps({
  buttons: {
    type: Array,
    default: Array.of({
      title: { type: String, default: 'click' },
      id: { type: Number, default: 1 },
    }),
  },
  id: { type: Number, default: 0 },
  review: { type: Boolean, default: false },
  isDivided: { type: Boolean, default: false },
  type: { type: String, default: 'radio' },
  btnLight: { type: Boolean, default: false },
  bgLight: { type: Boolean, default: false },
  isBig: { type: Boolean, default: false },
  isSmall: { type: Boolean, default: false },
  centered: { type: Boolean, default: false },
  selectedActionsIds: { type: Array, default: [] },
  disabled: { type: Boolean, default: false },
  fixedWidth: { type: String, default: '' },
});

const emit = defineEmits(['select']);
const checkboxes = ref([]);

const uniqueId = computed(() => {
  return `switch-${Math.random().toString(36).substr(2, 9)}`;
});

const getNamesForIds = (ids, options) => {
  const selectedOptions = options.filter((option) => ids.includes(option.id.toString()));
  return selectedOptions.map((option) => option.name);
};
const onSelectRadio = (event) => {
  if (props.disabled) return;
  if (props.type !== 'radio') return;
  emit('select', { id: event.id, status: event.name });
};
const onSelect = (id) => {
  if (props.type === 'radio') return;
  nextTick(() => {
    let checkedButtons = [];
    checkedButtons = Array.from(checkboxes.value)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const names = getNamesForIds(checkedButtons, props.buttons);
    emit('select', { id, checkedButtons, names });
  });
};
</script>

<style scoped lang="scss">
input {
  display: none;
  &:checked + label {
    background: $default;
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 2.3;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $white;
    border-radius: 6px;
    &.bgLight {
      color: $section-title;
      background: $default-border;

      &:hover {
        background: $default-border;
      }
    }

    &:hover {
      background: $default;
    }
  }
}
.filter-field {
  display: flex;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content !important;
  height: 32px;
  padding: 2px;
  gap: 2px;

  .disabled {
    pointer-events: none;
  }

  &.isSmall {
    max-width: 328px;
    // min-width: 328px;
    label {
      font-size: 12px;
      line-height: 2.2;
    }
    input:checked + label {
      line-height: 2.2;
    }

    .filter-item {
      width: 100%;
    }
  }
  &.isBig {
    height: 40px;
    label {
      line-height: 2.5;
    }
    input:checked + label {
      line-height: 2.5;
    }
  }
  &.isDivided {
    gap: 8px;
    background: transparent;
    border: none;
    height: auto;
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #aaa;
    }
    input {
      &:checked + label {
        background: $default;
        border-radius: 6px;
        font-family: $default_font;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 2.3;
        text-align: center;
        font-feature-settings: 'zero' on;
        color: $white;

        &.btnLight {
          background: $default-border;
        }
        &.bgLight {
          background: $default-border;
          color: $section-title;
        }
      }
    }
    label {
      &:first-of-type {
        border-radius: 8px;
      }

      &:last-of-type {
        border-radius: 8px;
      }
    }
  }
  &.review {
    width: 490px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    width: fit-content;
    height: 100%;
    white-space: nowrap;

    &.isFixed {
      width: 100%;
    }

    &.isDivided {
      width: auto;
      border-radius: 8px;
      label {
        border: 1px solid $default-border;
      }
      input {
        border-radius: 8px;

        &:checked + label {
          border: 1px solid $default;
          border-radius: 8px;
          &.bgLight {
            background: $default-border;
          }
          &.bgLight {
            border: 1px solid $default-border;
          }
        }
      }
    }
  }

  label {
    display: block;
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 2.3;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $default;
    height: 100%;
    width: 100%;
    padding: 0 16px;
    background: $white;

    &:hover {
      cursor: pointer;
      border-radius: 6px;
      background: $default-badge-border;
    }

    &.centered {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
