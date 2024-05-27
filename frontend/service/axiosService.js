import axios from 'axios';
class AxiosService {
  constructor() {
    this.axios = axios.create();
  }
  getHeaders() {
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('extraCharacter');
      if (token) {
        config.headers['Authorization'] = `${token}`;
      }
      return config;
    });
  }
  async _request(options) {
    await this.getHeaders();
    return await this.axios.request(options);
  }

  async get(url, params, headers = {}) {
    return await this._request({
      method: 'get',
      url,
      params,
      headers,
    });
  }

  async post(url, data, headers = {}) {
    return await this._request({
      method: 'post',
      url,
      data,
      headers,
    });
  }

}

export default new AxiosService();
