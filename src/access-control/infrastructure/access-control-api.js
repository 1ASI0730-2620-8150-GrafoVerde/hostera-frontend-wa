import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const credentialsEndpointPath = import.meta.env.VITE_CREDENTIALS_ENDPOINT_PATH;
const staffMembersEndpointPath = import.meta.env
  .VITE_STAFF_MEMBERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Access Control bounded-context endpoints.
 *
 * @class AccessControlApi
 * @extends BaseApi
 */
export class AccessControlApi extends BaseApi {
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #credentialsEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #staffMembersEndpoint;

  /** Creates endpoint clients for credentials and staff members. */
  constructor() {
    super();
    this.#credentialsEndpoint = new BaseEndpoint(this, credentialsEndpointPath);
    this.#staffMembersEndpoint = new BaseEndpoint(
      this,
      staffMembersEndpointPath,
    );
  }

  /**
   * Fetches the credentials of a property.
   * @param {number|string} propertyId - The ID of the property.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the credentials' response.
   */
  getCredentials(propertyId) {
    return this.#credentialsEndpoint.getAll({ propertyId });
  }

  /**
   * Creates a credential resource.
   * @param {Object} resource - Credential resource payload.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created credential response.
   */
  createCredential(resource) {
    return this.#credentialsEndpoint.create(resource);
  }

  /**
   * Updates a credential resource.
   * @param {Object} resource - Credential resource payload (must include id).
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated credential response.
   */
  updateCredential(resource) {
    return this.#credentialsEndpoint.update(resource.id, resource);
  }

  /**
   * Fetches the staff members of a property.
   * @param {number|string} propertyId - The ID of the property.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the staff members' response.
   */
  getStaffMembers(propertyId) {
    return this.#staffMembersEndpoint.getAll({ propertyId });
  }
}
