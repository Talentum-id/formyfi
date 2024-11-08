<template>
  <Default>
    <div class="profile" v-if="user">
      <BannerUploader :banner="user.bannerUri" />
      <div class="naming w-full">
        <AvatarUploader :avatar="user.avatarUri" />
        <div class="info">
          <InputName v-model="name" :placeholder="user.username" @input="setName()" />
        </div>
      </div>
      <div class="info-block">
        <div class="content">
          <div class="info-cards">
            <StatCardSmall
              @click="router.push('my-responses')"
              title="Forms Completed"
              icon="Tasks"
              :value="stats.forms_completed"
            />
            <StatCardSmall
              title="Forms Created"
              icon="Tik-Tik"
              :value="stats.forms_created"
              @click="router.push('/')"
            />
          </div>
          <div class="container">
            <span>Role</span>
            <Badge text="User" type="claim" transparent />
          </div>
          <div class="container">
            <span>Pricing Plan</span>
            <Badge text="Free" type="claim" transparent />
          </div>
          <div class="flex gap-2 is-text flex-wrap">
            <SocialTag
              v-for="connector in socialButtons"
              :data="connector"
              @connect="connector.fn()"
              @remove="connector.rm()"
              :key="connector.id"
            />
            <div v-show="false" class="w-0 h-0">
              <WalletMultiButton />
            </div>
            <GoogleLogin
              v-if="!getExtraIdentity('google')"
              ref="googleLogin"
              :callback="callback"
              :buttonConfig="{
                scope: 'profile email',
                width: 240,
                height: 37,
              }"
            />
          </div>
        </div>
        <div class="sidebar">
          <div class="points">
            <span>Points</span> <span> {{ stats.points ?? 0 }} QP</span>
          </div>
        </div>
      </div>
    </div>
  </Default>
  <Alert :message="error" type="error" v-if="error.trim().length > 0" />
</template>
<script setup>
import BannerUploader from '@/components/Profile/BannerUploader.vue';
import AvatarUploader from '@/components/Profile/AvatarUploader.vue';
import InputName from '@/components/Profile/InputName.vue';
import { ref, computed, onMounted, watch } from 'vue';
import Default from '@/layouts/default.vue';
import Badge from '@/components/Badge.vue';
import StatCardSmall from '@/components/StatCards/StatCardSmall.vue';
import { useAuthStore } from '@/store/auth';
import { useDebounceFn } from '@vueuse/core';
import { useStatsStore } from '@/store/stats';
import Alert from '@/components/Alert.vue';
import { useRouter } from 'vue-router';
import SocialTag from '@/components/Profile/SocialTag.vue';
import { useAccount, useChainId, useConnect, useDisconnect, useSignMessage } from '@wagmi/vue';
import { config } from '@/wagmi.config';
import { siweConnectors } from '@/constants/siweConnectors';
const { connect, connectors } = useConnect();
const { address, isConnected } = useAccount();
const { signMessageAsync } = useSignMessage({ config });
const chainId = useChainId();
const { disconnect } = useDisconnect();
import dfinityIcon from '@/assets/images/dfinity.svg';
import { useWallet, WalletMultiButton } from 'solana-wallets-vue';
import { GoogleLogin } from 'vue3-google-login';
import bs58 from 'bs58';
import { shortenAddress } from '@/util/helpers';

const authStore = useAuthStore();
const statsStore = useStatsStore();

const router = useRouter();

const stats = computed(() => statsStore.getStatistics);
const user = computed(() => authStore.getProfileData);
const { connected, publicKey, wallet: solanaWallet } = useWallet();

let name = ref('');
const error = ref('');

onMounted(async () => {
  disconnect();
  await statsStore.findStatistics();
});
function triggerClick() {
  document.querySelector('.swv-button-trigger').click();
}
const setName = useDebounceFn(async () => {
  const validatedName = name.value.trim().toLowerCase();
  const alphaNumericWithDot = /^[a-zA-Z0-9.]+$/;

  if (validatedName.length < 4 || validatedName.length > 18) {
    error.value = 'Username should have from 4 to 18 characters';

    return;
  }

  if (!alphaNumericWithDot.test(validatedName)) {
    error.value = 'Username can only consist of alphanumeric characters and dot';
  } else {
    error.value = '';
    name.value = validatedName;

    await authStore.saveProfile({
      fullName: user.value.fullName,
      username: name.value,
      avatar: user.value.avatar,
      banner: user.value.banner,
      forms_created: user.value.forms_created,
    });

    await authStore.getProfile();
  }

  setTimeout(() => (error.value = ''), 3000);
}, 2500);

const filteredConnectors = computed(() => {
  return connectors.filter(
    ({ name, icon }) => siweConnectors.indexOf(name) !== -1 && icon !== null && icon !== undefined,
  );
});
const getExtraIdentities = computed(() => useAuthStore().getExtraIdentities);

const getExtraIdentity = (provider) => {
  return getExtraIdentities.value.find((identity) => identity.connector === provider);
};
const currentConnector = ref('');
const socialButtons = computed(
  () =>
    [
      ...filteredConnectors.value.map((connector) => {
        return {
          id: connector.id,
          icon: connector.icon,
          status: getExtraIdentity(connector.name),
          name: connector.name,
          value: getExtraIdentity(connector.name)
            ? shortenAddress(getExtraIdentity(connector.name).title)
            : false,
          fn: () => {
            connect({ connector, chainId });
            currentConnector.value = connector.name;
          },
          rm: () => removeProvider(getExtraIdentity(connector.name)),
        };
      }),
      // {
      //   id: 1,
      //   icon: dfinityIcon,
      //   status: getExtraIdentity('ii'),
      //   name: 'Internet Identity',
      //   value: getExtraIdentity('ii') ? shortenAddress(getExtraIdentity('ii').title) : false,
      //   fn: () => authStore.loginWithII(true),
      //   rm: () => removeProvider(getExtraIdentity('ii')),
      // },
      {
        id: 2,
        icon: 'Wallet-Default',
        status: !!getExtraIdentity('siws'),
        name: 'Solana Wallets',
        value: getExtraIdentity('siws') ? shortenAddress(getExtraIdentity('siws').title) : false,
        fn: () => triggerClick(),
        rm: () => removeProvider(getExtraIdentity('siws')),
      },
      getExtraIdentity('google') && {
        id: 3,
        icon: 'Google',
        status: !!getExtraIdentity('google'),
        name: 'Google',
        value: getExtraIdentity('google') ? getExtraIdentity('google').title : false,
        fn: () => {},
        rm: () => removeProvider(getExtraIdentity('google')),
      },
    ].filter((item) => item),
  { dependsOn: [getExtraIdentities] },
);
watch(
  isConnected,
  async (value) => {
    if (value) {
      const message = await authStore.prepareSIWELogin(address.value);
      if (message === null) {
        await disconnect();
      } else {
        await signMessageAsync({ message }).then(
          async (signature) =>
            await authStore.loginWithSIWE(address.value, signature, currentConnector.value),
        );
      }
    }
  },
  {
    immediate: true,
  },
);

watch(
  connected,
  async (value) => {
    try {
      if (value) {
        const walletAddress = publicKey.value.toBase58();
        let siwsMessage = await authStore.prepareSIWSLogin(walletAddress);

        const encodedMessage = new TextEncoder().encode(
          `${siwsMessage.domain} wants you to sign in with your Solana account:\n` +
            `${siwsMessage.address}\n\n` +
            `${siwsMessage.statement}\n\n` +
            `URI: ${siwsMessage.uri}\n` +
            `Version: ${siwsMessage.version}\n` +
            `Chain ID: ${siwsMessage.chain_id}\n` +
            `Nonce: ${siwsMessage.nonce}\n` +
            `Issued At: ${new Date(Number(siwsMessage.issued_at / 1_000_000n)).toISOString()}\n` +
            `Expiration Time: ${new Date(Number(siwsMessage.expiration_time / 1_000_000n)).toISOString()}`,
        );

        const signature = await solanaWallet.value.adapter.signMessage(encodedMessage);

        await authStore
          .loginWithSIWS(walletAddress, bs58.encode(signature), 'siws')
          .catch((e) => console.error(e));
      }
    } catch {}
  },
  {
    immediate: true,
  },
);

const callback = async (response) => {
  await useAuthStore().loginWithGoogle(response.credential, 'google');
};

const removeProvider = async (provider) => {
  await useAuthStore().removeExtraIdentity(provider);
};
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  .naming {
    margin-top: 140px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info {
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 80px;
    gap: 40px;
    .sidebar {
      min-width: 360px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      .points {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 24px;
        padding: 24px;
        background: $white;
        border: 1px solid $default-border;
        border-radius: 16px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      min-width: 760px;
      width: 100%;
      gap: 24px;
      padding: 24px;
      background: $white;
      border: 1px solid $default-border;
      border-radius: 16px;
      .info-cards {
        display: flex;
        gap: 16px;
      }
      .container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }
  }
}
</style>
