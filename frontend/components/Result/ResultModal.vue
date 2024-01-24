<script setup>
import BaseModal from '@/components/BaseModal.vue';
import Icon from '@/components/Icons/Icon.vue';
import Badge from '@/components/Badge.vue';
import Variant from '@/components/Result/Variant.vue';
import Link from '@/components/Table/Link.vue';

defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    class="modal"
    visible
    btnLeft
    @close="$emit('close')"
  >
    <div class="result-wrapper">
      <div class="header">
        <div class="head-title">
          <span>Responses to Q&A for the ...</span>
          <div class="controller">
            <div class="switch">
              <Icon name="Left" :size="24" @click="$emit('prev')"></Icon>
            </div>
            <div class="switch">
              <Icon name="Right" :size="24" @click="$emit('next')"></Icon>
            </div>
          </div>
        </div>
        <div class="title">Chronicles of the Astral Adventurers The Isle of the Eclipsed Sun</div>
        <div class="data">
          <div>From <Link text="teststata"></Link></div>
          <div>Filled <Badge text="gacxzcxzcxy" type="claim"></Badge></div>
        </div>
      </div>
      <div class="flex flex-col w-full gap-[16px] mt-[32px]">
        <div class="card" v-for="i in 3" :key="i">
          <div class="head">
            <div class="step">{{ i }}/3</div>
            <div class="required">Required</div>
          </div>
          <div class="w-full flex justify-center">
            <img src="" alt="image" />
          </div>
          <span class="title">Which of the following actions can lead to an NFT hack?</span>
          <div class="flex flex-col gap-[16px] w-full">
            <Variant v-for="i in 4" :key="i" text="test" :is-correct="i === 1"></Variant>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.result-wrapper {
  font-family: $default_font;
  padding: 40px;
  .header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .head-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: $default;
        font-variant-numeric: slashed-zero;
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: 40px; /* 125% */
      }
      .controller {
        display: flex;
        gap: 8px;
        align-items: center;
        .switch {
          display: flex;
          width: 32px;
          height: 32px;
          padding: 4px;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          background: $default-badge-border;
          cursor: pointer;
        }
      }
    }
    .title {
      color: $blue;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    .data {
      display: flex;
      align-items: center;
      gap: 24px;
      div {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a5acbb;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.168px;
      }
    }
  }
  .card {
    border-radius: 16px;
    width: 100%;
    height: 100%;
    border: 1px solid $default-border;
    background: $white;
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .step {
        color: #a5acbb;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
      }
      .required {
        color: $error-border;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.168px;
      }
    }
    .title {
      color: $primary-text;
      font-variant-numeric: slashed-zero;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    img {
      text-align: center;
      width: 120px;
      height: 120px;
      border-radius: 8px;
    }
  }
}
</style>