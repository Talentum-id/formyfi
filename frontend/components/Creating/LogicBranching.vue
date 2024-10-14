<template>
  <div ref="targetBranches" class="flex flex-col gap-4">
    <div class="flex flex-col gap-8" v-for="(branch, idx) in branches" :key="idx">
      <div
        class="p-2 rounded-lg flex justify-between relative bg-[#E9ECF2] border border-[#d7dce5]"
        @click="branch.open = !branch.open"
      >
        <div class="relative flex gap-2 w-fit">
          <div class="arrow" :class="`${branch.open && 'flipped'}`"></div>
          <div class="w-full ml-8 text-[#38405B] text-lg">Logic {{ idx + 1 }}</div>
        </div>
        <img
          src="@/assets/icons/delete.svg"
          @click="deleteBranch(idx)"
          alt=""
          class="cursor-pointer"
          :class="{ 'blur-custom': branches.length === 1 }"
        />
      </div>
      <div v-if="branch.open" class="flex flex-col gap-8">
        <div class="flex flex-col gap-3">
          <div class="title">When</div>
          <Select :options="questsList" @input="branch.data.quest = $event" :tabindex="1" />
          <Select
            :default="getListByType(branch.data.quest.type)[0]"
            :options="getListByType(branch.data.quest.type)"
            @input="branch.data.type = $event"
            :tabindex="2"
          />
          <div
            v-if="branch.data.type.name !== 'is not empty' && branch.data.type.name !== 'is empty'"
          >
            <MultiSelect
              v-if="branch.data.quest.type === 'multiple'"
              :options="questsAnswers(branch.data.quest)"
              @input="branch.data.choice = $event"
              :tabindex="3"
            />
            <Select
              v-if="branch.data.quest.type === 'rate'"
              :options="questsRates(branch.data.quest)"
              @input="branch.data.choice = $event"
              :tabindex="3"
            />
            <Select
              v-if="branch.data.quest.type === 'quiz'"
              :options="questsAnswers(branch.data.quest)"
              @input="branch.data.choice = $event"
              :tabindex="3"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <div class="title">Then</div>
            <div class="subtitle">Show this question</div>
          </div>
          <Select
            :default="questsList[1]"
            :options="questsList"
            @input="branch.data.step = $event"
          />
        </div>
      </div>
    </div>
    <div class="add-talent-btn" @click="addBranch">
      <img src="@/assets/icons/add.svg" alt="" />
      <span>Add Branch</span>
    </div>
  </div>
</template>
<script setup>
import { useFocusWithin } from '@vueuse/core';

import { computed, ref, watch } from 'vue';
import Select from '@/components/Select.vue';
import { getListByType } from '@/constants/branchTypes';
import MultiSelect from '@/components/Creating/MultiSelectBase.vue';

const targetBranches = ref();

const { focused } = useFocusWithin(targetBranches);
const emit = defineEmits(['input']);

const open = ref(false);
const props = defineProps({
  quests: {
    type: Object,
    default: null,
  },
});

const questsList = computed(() =>
  props.quests.map((item, index) => {
    return { id: index, name: item.question, type: item.type?.type };
  }),
);

const questsAnswers = (quest) => {
  return props.quests
    .find((item) => item.question === quest?.name)
    ?.answers.map((answer, index) => {
      return { id: index, name: answer.answer };
    })
    .filter((item) => item.name);
};

const questsRates = (quest) => {
  const currentQuest = props.quests.find((item) => item.question === quest?.name);
  return Array.from({ length: currentQuest?.parameters?.max }, (_, index) => index).map((rate) => {
    return { id: rate, name: rate + 1 };
  });
};
const branches = ref([
  {
    open: false,
    data: {
      quest: questsList?.value[0],
      type: getListByType('open')[0],
      choice: [],
      step: questsList?.value[1],
    },
  },
]);

const addBranch = () => {
  branches.value.push({
    open: false,
    data: {
      quest: questsList?.value[0],
      type: getListByType('open')[0],
      choice: [],
      step: questsList?.value[1],
    },
  });
};

watch(focused, (focused) => {
  const data = branches.value.map((branch) => {
    return {
      quest: branch.data.quest.name,
      type: branch.data.type.name,
      choice: branch.data.choice,
      step: branch.data.step.name,
    };
  });
  if (!focused) {
    emit('input', JSON.stringify(data));
  }
});

const deleteBranch = (index) => {
  if (branches.value.length > 1) {
    branches.value.splice(index, 1);
  }
};
</script>
<style scoped lang="scss">
.arrow {
  position: absolute;
  content: '';
  top: 12px;
  width: 12px;
  height: 7px;
  left: 5px;
  border: none;
  transition: transform 0.2s;
  transform: rotate(270deg);
  background: url('@/assets/images/select.svg') no-repeat;
}

.arrow.flipped {
  transform: rotate(0deg);
}

.add-talent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  background: #e9ecf2;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;

  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}

.title {
  color: $section-title;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.subtitle {
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
</style>
