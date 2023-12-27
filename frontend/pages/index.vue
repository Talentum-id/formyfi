<template>
  <Default>
    <div class="content">
      <div class="header">
        <h1 class="title">Q&A Forms</h1>
        <div class="contollers">
          <InputWithSearch placeholder="Find a Form..." :iconSize="24" />
          <CreateQA></CreateQA>
        </div>
      </div>
      <div class="actions">
        <div class="sort">
          <span>Sort by:</span>
          <Select
            :options="[{ name: 123, id: 1 }]"
            scrollHorizontalHidden
            class="select"
            :stringLengthSelected="16"
            :string-length="14"
          ></Select>
        </div>
        <button class="export-btn">
          <span>Export as pdf</span>
          <img :src="downloadIcon" alt="" />
        </button>
      </div>

      <CollapseTable
        :columns="requestsColumns"
        :rows="requestsRows"
        is-sorting
        pointer
        title="You have no wallet requests"
        icon="icons8-futurama-bender"
      />
      <Pagination v-if="requestsRows && requestsRows.length" :currentPage="1" :totalPages="5" />
    </div>
  </Default>
</template>
<script setup>
import Default from '@/layouts/default.vue';
import CollapseTable from '@/components/Table/CollapseTable.vue';
import { computed } from 'vue';
import Badge from '@/components/Badge.vue';
import BaseButton from '@/components/BaseButton.vue';
import InputWithSearch from '@/components/Table/InputWithSearch.vue';
import Link from '@/components/Table/Link.vue';
import Wallet from '@/components/Table/Wallet.vue';
import NumberOfEl from '@/components/Table/NumberOfEl.vue';
import Text from '@/components/Table/Text.vue';
import Select from '@/components/Select.vue';
import downloadIcon from '@/assets/icons/Download.svg';
import Pagination from '@/components/Table/Pagination.vue';
import CreateQA from '@/components/Creating/CreateQA.vue';

const requestsColumns = computed(() => {
  return [
    { prop: 'title', label: 'Title', width: '100%' },
    { prop: 'link', label: 'Share Link', width: '60%' },
    {
      prop: 'amount',
      label: 'Participants',
      width: '50%',
    },
    { prop: 'period', label: 'Started/Filled', width: '70%' },
    { prop: 'end', label: 'End', width: '70%' },
    { prop: 'btns', label: '', width: '30%' },
  ];
});

const requestsRows = computed(
  () => {
    const originalArray = [1, 2, 3, 5];
    const wallets = originalArray.map((el, i) => {
      return {
        component: Wallet,
        props: {
          text: '0xf30c...de18',
        },
        id: i,
      };
    });
    const numbers = originalArray.map((el, i) => {
      return {
        component: NumberOfEl,
        props: {
          text: i + 1,
        },
        id: i,
      };
    });
    const dates = originalArray.map((el, i) => {
      return {
        component: Badge,
        props: {
          text: 'Jan 12, 2024 ',
        },
        id: i,
      };
    });
    return originalArray.map((item, i) => ({
      title: {
        singleComponent: {
          component: Text,
          props: {
            text: `The Q&A for the Starforged Blad #${i + 1}`,
          },
        },
        components: numbers,
      },
      link: {
        component: Link,
        props: {
          text: `qa-question-${i + 18}`,
          value: '',
        },
      },
      amount: {
        singleComponent: {
          component: Badge,
          props: {
            text: `${Math.floor(Math.random() * (100 - 10 + 1) + 10)} users `,
            value: '',
            type: 'claim',
            big: false,
          },
        },
        components: wallets,
      },
      period: {
        singleComponent: {
          component: Badge,
          props: {
            text: 'Jan 12, 2024 ',
            value: '',
            type: 'claim',
            big: false,
          },
        },
        components: dates,
      },
      end: {
        component: Badge,
        props: {
          text: 'Jan 12, 2025 ',
          value: '',
          type: 'claim',
          big: false,
        },
      },
    }));
  },
  { deep: true },
);
</script>
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: $primary-text;
    font-variant-numeric: slashed-zero;
    font-family: $default_font;
    font-size: 56px;
    font-style: normal;
    font-weight: 500;
    line-height: 72px; /* 128.571% */
  }
  .contollers {
    display: flex;
    align-items: center;
    gap: 24px;
  }
}
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 28px;
  gap: 8px;
  .sort {
    display: flex;
    align-items: center;
    gap: 8px;
    span {
      color: #667085;
      font-variant-numeric: slashed-zero;
      font-family: Basis Grotesque Pro;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }
    .select {
      width: 130px;
    }
  }

  .export-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    cursor: pointer;
    padding: 4px 8px;
    height: fit-content;
    border: none;
    width: fit-content;
    background: transparent;
    span {
      color: $default;
      font-variant-numeric: slashed-zero;
      font-family: $default_font;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
    &:hover {
      border-radius: 8px;
      background: $default-badge-border;
    }
  }
}
</style>
