import { api } from '../apiService';

export const createCollection = async (data) => {
  return api.post('nft/collections ', data).then(({ data }) => data);
};
export const getCollectionList = async (params) => {
  return api.get(`nft/collections`, { params }).then(({ data }) => data);
};

export const getCollectionFilter = async (params) => {
  return api.get(`nft/collections/list`, { params }).then(({ data }) => data);
};

export const getPoolFilter = async (params) => {
  return api.get(`staking/pools`, { params }).then(({ data }) => data);
};

export const getCollection = async (id) => {
  return api.get(`nft/collections/${id}`).then(({ data }) => data);
};

export const getUserCollection = async (params) => {
  return api.get(`nft/user/collections`, { params }).then(({ data }) => data);
};

export const getMetaData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/nft/file`, formData).then(({ data }) => data);
};
