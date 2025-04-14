import { api } from '../apiService';

export const getCoinList = async (params) => {
  return api.get('coin-types', { params: { ...params } }).then(({ data }) => data);
};

export const getBlockchains = async (scope = 'off-chain-rewards-list', params) => {
  return api.get(`blockchains?scope=${scope}`, { params }).then(({ data }) => data);
};
