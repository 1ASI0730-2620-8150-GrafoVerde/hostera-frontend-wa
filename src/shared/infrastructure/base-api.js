import axios from 'axios';
import i18n from '../../i18n.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;

/**
 * Shared infrastructure base class that configures the HTTP client.
 *
 * @class BaseApi
 */
export class BaseApi {
  /**
   * @private
   * Axios HTTP client instance
   * @type {import('axios').AxiosInstance}
   */
  #http;

  /**
   * Initializes the Axios HTTP client with the base URL from environment variables.
   * Each request asks for messages in the language selected in the application.
   * @param {string} [baseUrl] - Base URL of the API; defaults to the Hostera Platform API.
   */
  constructor(baseUrl = hosteraPlatformApiUrl) {
    this.#http = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.#http.interceptors.request.use((config) => {
      config.headers['Accept-Language'] = i18n.global.locale.value;
      return config;
    });
  }

  /**
   * Returns the configured Axios HTTP client.
   * @returns {import('axios').AxiosInstance}
   */
  get http() {
    return this.#http;
  }
}
