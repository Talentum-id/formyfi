<template>
    <div class="payments-block mx-auto max-w-[400px]">
        <div class="payments-block__image" v-if="nftImage">
            <CustomImage :src="nftImage" alt="payments-block" />
        </div>
        <div class="payments-block__title">Want to make a purchase?</div>
        <div class="payments-block__description">
            You need to connect your wallet and then mint the NFT This is how the purchase process will be completed
        </div>
        <div class="payments-block__title my-4">Price: {{ answer.payment.collection.price }}
            {{ currencySymbol }}</div>

        <div class="payments-block__connect">
            <SocialConnect :data="data" class="cursor-pointer" @click="mintNFT" />
        </div>
    </div>
</template>

<script setup>
import SocialConnect from '@/components/Creating/SocialConnect.vue';
import { ref, computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { switchNetwork, mint } from '@/web3/nft';
import { useZkLogin } from '@/composables/useZkLogin';
const { mintSuiNft } = useZkLogin();
import { chains } from '@/web3/nft';
import { readFile } from '@/util/helpers';
import { onMounted } from 'vue';
import CustomImage from '@/components/CustomImage.vue';

const data = ref({
    icon: 'NFT-Default',
    title: 'Mint NFT',
});
const nftImage = ref(null);

const props = defineProps({
    answer: {
        type: Object,
        required: true,
    },
    chains: {
        type: Array,
        required: true
    },
    preview: {
        type: Boolean,
        default: false
    }
});

const currencySymbol = computed(() => {
    return chains.find(chain => chain.id === Number(props.answer.payment.collection.blockchain_id))?.nativeCurrency.symbol
});

onMounted(async () => {
    nftImage.value = await readFile(props.answer.payment.collection.file?.[0]);
});
const mintNFT = async () => {
    if (props.preview) {
        return;
    }
    const chainID = Number(props.answer.payment.collection.blockchain_id)
    try {
        if (chainID === 101) {
            await mintSuiNft(props.answer.payment.collection);
        } else {
            await switchNetwork(chainID);
            await mint(props.answer.payment.collection);
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped lang="scss">
.payments-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;

    .payments-block__title {
        font-size: 16;
        font-weight: 600;
        color: $section-title;
    }

    .payments-block__description {
        font-size: 12;
        color: $secondary;
        text-align: center;
    }

    .payments-block__connect {
        display: flex;
        gap: 16px;
    }
}
</style>
