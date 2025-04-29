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
    const suiWallet = getSuiProvider('Slush — A Sui wallet');

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
      console.log(GlobalWallet.walletList);
      return GlobalWallet.walletList.find((wallet) => wallet.name === currentProvider);
    }
  };
  return {
    connectSuiet,
    connectSui,
    getGlobalAddress,
    getSuiProvider,
  };
};
