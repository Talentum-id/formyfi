<template>
  <base-button text="Create a Q&A" @click="showPreview()"></base-button>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    :visible="show"
    btnLeft
    @close="showPreview"
  >
    <div class="create-task_wrapper">
      <div class="title_wrapper">
        <div class="title">Create Q&A</div>
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Cover Image</div>
        <div class="upload-requirements">
          Recommended size — 480 x 480 px. PNG, JPEG. Maximum 10 MB.
        </div>
        <TaskBannerUploader :isEditingActive="true" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Quest Name</div>
        <Input name="" placeholder="Enter the quest name" />
      </div>
      <div class="section_wrapper">
        <div class="section_wrapper-title">Description</div>
        <div class="section_wrapper-subtitle">These are the instructions to complete the task.</div>
        <Editor />
        <!--        <div class="upload-requirements">-->
        <!--          Attach up to 3 files. PNG, JPEG, PDF. Minimum file size 10 KB, maximum 10 MB.-->
        <!--        </div>-->
        <!--        <CustomUpload-->
        <!--          @changeError="handleImageError"-->
        <!--          :imagesFiles="images"-->
        <!--          @images="images = $event"-->
        <!--        />-->
      </div>
      <div class="section_wrapper last">
        <div class="section_item">
          <div class="section_wrapper-title">Start Date</div>
          <CustomDatePicker
            :defaultDate="transformDate(startDate)"
            :minDate="todayDate"
            :maxDate="transformDate(addDaysToDate(endDate, -1))"
            @selectedDate="setStartDate"
          />
        </div>
        <div class="section_item">
          <div class="section_wrapper-title">End Date</div>
          <CustomDatePicker
            :defaultDate="transformDate(endDate)"
            :minDate="transformDate(startDate)"
            @selectedDate="setEndDate"
          />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import TaskBannerUploader from '@/components/Creating/TaskBannerUploader.vue';
import Editor from '@/components/Creating/Editor.vue';
import CustomDatePicker from '@/components/Creating/CustomDatePicker.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import Input from '@/components/Input.vue';
import {
  getBadgeTypeByName,
  getColorByClassName,
  dateToTimestamp,
  transformDate,
  addDaysToDate,
} from '@/util/helpers';
const show = ref(false);
const images = ref([]);
const isImagesError = ref(false);
const todayDate = new Date();
const startDate = ref(todayDate);
const twoDaysFromNow = new Date(todayDate);
const oneDayFromNow = new Date(todayDate);
const endDate = ref(twoDaysFromNow);
const handleImageError = (event) => {
  isImagesError.value = event;
};
const showPreview = () => {
  show.value = !show.value;
};
const setEndDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  if (isToday) {
    endDate.value = todayDate;
  } else {
    endDate.value = event;
  }
};
const setStartDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  const isTodayDate = eventDate.getDate() === today.getDate();
  if (isTodayDate) {
    startDate.value = todayDate;
  } else {
    startDate.value = event;
  }
};
</script>
<style scoped lang="scss">
.create-task_wrapper {
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 32px;
}
.upload-requirements {
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $default;
}
.title_wrapper {
  display: flex;
  justify-content: space-between;

  .title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}
.section_wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .condition-setting {
    background-color: #eaeafb;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-title {
      color: #6a6d8f;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }

    &-item {
      &-title {
        margin-bottom: 8px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 142.857%;
        color: #1a1d29;
      }

      .blockchain-select {
        position: relative;
        width: 50%;

        &-icon {
          position: absolute;
          height: 100%;
          left: 0;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 20;
          border-right: 1px solid #dad9f7;
          border-radius: 8px 0 0 8px;
          background-color: #dad9f7;
          top: 0;

          & > svg {
            display: inline-block;
          }
        }
      }
    }
  }

  &.last {
    flex-direction: row;
    justify-content: space-between;
  }

  &-title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $section-title;
  }

  &-subtitle {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'zero' on;
    color: $secondary;
  }

  &.gate {
    .icon-title_wrapper {
      justify-content: space-between;

      .section_wrapper-title {
        gap: 8px;
      }
    }

    .custom-condition-select {
      height: 24px;

      .arrow {
        top: 9px;
      }
    }

    .custom-condition-select .selected {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 3px 4px 3px 8px;
    }
  }
}
</style>