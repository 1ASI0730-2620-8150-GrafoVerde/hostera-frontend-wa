import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const propertiesEndpointPath = import.meta.env.VITE_PROPERTIES_ENDPOINT_PATH;
const roomTypesEndpointPath = import.meta.env.VITE_ROOM_TYPES_ENDPOINT_PATH;
const roomsEndpointPath = import.meta.env.VITE_ROOMS_ENDPOINT_PATH;
const roomStatusEndpointPath = import.meta.env.VITE_ROOM_STATUS_ENDPOINT_PATH;
const statusPeriodsEndpointPath = import.meta.env
  .VITE_STATUS_PERIODS_ENDPOINT_PATH;
const bookingsEndpointPath = import.meta.env.VITE_BOOKINGS_ENDPOINT_PATH;
const ratePlansEndpointPath = import.meta.env.VITE_RATE_PLANS_ENDPOINT_PATH;
const dailyRatesEndpointPath = import.meta.env.VITE_DAILY_RATES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Rooms bounded-context endpoints of the Hostera Platform.
 *
 * @class RoomsApi
 * @extends BaseApi
 */
export class RoomsApi extends BaseApi {
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #propertiesEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #roomTypesEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #roomsEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #ratePlansEndpoint;

  /** Creates endpoint clients for properties, room types, rooms, and rate plans. */
  constructor() {
    super(hosteraPlatformApiUrl);
    this.#propertiesEndpoint = new BaseEndpoint(this, propertiesEndpointPath);
    this.#roomTypesEndpoint = new BaseEndpoint(this, roomTypesEndpointPath);
    this.#roomsEndpoint = new BaseEndpoint(this, roomsEndpointPath);
    this.#ratePlansEndpoint = new BaseEndpoint(this, ratePlansEndpointPath);
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
   * Fetches all properties.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the properties' response.
   */
  getProperties() {
    return this.#propertiesEndpoint.getAll();
  }

  /**
   * Fetches the room types of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the room types' response.
   */
  getRoomTypes(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, roomTypesEndpointPath),
    );
  }

  /**
   * Creates a room type in a property.
   * @param {number} propertyId - Property identifier.
   * @param {Object} resource - Room type to create.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created room type.
   */
  createRoomType(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, roomTypesEndpointPath),
      resource,
    );
  }

  /**
   * Updates a room type.
   * @param {number} id - Room type identifier.
   * @param {Object} resource - Updated room type.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated room type.
   */
  updateRoomType(id, resource) {
    return this.#roomTypesEndpoint.update(id, resource);
  }

  /**
   * Deletes a room type that no room, rate plan, or booking uses.
   * @param {number} id - Room type identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving when the room type is deleted.
   */
  deleteRoomType(id) {
    return this.#roomTypesEndpoint.delete(id);
  }

  /**
   * Fetches the rooms of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the rooms' response.
   */
  getRooms(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, roomsEndpointPath),
    );
  }

  /**
   * Creates a room in a property.
   * @param {number} propertyId - Property identifier.
   * @param {Object} resource - Room to create.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created room.
   */
  createRoom(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, roomsEndpointPath),
      resource,
    );
  }

  /**
   * Updates a room.
   * @param {number} id - Room identifier.
   * @param {Object} resource - Updated room.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated room.
   */
  updateRoom(id, resource) {
    return this.#roomsEndpoint.update(id, resource);
  }

  /**
   * Sets or releases the operational status of a room over a date range.
   * @param {number} roomId - Room identifier.
   * @param {Object} resource - Status and date range.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to every status period of the room.
   */
  setRoomStatus(roomId, resource) {
    return this.http.put(
      `${roomsEndpointPath}/${roomId}${roomStatusEndpointPath}`,
      resource,
    );
  }

  /**
   * Fetches the status periods of a property's rooms.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the status periods' response.
   */
  getStatusPeriods(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, statusPeriodsEndpointPath),
    );
  }

  /**
   * Fetches the bookings of a property, from which the room assignments are derived.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the bookings' response.
   */
  getRoomAssignments(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, bookingsEndpointPath),
    );
  }

  /**
   * Fetches the rate plans of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the rate plans' response.
   */
  getRatePlans(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, ratePlansEndpointPath),
    );
  }

  /**
   * Creates a rate plan in a property.
   * @param {number} propertyId - Property identifier.
   * @param {Object} resource - Rate plan to create.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created rate plan.
   */
  createRatePlan(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, ratePlansEndpointPath),
      resource,
    );
  }

  /**
   * Updates a rate plan.
   * @param {number} id - Rate plan identifier.
   * @param {Object} resource - Updated rate plan.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated rate plan.
   */
  updateRatePlan(id, resource) {
    return this.#ratePlansEndpoint.update(id, resource);
  }

  /**
   * Fetches the daily rates of a property's rate plans.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the daily rates' response.
   */
  getDailyRates(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, dailyRatesEndpointPath),
    );
  }

  /**
   * Sets the nightly rate of a room type under a rate plan over a date range, or returns it to the base nightly rate.
   * @param {number} ratePlanId - Rate plan identifier.
   * @param {Object} resource - Room type, date range, and amount.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the daily rates of the range.
   */
  setDailyRates(ratePlanId, resource) {
    return this.http.put(
      `${ratePlansEndpointPath}/${ratePlanId}${dailyRatesEndpointPath}`,
      resource,
    );
  }
}
