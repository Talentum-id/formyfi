<template>
    <div class="payments-block mx-auto max-w-[400px]" v-if="nft">
        <div class="payments-block__image" v-if="image">
            <CustomImage :image="image" alt="payments-block" height="160" width="160" />
        </div>
        <div class="payments-block__title">Want to make a purchase?</div>
        <div class="payments-block__description">
            You need to connect your wallet and then mint the NFT This is how the purchase process will be completed
        </div>
        <div class="payments-block__title my-4">Price: {{ props.preview ? props.answer.payment.price :
            answer.payment?.[0].price }}
            {{ currencySymbol }}</div>

        <div class="payments-block__connect" v-if="!isMinted">
            <SocialConnect :data="data" class="cursor-pointer" @click="mintNFT" />
        </div>
    </div>
    <Alert message="Success" type="success" v-if="showSuccess"></Alert>
</template>

<script setup>
import SocialConnect from '@/components/Creating/SocialConnect.vue';
import { ref, computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { switchNetwork, mint } from '@/web3/nft';
import { useZkLogin } from '@/composables/useZkLogin';
const { mintSuiNft, getTxData } = useZkLogin();
import { chains } from '@/web3/nft';
import { readFile } from '@/util/helpers';
import { onMounted } from 'vue';
import CustomImage from '@/components/CustomImage.vue';
import { useCollectionsStore } from '@/store/collections';
import { modal } from '@/mixins/modal';
import Alert from '@/components/Alert.vue';
const data = ref({
    icon: 'NFT-Default',
    title: 'Mint NFT',
});
const emit = defineEmits(['minted']);
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
    return chains.find(chain => chain.id === Number(nft.value.blockchain_id))?.nativeCurrency.symbol
});
const showSuccess = ref(false);
const nft = ref(null);
const image = ref(null);
const isMinted = ref(false);
onMounted(async () => {
    if (props.preview) {
        const nft_id = Number(props.answer.payment.nft_id);
        nft.value = await useCollectionsStore().getNft(nft_id);
        image.value = await readFile(nft.value.file?.[0]);
    } else {
        const nft_id = Number(props.answer.payment?.[0].nft_id);
        nft.value = await useCollectionsStore().getNft(nft_id);
        image.value = await readFile(nft.value.file?.[0]);
        const res = await useCollectionsStore().checkIdentityNftRelation(Number(nft.value.id));
        if (res) {
            isMinted.value = true;
            emit('minted');
        }
    }

});

const mintNFT = async () => {
    if (props.preview) {
        return;
    }

    if (nft.value.available < 1) {
        return;
    }

    const chainID = Number(nft.value.blockchain_id)
    try {
        let tx;
        await modal.emit('openModal', {
            title: 'Loading...',
            message: 'Please wait for a while',
            type: 'loading',
        });
        if (chainID === 101) {
            await mintSuiNft({ ...nft.value, price: Number(props.answer.payment?.[0].price) });
            tx = await getTxData();
        } else {
            await switchNetwork(chainID);
            tx = await mint({ ...nft.value, price: Number(props.answer.payment?.[0].price) });
        }

        useCollectionsStore().storeIdentityNftRelation({
            nft_id: Number(nft.value.id),
            hash: tx.hash,
        });
        isMinted.value = true;
        emit('minted');
        showSuccess.value = true;
        setTimeout(() => {
            showSuccess.value = false;
        }, 3000);
    } catch (error) {
        console.error(error);
    } finally {
        modal.emit('closeModal');
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
