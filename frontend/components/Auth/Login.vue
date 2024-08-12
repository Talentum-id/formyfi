<script setup>
import AuthButton from '@/components/Auth/AuthButton.vue';
import axiosService from '@/service/axiosService';
import { useAuthStore } from '@/store/auth';
import { googleLogout } from 'vue3-google-login';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  useConnect,
  useChainId,
  useAccount,
  useDisconnect,
  useSignMessage,
} from '@wagmi/vue';
import { config } from '@/wagmi.config';
import { siweConnectors } from '@/constants/siweConnectors';

const authStore = useAuthStore();
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
  return connectors.filter(connector => {
    return siweConnectors.indexOf(connector.name) !== -1;
  });
});

const callback = async (response) => {
  try {
    await useAuthStore()
      .loginWithGoogle(response.credential)
      .then((e) => {
        emit('success');
      });
  } catch (e) {
    emit('reject');
  }
};

const readCode = () => {
  if (route.query) {
    axiosService
      .get(`${process.env.API_URL}auth/callback/${localStorage.socialProvider}`, route.query)
      .then((res) => {
        localStorage.socialInfo = res.data.data.nickname;
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

watch(authStore.isAuthenticated, () => emit('success'));

watch(isConnected, async value => {
  if (value) {
    const message = await authStore.prepareSIWELogin(address.value);

    if (message === null) {
      await logout();
    } else {
      await signMessageAsync({ message })
        .then(async signature => await authStore.loginWithSIWE(address.value, signature))
        .catch(async () => await logout());
    }
  }
}, {
  immediate: true,
});
</script>

<template>
  <div class="main">
    <span class="title">Welcome to Formyfi!</span>
    <div class="form-block">
      <AuthButton @click="IIConnect()">
        <div class="container">
          <img src="@/assets/images/definity.svg" alt="Dfinity" />
          <div class="name-social">Internet Identity</div>
        </div>
      </AuthButton>
      <template v-for="connector in filteredConnectors" :key="connector.name">
        <AuthButton
          v-if="connector.id !== 'metaMaskSDK'"
          @click="connect({ connector, chainId })"
        >
          <div class="container">
            <img
              v-if="connector.icon"
              :src="connector.icon"
              :alt="connector.name"
              class="h-[24px]"
            >
            <div class="name-social">
              {{ connector.name }}
            </div>
          </div>
        </AuthButton>
      </template>
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
