<script setup>
import AuthButton from '@/components/Auth/AuthButton.vue';
import axiosService from '@/services/axiosService';
import { useAuthStore } from '@/store/auth';
import { googleLogout } from 'vue3-google-login';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import bs58 from 'bs58';
import { useConnect, useChainId, useAccount, useDisconnect, useSignMessage } from '@wagmi/vue';
import { config } from '@/wagmi.config';
import { siweConnectors } from '@/constants/siweConnectors';
import { WalletMultiButton, useWallet } from 'solana-wallets-vue';
import { PlugTransport } from '@slide-computer/signer-transport-plug';
import { createAccountsPermissionScope, Signer } from '@slide-computer/signer';

const authStore = useAuthStore();
const { connected, publicKey, wallet: solanaWallet } = useWallet();

const { connect, connectors } = useConnect();
const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();
const { signMessageAsync } = useSignMessage({ config });
const chainId = useChainId();
const route = useRoute();

const emit = defineEmits(['success', 'reject']);

onMounted(() => {
  googleLogout();
  readCode();
  useAuthStore().setAuthenticationStorage(false);
});

const filteredConnectors = computed(() => {
  return connectors.filter(
    ({ name, icon }) => siweConnectors.indexOf(name) !== -1 && icon !== null && icon !== undefined,
  );
});

const callback = async (response) => {
  try {
    await useAuthStore()
      .loginWithGoogle(response.credential)
      .then(() => {
        emit('success');
      });
  } catch (e) {
    emit('reject');
  }
};

const readCode = () => {
  if (Object.keys(route.query).length > 0) {
    axiosService
      .get(`${process.env.API_URL}auth/callback/${localStorage.socialProvider}`, route.query)
      .then((res) => {
        localStorage.socialInfo = res.data.data.nickname;
        localStorage.providerId = res.data.data.id;
        localStorage.removeItem('socialProvider');
        window.close();
      })
      .catch((e) => console.error(e));
  }
};

const IIConnect = async () => {
  try {
    await authStore.loginWithII();
  } catch (e) {
    emit('reject');
  }
};

const logout = async () => {
  await disconnect();
  await authStore.logout();
};
const connectNFID = async () => {
  try {
    await authStore.loginWithNFID();
  } catch (e) {
    console.error(e);
    emit('reject');
  }
};
const connectPLUG = async () => {
  const transport = new PlugTransport();

  const signer = new Signer({ transport });
  await signer.requestPermissions(createAccountsPermissionScope());

  if (transport.connection && !transport.connection.connected) {
    await transport.connection.connect();
  }
  const accounts = await signer.accounts();
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
              `Issued At: ${new Date(Number(siwsMessage.issued_at / 1_000_000n)).toISOString()}\n` +
              `Expiration Time: ${new Date(Number(siwsMessage.expiration_time / 1_000_000n)).toISOString()}`,
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
    <span class="title">Welcome to Formyfi!</span>
    <div class="form-block">
      <AuthButton @click="IIConnect()">
        <div class="container">
          <img src="@/assets/images/dfinity.svg" alt="Dfinity" />
          <div class="name-social">Internet Identity</div>
        </div>
      </AuthButton>
      <template v-for="connector in filteredConnectors" :key="connector.name">
        <AuthButton v-if="connector.id !== 'metaMaskSDK'" @click="connect({ connector, chainId })">
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
      <!-- Disabled until ready to deploy to prod
      <AuthButton @click="connectNFID()">
        <div class="container">
          <img src="@/assets/icons/nfid.svg" alt="NFID" class="h-[24px]" />
          <div class="name-social">Wallet</div>
        </div>
      </AuthButton>
      <AuthButton @click="connectPLUG()">
        <div class="container">
          <img src="@/assets/icons/plug.png" alt="PLUG" class="h-[24px]" />
          <div class="name-social">PLUG</div>
        </div>
      </AuthButton>
      -->
      <WalletMultiButton />
      <hr />
      <GoogleLogin
        style="margin-top: -4px"
        :callback="callback"
        :buttonConfig="{
          logo_alignment: 'center',
          width: '392px',
          shape: 'pill',
          text: 'signin_with',
        }"
      />
      <AuthButton @click="emit('skip')" v-if="isQuest">
        <div class="container">
          <div class="name-social">Submit the form anonymously</div>
        </div>
      </AuthButton>

      <div class="agreement">
        By proceeding, you agree to <span> Terms of Service</span> & <span>Privacy Policy</span>.
      </div>
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
    flex-direction: column;
    justify-content: flex-start;
    gap: 27px;
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
