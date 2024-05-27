<template>
  <div class="custom_calendar_wrapper" :class="{ isSmall }" ref="calendarRef">
    <input
      class="custom-calendar"
      :id="inputId"
      ref="inputRef"
      type="text"
      @click="showDatePicker"
      :value="selectedDate"
    />
    <label
      class="custom-calendar-label"
      :class="{ isSmall }"
      :for="inputId"
      @click="showDatePicker"
    >
      <span>{{ formatDateCurrent(selectedDate) }}</span>
      <Icon @click="showDatePicker" name="Calendar" :size="isSmall ? 12 : 24" />
    </label>
  </div>
</template>

<script>
import { computed, ref, toRef, watch } from 'vue';
import * as mobiscroll from '@mobiscroll/javascript';
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';
import { formatDate, formatDateCurrent, transformDate } from '@/util/helpers';
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'DatePicker',
  components: { Icon },
  props: {
    options: { type: Object, default: {} },
    events: { type: Array, default: [] },
    defaultDate: { type: Date, default: null },
    minDate: { type: Date, default: null },
    maxDate: { type: Date, default: null },
    isSmall: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const inputRef = ref(null);
    const calendarRef = ref(null);
    const selectedDate = ref(props.defaultDate);
    const inputId = computed(() => `custom-calendar-${Math.random().toString(36).substr(2, 9)}`);

    const defaultDatePropRef = toRef(props, 'defaultDate');

    watch(defaultDatePropRef, (value) => {
      selectedDate.value = value;
    });

    const showDatePicker = () => {
      mobiscroll.setOptions({
        theme: 'material',
      });

      const datepicker = mobiscroll.datepicker(inputRef.value, {
        controls: ['calendar'],
        touchUi: false,
        marked: props.events,
        ...props.options,
        min: props.minDate,
        max: props.maxDate,
        onCellClick: function (event, inst) {
          selectedDate.value = event.date;
          emit('selectedDate', event.date);
        },
      });

      if (props.defaultDate) {
        datepicker.setVal(props.defaultDate);
      }
    };

    return {
      inputRef,
      calendarRef,
      showDatePicker,
      selectedDate,
      formatDate,
      formatDateCurrent,
      inputId,
    };
  },
};
</script>

<style lang="scss">
.custom-calendar {
  opacity: 0;
}
#calendar {
  display: none;
}

.custom-calendar-label {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 210px;
  height: 40px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  outline: none;
  padding: 0 12px;
  cursor: pointer;

  font-family: $default_font;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $section-title;
  &.isSmall {
    width: 117px;
    height: 24px;
    font-size: 12px;
    padding: 5px;
    border-radius: 6px;
    span {
      line-height: 1px;
    }
  }
}

.display-none {
  display: none;
}

.custom_calendar_wrapper {
  position: relative;
  max-width: 240px;
  border-radius: 16px;
  &.isSmall {
    input {
      width: 117px;
      height: 24px;
    }
  }
  cursor: pointer;
  input {
    width: 210px;
    height: 40px;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    outline: none;
    padding-left: 20px;

    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
  }
}

.calender-icon {
  position: absolute;
  top: 7px;
  right: 10px;
}

.flex {
  flex: none;
}
</style>
