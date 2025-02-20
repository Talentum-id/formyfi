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
              :disabled="socialLoading"
              :hide-remove="
                connector.name === 'zkLogin' ||
                connector.name === user.connector ||
                (user.connector === 'ii' && connector.name === 'Internet Identity')
              "
            >
              {{ connector.name }} -- {{ user.connector }}
            </SocialTag>
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
  <Alert :message="successMessage" type="success" v-if="successMessage.trim().length > 0" />
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
import { useRoute, useRouter } from 'vue-router';
import SocialTag from '@/components/Profile/SocialTag.vue';
import { useAccount, useChainId, useConnect, useDisconnect, useSignMessage } from '@wagmi/vue';
import { config } from '@/wagmi.config';
import { siweConnectors } from '@/constants/siweConnectors';
const { connectAsync, connectors } = useConnect();
const { address, isConnected } = useAccount();
const { signMessageAsync } = useSignMessage({ config });
const chainId = useChainId();
const { disconnect } = useDisconnect();
import dfinityIcon from '@/assets/images/dfinity.svg';
import xIcon from '@/assets/icons/x.png';
import discordIcon from '@/assets/icons/discord.png';
import suiIcon from '@/assets/icons/sui.svg';
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
const socialLoading = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const socialId = ref(localStorage.socialInfo || '');
const socialProviderId = ref(localStorage.providerId || '');

onMounted(async () => {
  window.addEventListener('storage', handleStorageEvent);

  disconnect();
  await statsStore.findStatistics();
});

const handleStorageEvent = (event) => {
  if (event.key === 'socialInfo') {
    socialId.value = event.newValue || '';
  }

  if (event.key === 'providerId') {
    socialProviderId.value = event.newValue || '';
  }
};

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
      provider: user.value.provider,
      title: user.value.title,
      connector: user.value.connector,
      extraIdentities: user.value.extraIdentities,
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
  if (provider === 'google' && user.value.connector === 'google') {
    return user.value;
  }

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
          status: user.value.connector === connector.name || getExtraIdentity(connector.name),
          name: connector.name,
          value:
            user.value.connector === connector.name
              ? shortenAddress(user.value.title)
              : getExtraIdentity(connector.name)
                ? shortenAddress(getExtraIdentity(connector.name).title)
                : false,
          fn: async () => {
            if (socialLoading.value) return;

            socialLoading.value = true;
            try {
              await connectAsync({ connector, chainId });
              currentConnector.value = connector.name;
            } catch {
              invokeErrorAlert();
            } finally {
              socialLoading.value = false;
            }
          },
          rm: async () => {
            if (socialLoading.value) return;

            socialLoading.value = true;
            try {
              await removeProvider(getExtraIdentity(connector.name));
              invokeSuccessAlert();
            } catch {
              invokeErrorAlert();
            } finally {
              socialLoading.value = false;
            }
          },
        };
      }),
      {
        id: 1,
        icon: dfinityIcon,
        status: user.value.connector === 'ii' || getExtraIdentity('ii'),
        name: 'Internet Identity',
        value:
          user.value.connector === 'ii'
            ? user.value.title
            : getExtraIdentity('ii')
              ? getExtraIdentity('ii').title
              : false,
        fn: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await authStore.loginWithII(true);
            invokeSuccessAlert();
          } catch (e) {
            invokeErrorAlert();
            console.error(e);
          } finally {
            socialLoading.value = false;
          }
        },
        rm: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await removeProvider(getExtraIdentity('ii'));
            invokeSuccessAlert();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
      },
      {
        id: 2,
        icon: 'Wallet-Default',
        status: user.value.connector === 'siws' || !!getExtraIdentity('siws'),
        name: 'Solana Wallets',
        value:
          user.value.connector === 'siws'
            ? shortenAddress(user.value.title)
            : getExtraIdentity('siws')
              ? shortenAddress(getExtraIdentity('siws').title)
              : false,
        fn: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await triggerClick();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
        rm: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await removeProvider(getExtraIdentity('siws'));
            invokeSuccessAlert();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
      },
      getExtraIdentity('google') && {
        id: 3,
        icon: 'Google',
        status: user.value.connector === 'google' || !!getExtraIdentity('google'),
        name: 'Google',
        value:
          user.value.connector === 'google'
            ? user.value.title
            : getExtraIdentity('google')
              ? getExtraIdentity('google').title
              : false,
        fn: async () => {},
        rm: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await removeProvider(getExtraIdentity('google'));
            invokeSuccessAlert();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
      },
      {
        id: 4,
        icon: xIcon,
        status: user.value.connector === 'twitter' || !!getExtraIdentity('twitter'),
        name: 'X',
        value:
          user.value.connector === 'twitter'
            ? user.value.title
            : getExtraIdentity('twitter')
              ? getExtraIdentity('twitter').title
              : false,
        fn: async () => {
          localStorage.socialProvider = 'twitter';
          localStorage.addingExtraSocial = 1;
          await useAuthStore().connectSocial('twitter');
        },
        rm: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await removeProvider(getExtraIdentity('twitter'));
            invokeSuccessAlert();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
      },
      {
        id: 5,
        icon: discordIcon,
        status: user.value.connector === 'discord' || !!getExtraIdentity('discord'),
        name: 'Discord',
        value:
          user.value.connector === 'discord'
            ? user.value.title
            : getExtraIdentity('discord')
              ? getExtraIdentity('discord').title
              : false,
        fn: async () => {
          localStorage.socialProvider = 'discord';
          localStorage.addingExtraSocial = 1;
          await useAuthStore().connectSocial('discord');
        },
        rm: async () => {
          if (socialLoading.value) return;

          socialLoading.value = true;
          try {
            await removeProvider(getExtraIdentity('discord'));
            invokeSuccessAlert();
          } catch {
            invokeErrorAlert();
          } finally {
            socialLoading.value = false;
          }
        },
      },
      {
        id: 6,
        disabled: user.value.zkLoginAddress.length === 0,
        icon: suiIcon,
        name: 'zkLogin',
        status: user.value.zkLoginAddress.length,
        value: user.value.zkLoginAddress.length ? shortenAddress(user.value.zkLoginAddress[0]) : false,
        fn: async () => {},
        rm: async () => {},
      },
    ].filter((item) => item && !item.disabled),
  { dependsOn: [getExtraIdentities] },
);

const invokeSuccessAlert = () => {
  successMessage.value = 'Operation successfully completed';

  setTimeout(() => (successMessage.value = ''), 3000);
};
const invokeErrorAlert = () => {
  error.value = 'Operation failed. Try again later.';

  setTimeout(() => (error.value = ''), 3000);
};

const addWeb2ExtraIdentity = async () => {
  await useAuthStore()
    .loginWithWeb2(socialProviderId.value, socialId.value, localStorage.socialProvider, true)
    .finally(() => {
      localStorage.removeItem('socialProvider');
      localStorage.removeItem('addingExtraSocial');
      localStorage.removeItem('providerId');
      localStorage.removeItem('socialInfo');
    });
};

watch(
  () => socialId.value,
  async () => {
    if (socialId.value && socialProviderId.value) {
      await addWeb2ExtraIdentity();
    }
  },
);

watch(
  () => socialProviderId.value,
  async () => {
    if (socialId.value && socialProviderId.value) {
      await addWeb2ExtraIdentity();
    }
  },
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
            await authStore
              .loginWithSIWE(address.value, signature, currentConnector.value)
              .then(() => invokeSuccessAlert())
              .catch(() => invokeErrorAlert()),
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
            `Issued At: ${new Date(Number(siwsMessage.issued_at / BigInt(1000000))).toISOString()}\n` +
            `Expiration Time: ${new Date(Number(siwsMessage.expiration_time / BigInt(1000000))).toISOString()}`,
        );

        const signature = await solanaWallet.value.adapter.signMessage(encodedMessage);

        await authStore
          .loginWithSIWS(walletAddress, bs58.encode(signature), 'siws')
          .then(() => invokeSuccessAlert())
          .catch((e) => {
            invokeErrorAlert();
            console.error(e);
          });
      }
    } catch {}
  },
  {
    immediate: true,
  },
);

const callback = async (response) => {
  if (socialLoading.value) return;

  socialLoading.value = true;
  try {
    await useAuthStore().loginWithGoogle(response.credential, true);
    invokeSuccessAlert();
  } catch {
    invokeErrorAlert();
  } finally {
    socialLoading.value = false;
  }
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
