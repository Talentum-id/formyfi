import axios from 'axios';
class AxiosService {
  constructor() {
    this.axios = axios.create();
  }
  getHeaders() {
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      config.headers['timeZone'] = timeZone;

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

  async post(url, data, isMultipart = false, headers = {}) {
    if (isMultipart) {
      let formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) {
          if (Array.isArray(data[key])) {
            data[key].forEach((value, index) => {
              if (typeof value === 'object' && value !== null) {
                let objKeys = Object.keys(value);
                objKeys.forEach((objKey) => {
                  formData.append(`${key}[${index}][${objKey}]`, value[objKey]);
                });
              } else {
                formData.append(`${key}[${index}]`, value);
              }
            });
          } else {
            formData.append(key, data[key]);
          }
        }
      }
      formData.append('_method', 'POST');
      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }

    return await this._request({
      method: 'post',
      url,
      data,
      headers,
    });
  }

  async put(url, data, isMultipart = false, headers = {}) {
    let formData = new FormData();
    const extractObject = (name, data) => {
      let objKeys = Object.keys(data);
      objKeys.forEach((objKey, objIndex) => {
        if (data[objKey] && typeof data[objKey] === 'object') {
          extractObject(`${name}[${objKey}]`, data[objKey]);
        } else {
          formData.append(`${name}[${objKey}]`, data[objKey]);
        }
      });
    };
    const extractArray = (key, data) => {
      // key = tags
      // data = tags value
      data.forEach((value, index) => {
        if (typeof value === 'object' && value !== null) {
          extractObject(`${key}[${index}]`, value);
        } else if (Array.isArray(value)) {
          extractArray(key, value);
        } else {
          formData.append(`${key}[${index}]`, value);
        }
      });
    };

    if (isMultipart) {
      for (let key in data) {
        if (data[key] !== undefined) {
          if (Array.isArray(data[key])) {
            extractArray(key, data[key]);
          } else {
            formData.append(key, data[key]);
          }
        }
      }
      formData.append('_method', 'PUT');
      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }

    return await this._request({
      method: 'put',
      url,
      data,
      headers,
    });
  }
  async patch(url, data, isMultipart = false, headers = {}) {
    if (isMultipart) {
      let formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      formData.append('_method', 'patch');

      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }
    return await this._request({
      method: 'patch',
      url,
      data,
      headers,
    });
  }

  async delete(url, data, headers = {}) {
    return await this._request({
      method: 'delete',
      url,
      data,
      headers,
    });
  }
}

export default new AxiosService();
