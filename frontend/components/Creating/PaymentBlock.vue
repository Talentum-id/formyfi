<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <Select class="w-1/2" :options="options" @input="collection = $event" selectedStyle="h-10" />
            <BaseButton text="Create NFT Collection" @click="createCollection" />
        </div>
        <div v-if="collection && !props.isReward && chainSymbol" class="flex flex-col gap-1">
            <span class="title">Mint price</span>
            <span class="description">Choose a price for your NFT</span>
            <div class="flex h-10 rounded-lg overflow-hidden w-60 border border-[#DAD9F7] mt-1">
                <input v-model="amount" type="number" :placeholder="100"
                    class="w-full py-2 px-3 text-lg bg-white outline-none" />
                <div class="flex items-center justify-center bg-[#D7DCE5] px-6">
                    <span class="text-black font-medium">{{ chainSymbol }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Select from '@/components/Select.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ref, watch, computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useRouter } from 'vue-router';
import { chains } from '@/web3/nft';
import { useCollectionsStore } from '@/store/collections';

const router = useRouter();
const amount = ref('1');
const collection = ref(null);
const emit = defineEmits(['input']);
const createCollection = () => {
    router.push('/collections');
}

const props = defineProps({
    isReward: {
        type: Boolean,
        default: false,
    },
});


const collections = computed(() => useCollectionsStore().getList);
const chainSymbol = computed(() => {
    if (!collection.value?.blockchain_id) return '';
    return chains.find(chain => chain.id === Number(collection.value.blockchain_id))?.nativeCurrency.symbol || '';
});

const options = computed(() => {
    if (collections.value?.data?.length > 0) {
        const options = collections.value?.data?.map(item => ({ name: item.name, file: item.file, label: item.name, value: Number(item.id), id: Number(item.id), blockchain_id: Number(item.blockchain_id) })) || [{ name: 'No collections', file: null, label: 'No collections', value: 0, id: 0, blockchain_id: 0 }];
        return options;
    } else {
        return [{ name: 'No collections', file: null, label: 'No collections', value: 0, id: 0, blockchain_id: 0 }];
    }
});

watch(amount, (amount) => {
    if (!amount) {
        amount = 0;
    }
    emit('input', { price: amount, nft_id: collection.value?.id });
});
watch(collection, (newCollection) => {
    if (!props.isReward) {
        emit('input', { price: amount.value, nft_id: newCollection });
    } else {
        emit('input', newCollection.id);
    }
}, { deep: true });

watch(props.isReward, (isReward) => {
    if (isReward) {
        emit('input', Number(collection.value?.id));
    }
}, { immediate: true });

</script>
<style scoped lang="scss">
.description {
    font-family: $default_font;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 133.333%;
    cursor: default;
    color: #6a6d8f;
}

.title {
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

/* Remove number input spinners */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
}
</style>
