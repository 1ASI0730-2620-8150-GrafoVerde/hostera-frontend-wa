import axios from 'axios';
import i18n from '../../i18n.js';
import { problemTitleOf } from './problem-details.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;

/**
 * Problem title of the platform for a request without a valid bearer token.
 * @type {string}
 */
const authenticationRequiredTitle = 'AuthenticationRequired';

/**
 * Session handlers that the IAM context registers, so every client authenticates its requests.
 * @type {{token: () => ?string, onAuthenticationRequired: () => void}}
 */
const sessionHandlers = {
  token: () => null,
  onAuthenticationRequired: () => {},
};

/**
 * Registers how every client reads the bearer token and what happens when the platform rejects it.
 * @param {Object} handlers - Session handlers.
 * @param {() => ?string} [handlers.token] - Returns the bearer token of the current session, or null.
 * @param {() => void} [handlers.onAuthenticationRequired] - Ends the session when the platform rejects its token.
 * @returns {void}
 */
export function configureSessionHandlers(handlers) {
  Object.assign(sessionHandlers, handlers);
}

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
   * Each request asks for messages in the language selected in the application and carries the bearer token of the session.
   * A response that asks for authentication ends the session.
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
      const token = sessionHandlers.token();
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
    this.#http.interceptors.response.use(undefined, (error) => {
      if (
        error?.response?.status === 401 &&
        problemTitleOf(error) === authenticationRequiredTitle
      )
        sessionHandlers.onAuthenticationRequired();
      return Promise.reject(error);
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
