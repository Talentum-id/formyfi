<script setup>
import AuthButton from '@/components/Auth/AuthButton.vue';
import axiosService from '@/services/axiosService';
import { useAuthStore } from '@/store/auth';
import { GoogleLogin, googleLogout } from 'vue3-google-login';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import bs58 from 'bs58';
import { useConnect, useChainId, useAccount, useDisconnect, useSignMessage } from '@wagmi/vue';
import { config } from '@/wagmi.config';
import { siweConnectors } from '@/constants/siweConnectors';
import { WalletMultiButton, useWallet } from 'solana-wallets-vue';
import { useSuiWallet } from '@/composables/useSuiWallet';
import { useZkLogin } from '@/composables/useZkLogin';

const authStore = useAuthStore();
const { connected, publicKey, wallet: solanaWallet } = useWallet();
const { connectSuiet, connectSui, getGlobalAddress } = useSuiWallet();

const { connect, connectors } = useConnect();
const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();
const { signMessageAsync } = useSignMessage({ config });
const chainId = useChainId();
const route = useRoute();
const { connectZkLogin, zkLoginAuthorize } = useZkLogin();

const emit = defineEmits(['success', 'reject']);

onMounted(() => {
  googleLogout();
  readCode();
});

const filteredConnectors = computed(() => {
  return connectors.filter(
    ({ name, icon }) => siweConnectors.indexOf(name) !== -1 && icon !== null && icon !== undefined,
  );
});

const plugConnected = computed(() => window.ic?.plug !== undefined);

const readCode = async () => {
  if (Object.keys(route.query).length > 0) {
    axiosService
      .get(`${process.env.API_URL}auth/callback/${localStorage.socialProvider}`, route.query)
      .then(async ({ data }) => {
        const provider = localStorage.socialProvider;
        const providerId = data.data.id;
        const nickname = data.data.nickname;

        if (!localStorage.addingExtraSocial) {
          localStorage.removeItem('socialProvider');
        }
        localStorage.socialInfo = nickname;

        if (!localStorage.getItem('socialSignIn')) {
          localStorage.providerId = providerId;
          window.close();
          return;
        }

        localStorage.removeItem('socialSignIn');
        localStorage.connector = provider;
        await useAuthStore().loginWithWeb2(nickname, nickname, provider);
      })
      .catch((e) => console.error(e));
  }

  const idToken = new URLSearchParams(route.hash.substring(1)).get('id_token');
  if (idToken) {
    localStorage.removeItem('social');
    localStorage.removeItem('token');

    const { email, address } = await zkLoginAuthorize(idToken, 'google');
    if (email && address) {
      await authStore.loginWithGoogle(email, address);
    }
  }
};

const loginWithSuiet = async () => {
  await connectSuiet();
  const address = await getGlobalAddress();

  if (address && address !== 'undefined') {
    localStorage.connector = 'suiet';
    await authStore.loginWithSui(address, 'suiet');
  }
};
const loginWithSui = async () => {
  await connectSui();
  const address = await getGlobalAddress();

  if (address && address !== 'undefined') {
    localStorage.connector = 'sui';
    await authStore.loginWithSui(address, 'sui');
  }
};
const IIConnect = async () => {
  try {
    localStorage.connector = 'ii';
    await authStore.loginWithII();
  } catch (e) {
    localStorage.removeItem('connector');
    emit('reject');
  }
};
const connectSIWE = async (connector, chainId) => {
  localStorage.connector = connector.name;

  try {
    await connect({ connector, chainId });
  } catch (e) {
    localStorage.removeItem('connector');
    emit('reject');
  }
};
const loginWithSocial = async (provider) => {
  await useAuthStore().connectSocial(provider, true);
};
const logout = async () => {
  await disconnect();
  await authStore.logout();
};
const connectPLUG = async () => {
  try {
    await authStore.loginWithPlug();
  } catch (e) {
    console.error(e);
    emit('reject');
  }
};
const hasAuthToken = computed(() => authStore.getAuthState);

watch(hasAuthToken, () => {
  emit('success');
});

watch(
  isConnected,
  async (value) => {
    try {
      if (value) {
        const message = await authStore.prepareSIWELogin(address.value);

        if (message === null) {
          await logout();
        } else {
          await signMessageAsync({ message })
            .then(async (signature) => await authStore.loginWithSIWE(address.value, signature))
            .catch(async () => {
              if (!props.isQuest) {
                await logout();
              }
              emit('reject');
            });
        }
      }
    } catch {
      emit('reject');
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
        localStorage.connector = 'siws';
        const walletAddress = publicKey.value.toBase58();
        let siwsMessage = await authStore.prepareSIWSLogin(walletAddress);

        if (siwsMessage === null) {
          await logout();
        } else {
          const encodedMessage = new TextEncoder().encode(
            `${siwsMessage.domain} wants you to sign in with your Solana account:\n` +
              `${siwsMessage.address}\n\n` +
              `${siwsMessage.statement}\n\n` +
              `URI: ${siwsMessage.uri}\n` +
              `Version: ${siwsMessage.version}\n` +
              `Chain ID: ${siwsMessage.chain_id}\n` +
              `Nonce: ${siwsMessage.nonce}\n` +
              `Issued At: ${new Date(Number(siwsMessage.issued_at / BigInt(1000000))).toISOString()}\n` +
              `Expiration Time: ${new Date(Number(siwsMessage.expiration_time / BigInt(1000000))).toISOString()}`,
          );

          const signature = await solanaWallet.value.adapter.signMessage(encodedMessage);

          await authStore
            .loginWithSIWS(walletAddress, bs58.encode(signature))
            .catch((e) => console.error(e));
        }
      }
    } catch {
      emit('reject');
    }
  },
  {
    immediate: true,
  },
);

const props = defineProps({
  isQuest: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="main">
    <span class="title">Welcome to FormyFi!</span>
    <div class="form-block">
      <AuthButton @click="IIConnect()">
        <div class="container">
          <img src="@/assets/images/dfinity.svg" alt="Dfinity" />
          <div class="name-social">II</div>
        </div>
      </AuthButton>
      <template v-for="connector in filteredConnectors" :key="connector.name">
        <AuthButton v-if="connector.id !== 'metaMaskSDK'" @click="connectSIWE(connector, chainId)">
          <div class="container">
            <img
              v-if="connector.icon"
              :src="connector.icon"
              :alt="connector.name"
              class="h-[24px]"
            />
            <div class="name-social">
              {{ connector.name }}
            </div>
          </div>
        </AuthButton>
      </template>
      <AuthButton @click="loginWithSui()">
        <div class="container">
          <img src="@/assets/icons/sui.svg" alt="Sui Wallet" class="h-[24px]" />
          <div class="name-social">Sui Wallet</div>
        </div>
      </AuthButton>
      <AuthButton @click="loginWithSuiet()">
        <div class="container">
          <img src="@/assets/icons/suiet.svg" alt="Suiet Wallet" class="h-[24px]" />
          <div class="name-social">Suiet</div>
        </div>
      </AuthButton>
      <AuthButton v-if="plugConnected" @click="connectPLUG()">
        <div class="container">
          <img src="@/assets/icons/plug.png" alt="PLUG" class="h-[24px]" />
          <div class="name-social">PLUG</div>
        </div>
      </AuthButton>
      <div class="btn">
        <WalletMultiButton/>
      </div>
    </div>
    <hr />
    <div class="form-block">
      <AuthButton @click="connectZkLogin('google')">
        <div class="container">
          <img src="@/assets/icons/google.png" class="h-[20px]" alt="google" />
          <div class="name-social">Google</div>
        </div>
      </AuthButton>
      <AuthButton @click="loginWithSocial('twitter')">
        <div class="container">
          <img src="@/assets/icons/x.png" alt="x" class="h-[24px]" />
          <div class="name-social">X</div>
        </div>
      </AuthButton>
      <AuthButton @click="loginWithSocial('discord')">
        <div class="container">
          <img src="@/assets/icons/discord.png" alt="discord" class="h-[24px]" />
          <div class="name-social">Discord</div>
        </div>
      </AuthButton>
      <AuthButton @click="emit('skip')" v-if="isQuest">
        <div class="container">
          <div class="name-social">Submit the form anonymously</div>
        </div>
      </AuthButton>
    </div>
    <div class="agreement">
      By proceeding, you agree to <span> Terms of Service</span> & <span>Privacy Policy</span>.
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 27px;

  .title {
    font-family: $default_font;
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }

  .form-block {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;

    .btn {
      flex: 0 0 calc(50% - 5px);
      min-width: calc(50% - 5px) !important;
      max-width: calc(50% - 5px) !important;
    }

    .btn:last-child:nth-child(odd) {
      flex: 0 0 100%;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    }
  }

  .container {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;

    .name-social {
      color: #344054;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: $default_font;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }

  .agreement {
    color: $primary-text;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: $default_font;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.168px;

    span {
      color: $blue;
      cursor: pointer;
      font-weight: 500;
    }
  }
}
</style>
