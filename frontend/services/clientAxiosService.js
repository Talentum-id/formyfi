import axios from 'axios';

//TODO все новые запросы переводим на данный сервис

export class AxiosService {
  constructor(axiosInstance = axios.create()) {
    this.client = axiosInstance;
  }

  get(url, config) {
    return this.client.get(url, { ...config, headers: this._getHeaders(config) });
  }

  delete(url, config) {
    return this.client.delete(url, { ...config, headers: this._getHeaders(config) });
  }

  head(url, config) {
    return this.client.head(url, { ...config, headers: this._getHeaders(config) });
  }

  options(url, config) {
    return this.client.options(url, { ...config, headers: this._getHeaders(config) });
  }

  post(url, data, config) {
    return this.client.post(url, data, { ...config, headers: this._getHeaders(config) });
  }

  put(url, data, config) {
    return this.client.put(url, data, { ...config, headers: this._getHeaders(config) });
  }

  _getHeaders(config) {
    const token = localStorage.getItem('token');
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { headers = {} } = config || {};
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
      timeZone: timeZone,
    };
  }
}
