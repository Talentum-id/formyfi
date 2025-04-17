<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <Select class="w-1/2" :options="collections" @input="collection = $event" selectedStyle="h-10" />
            <BaseButton text="Create NFT Collection" @click="createCollection" />
        </div>
        <div v-if="collection" class="flex flex-col gap-1">
            <span class="title">Mint price</span>
            <span class="description">Choose a price for your NFT</span>
            <div class="flex h-10 rounded-lg overflow-hidden w-60 border border-[#DAD9F7] mt-1">
                <input v-model="amount" type="number" :placeholder="100"
                    class="w-full py-2 px-3 text-lg bg-white outline-none" />
                <div class="flex items-center justify-center bg-[#D7DCE5] px-6">
                    <span class="text-black font-medium">{{ collection.chain.nativeCurrency.symbol }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Select from '@/components/Select.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ref, watch } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useRouter } from 'vue-router';
import { chains } from '@/web3/nft';
const router = useRouter();
const amount = ref('');
const collection = ref(null);
const collections = ref([]);
const emit = defineEmits(['input']);
const createCollection = () => {
    router.push('/collections');
}
// Mock data generator
const generateMockCollections = (count = 10) => {
    const mockProjects = [
        { name: 'CryptoPunks', logo: defaultBg },
        { name: 'Bored Ape Yacht Club', logo: defaultBg },
        { name: 'Art Blocks', logo: defaultBg },
        { name: 'Doodles', logo: defaultBg },
        { name: 'Azuki', logo: defaultBg },
    ];

    collections.value = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Collection ${index + 1}`,
        project: mockProjects[Math.floor(Math.random() * mockProjects.length)],
        max_supply: Math.floor(Math.random() * 10000),
        unlimited_supply: Math.random() > 0.7,
        available: Math.floor(Math.random() * 5000),
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
        chain: chains[Math.floor(Math.random() * 4)],
    }));
};

generateMockCollections();

watch(amount, (amount) => {
    if (!amount) {
        amount = 0;
    }
    emit('input', { collection: { price: amount, ...collection.value } });
});
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
