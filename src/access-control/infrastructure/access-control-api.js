import { BaseApi } from '../../shared/infrastructure/base-api.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const propertiesEndpointPath = import.meta.env.VITE_PROPERTIES_ENDPOINT_PATH;
const credentialsEndpointPath = import.meta.env.VITE_CREDENTIALS_ENDPOINT_PATH;
const staffCredentialEncodingEndpointPath = import.meta.env
  .VITE_STAFF_CREDENTIAL_ENCODING_ENDPOINT_PATH;
const credentialRevocationEndpointPath = import.meta.env
  .VITE_CREDENTIAL_REVOCATION_ENDPOINT_PATH;
const credentialReplacementEndpointPath = import.meta.env
  .VITE_CREDENTIAL_REPLACEMENT_ENDPOINT_PATH;
const staffMembersEndpointPath = import.meta.env
  .VITE_STAFF_MEMBERS_ENDPOINT_PATH;
const accessEventsEndpointPath = import.meta.env
  .VITE_ACCESS_EVENTS_ENDPOINT_PATH;

/**
 * Largest page of access events the platform returns at once.
 * @type {number}
 */
const accessEventsPageSize = 200;

/**
 * Infrastructure gateway for Access Control bounded-context endpoints of the Hostera Platform.
 *
 * @class AccessControlApi
 * @extends BaseApi
 */
export class AccessControlApi extends BaseApi {
  /** Creates the HTTP client of the Hostera Platform. */
  constructor() {
    super(hosteraPlatformApiUrl);
  }

  /**
   * Builds the path of a collection that belongs to a property.
   * @param {number} propertyId - Property identifier.
   * @param {string} collectionPath - Path of the collection.
   * @returns {string} Path of the property collection.
   * @private
   */
  #propertyCollectionPath(propertyId, collectionPath) {
    return `${propertiesEndpointPath}/${propertyId}${collectionPath}`;
  }

  /**
   * Fetches the credentials of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the credentials' response.
   */
  getCredentials(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, credentialsEndpointPath),
    );
  }

  /**
   * Issues a staff credential on a card the front desk encoder wrote.
   * @param {number} propertyId - Property identifier.
   * @param {Object} resource - Staff member, scope, access period, and card ID.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the issued credential.
   */
  issueStaffCredential(propertyId, resource) {
    return this.http.post(
      `${this.#propertyCollectionPath(propertyId, credentialsEndpointPath)}${staffCredentialEncodingEndpointPath}`,
      resource,
    );
  }

  /**
   * Revokes an active or scheduled credential immediately.
   * @param {number} id - Credential identifier.
   * @param {Object} resource - Reason, note, and operator.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the revoked credential.
   */
  revokeCredential(id, resource) {
    return this.http.post(
      `${credentialsEndpointPath}/${id}${credentialRevocationEndpointPath}`,
      resource,
    );
  }

  /**
   * Revokes a credential and issues a new card with the same holder, scope, and access period.
   * @param {number} id - Identifier of the credential to replace.
   * @param {Object} resource - Card ID of the new card and operator.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the replacement credential.
   */
  replaceCredential(id, resource) {
    return this.http.post(
      `${credentialsEndpointPath}/${id}${credentialReplacementEndpointPath}`,
      resource,
    );
  }

  /**
   * Fetches the staff members of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the staff members' response.
   */
  getStaffMembers(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, staffMembersEndpointPath),
    );
  }

  /**
   * Fetches the most recent access events of a property, newest first.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the access events' response.
   */
  getAccessEvents(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, accessEventsEndpointPath),
      { params: { pageSize: accessEventsPageSize } },
    );
  }
}
