import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const signInEndpointPath = import.meta.env.VITE_SIGN_IN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGN_UP_ENDPOINT_PATH;

/**
 * Infrastructure gateway for IAM bounded-context endpoints of the Hostera Platform.
 *
 * @class IamApi
 * @extends BaseApi
 */
export class IamApi extends BaseApi {
  /**
   * @private
   * @type {BaseEndpoint}
   */
  #signInEndpoint;
  /**
   * @private
   * @type {BaseEndpoint}
   */
  #signUpEndpoint;

  /** Creates the HTTP client of the Hostera Platform and its authentication endpoints. */
  constructor() {
    super(hosteraPlatformApiUrl);
    this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);
    this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpointPath);
  }

  /**
   * Checks the username and password of a user and receives its bearer token.
   * @param {import('../domain/sign-in.command.js').SignInCommand} signInCommand - Sign-in command.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the signed-in user and its token.
   */
  signIn(signInCommand) {
    return this.#signInEndpoint.create({ ...signInCommand });
  }

  /**
   * Registers a new user in a new organization.
   * @param {import('../domain/sign-up.command.js').SignUpCommand} signUpCommand - Sign-up command.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the registered user.
   */
  signUp(signUpCommand) {
    return this.#signUpEndpoint.create({ ...signUpCommand });
  }
}
