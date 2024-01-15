<template>
  <div class="layout">
    <div class="slider">
      <div class="first-empty"></div>
      <div class="item">Previous Task in the Quest is Сompleted</div>
      <div class="main">
        <div class="close" @click="$emit('close')"><Icon name="Cancel" :size="24"></Icon></div>
        <div class="current-item">
          <div class="flex flex-col gap-y-[24px]">
            <div class="counter w-full">
              <div
                class="count"
                v-for="(i, idx) in length"
                :key="i"
                :class="{ active: idx === 0 }"
              ></div>
            </div>
            <div class="counter-title">Quiz 1/{{ length }}</div>
            <div class="question-title">{{ currentItem.question }}</div>
            <div class="answers">
              <div v-for="i in 4" class="answer">{{ i }}</div>
            </div>
          </div>
          <div class="controllers">
            <BaseButton type="primary"> Previous</BaseButton>
            <BaseButton text="Next" type="normal" />
          </div>
        </div>
      </div>
      <div class="item">Previous Task in the Quest is Сompleted</div>
      <div class="last-empty"></div>
    </div>
  </div>
</template>
<script setup>
import Icon from '@/components/Icons/Icon.vue';
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
  previousItem: {
    type: Object,
    default: () => {},
  },
  nextItem: {
    type: Object,
    default: () => {},
  },
  length: {
    type: Number,
    default: 1,
  },
});
</script>
<style lang="scss">
.layout {
  background: rgba(26, 29, 41, 0.4);
  backdrop-filter: blur(16px);
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  overflow: hidden;
  .slider {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 696px;
    position: relative;
    height: 100%;
    padding: 18px 0;

    .first-empty {
      width: 696px;
      position: absolute;
      height: 12px;
      top: 0;
      border-radius: 0 0 16px 16px;
      background: #d7dce5;
    }
    .last-empty {
      width: 696px;
      position: absolute;
      height: 12px;
      bottom: 0;
      border-radius: 16px 16px 0 0;
      background: #d7dce5;
    }
    .item {
      display: flex;
      width: 100%;
      padding: 16px 24px;
      align-items: center;
      gap: 24px;
      color: #667085;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: $default_font;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      border-radius: 16px;
      background: #d7dce5;
    }
    .main {
      height: 100%;
      position: relative;
      .close {
        display: flex;
        padding: 8px;
        align-items: flex-start;
        gap: 10px;
        position: absolute;
        right: -40px;
        top: -40px;
        border-radius: 24px;
        background: #f5f7fa;
        height: 40px;
        width: 40px;
        cursor: pointer;
      }
      .current-item {
        display: flex;
        width: 720px;
        height: 100%;
        padding: 40px;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        border-radius: 16px;
        background: #f5f7fa;

        .counter {
          display: flex;
          padding-top: 4px;
          align-items: flex-start;
          gap: 2px;
          height: fit-content;
          .count {
            height: 4px;
            width: 100%;
            border-radius: 4px;
            background: #d7dce5;
          }
          .active {
            background: #344054;
          }
        }
        .counter-title {
          color: #a5acbb;
          text-align: center;
          font-variant-numeric: lining-nums tabular-nums slashed-zero;
          font-family: $default_font;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px; /* 150% */
        }
        .question-title {
          color: #161e2d;
          text-align: center;
          font-variant-numeric: slashed-zero;
          font-family: $default_font;
          font-size: 32px;
          font-style: normal;
          font-weight: 500;
          line-height: 40px; /* 125% */
        }
        .answers {
          min-height: 234px;
          display: flex;
          width: 320px;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          .answer {
          }
        }
        .controllers {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          div {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>
