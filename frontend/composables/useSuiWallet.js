import { ref } from 'vue';

export const useSuiWallet = () => {
  let globalAddress = ref('');

  const connectSuiet = async () => {
    const suiWallet = getSuiProvider('Suiet');
    if (!suiWallet) {
      return window.open('https://suiet.app/', '_blank');
    }

    try {
      await suiWallet.features['standard:disconnect'].disconnect();
    } catch (error) {
      console.error('DISCONNECT ERROR', error);
    }

    const { accounts } = await suiWallet.features['standard:connect'].connect();

    setGlobalAddress(accounts[0].address);
  };

  const connectSui = async () => {
    const suiWallet = getSuiProvider('Slush');

    if (!suiWallet) {
      return window.open('https://suiwallet.com/', '_blank');
    }

    try {
      await suiWallet.features['standard:disconnect'].disconnect();
    } catch (error) {
      console.error('DISCONNECT ERROR', error);
    }

    const { accounts } = await suiWallet.features['standard:connect'].connect();
    setGlobalAddress(accounts[0].address);
  };

  const setGlobalAddress = (address) => {
    globalAddress.value = address;
    localStorage.globalAddress = address;
  };

  const getGlobalAddress = () => {
    setGlobalAddress(localStorage.globalAddress);
    return globalAddress.value;
  }; // FOR GET CURRENT WALLET WHOLE APP

  const getSuiProvider = (provider) => {
    const currentProvider = provider || localStorage.SuiProvider;

    localStorage.SuiProvider = currentProvider;

    const GlobalWallet = {
      walletList: [],
      register: (wallet) => {
        GlobalWallet.walletList.push(wallet);
      },
    };

    if (currentProvider) {
      const event = new CustomEvent('wallet-standard:app-ready', { detail: GlobalWallet });
      window.dispatchEvent(event);

      return GlobalWallet.walletList.find((wallet) => wallet.name === currentProvider);
    }
  };

  const signMessage = async (provider, message) => {
    const wallet = getSuiProvider(provider);
    if (!wallet) {
      throw new Error(`${provider} wallet not found`);
    }

    if (!wallet.features || !wallet.features['sui:signPersonalMessage']) {
      throw new Error(`${provider} wallet does not support message signing`);
    }

    try {
      const messageBytes = typeof message === 'string'
        ? new TextEncoder().encode(message)
        : message;

      const accounts = wallet.accounts;
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please reconnect your wallet.');
      }

      const account = accounts[0];

      const signedMessage = await wallet.features['sui:signPersonalMessage'].signPersonalMessage({
        message: messageBytes,
        account: account,
      });

      const signature = signedMessage.signature;
      console.log(signature);
      if (signature.startsWith('0x')) {
        return signature;
      }

      if (/^[0-9a-fA-F]+$/.test(signature)) {
        return '0x' + signature;
      }

      try {
        const buffer = Buffer.from(signature, 'base64');

        return '0x' + buffer.toString('hex');
      } catch (error) {
        console.error('Failed to convert Base64 to hex:', error);

        throw new Error('Invalid Base64 signature format');
      }
    } catch (error) {
      console.error('Message signing failed:', error);
      throw new Error(`Failed to sign message with ${provider}: ${error.message}`);
    }
  };

  return {
    connectSuiet,
    connectSui,
    getGlobalAddress,
    getSuiProvider,
    signMessage,
  };
};
