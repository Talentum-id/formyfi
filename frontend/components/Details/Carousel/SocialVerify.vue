<template>
  <div class="action-button flex h-10">
    <div class="flex py-2 px-4 w-4/5 gap-2 items-center" @click="navigate()">
      <Icon :name="socialIcon" class="icon-soc" :size="24" />
      <div class="cursor-pointer">{{ title }}</div>
    </div>
    <div class="w-[1px] bg-white h-10"></div>
    <div class="py-2 px-4 w-full text-center cursor-pointer" @click="verify">
      <span v-if="!loading && !isCompleted && !verified && counter === 0"> Verify </span>
      <span v-else-if="loading"> . . . </span>
      <span class="" v-else-if="verified || isCompleted">
        <Icon class="checked-icon" name="Tik" :size="24" />
      </span>
      <span v-else class="text-bold">
        {{ counter }}
      </span>
    </div>
  </div>
</template>
<script setup>
import Icon from '@/components/Icons/Icon.vue';
import axiosService from '@/services/axiosService';
import { ref } from 'vue';
import { checkIsUri } from '@/util/helpers';

const emits = defineEmits(['verify']);

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  socialIcon: {
    type: String,
    default: 'twitter',
  },
  verified: {
    default: false,
    type: Boolean,
  },
});

const counter = ref(0);
const loading = ref(false);
const isCompleted = ref(false);

const navigate = () => {
  const { action, actionType, provider } = props;

  if (action === 'follow' && provider === 'twitter') {
    window.open(`https://x.com/${actionType}`, '_blank');
  }

  if (checkIsUri(actionType)) {
    window.open(actionType, '_blank');
  }
};
const verify = () => {
  if (loading.value || isCompleted.value || counter.value !== 0) {
    return;
  }

  loading.value = true;

  axiosService
    .post(`${process.env.API_URL}social-verification/${props.provider}`, {
      provider_id: props.providerId,
      action: props.action,
      source: props.actionType,
    })
    .then(({ data }) => {
      isCompleted.value = data.result;

      if (!isCompleted.value) {
        counter.value = 10;
        const intervalId = setInterval(() => {
          counter.value--;

          if (counter.value === 0) {
            clearInterval(intervalId);
          }
        }, 1000);
      } else {
        emits('verify');
      }
    })
    .catch((e) => {
      console.error(e);

      counter.value = 10;
      const intervalId = setInterval(() => {
        counter.value--;

        if (counter.value === 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    })
    .finally(() => (loading.value = false));
};
</script>
<style scoped lang="scss">
.action-button {
  font-family: $default_font;
  width: 100%;
  border-radius: 8px;
  background: $default-border;
  color: $default;
}

.icon-soc {
  filter: invert(53%) sepia(72%) saturate(81%) hue-rotate(0) brightness(225%) contrast(254%) !important;
}
</style>
