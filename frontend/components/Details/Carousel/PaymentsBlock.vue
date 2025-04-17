<template>
    <div class="payments-block mx-auto max-w-[400px]">
        <div class="payments-block__image">
            <img :src="defaultBg" alt="payments-block" />
        </div>
        <div class="payments-block__title">Want to make a purchase?</div>
        <div class="payments-block__description">
            You need to connect your wallet and then mint the NFT This is how the purchase process will be completed
        </div>
        <div class="payments-block__connect">
            <SocialConnect :data="data" class="cursor-pointer" @click="connectWallet" />
        </div>
    </div>
</template>

<script setup>
import SocialConnect from '@/components/Creating/SocialConnect.vue';
import { ref } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { switchNetwork, mint } from '@/web3/nft';
const data = ref({
    icon: 'NFT-Default',
    title: 'Mint NFT',
});

const props = defineProps({
    answer: {
        type: Object,
        required: true,
    },
});

const connectWallet = async () => {
    console.log(props.answer.payment);
    try {
        await switchNetwork(props.answer.payment.collection.chain.id);
        await mint(props.answer.payment.collection);
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
