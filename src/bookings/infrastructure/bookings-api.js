import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const propertiesEndpointPath = import.meta.env.VITE_PROPERTIES_ENDPOINT_PATH;
const bookingsEndpointPath = import.meta.env.VITE_BOOKINGS_ENDPOINT_PATH;
const paymentsEndpointPath = import.meta.env.VITE_PAYMENTS_ENDPOINT_PATH;
const bookingTransitionsEndpointPath = import.meta.env
  .VITE_BOOKING_TRANSITIONS_ENDPOINT_PATH;
const checkInEndpointPath = import.meta.env.VITE_CHECK_IN_ENDPOINT_PATH;
const checkOutEndpointPath = import.meta.env.VITE_CHECK_OUT_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Bookings bounded-context endpoints of the Hostera Platform.
 * Every change to a booking sends the version it was read with, so the platform rejects it when another change came first.
 *
 * @class BookingsApi
 * @extends BaseApi
 */
export class BookingsApi extends BaseApi {
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #bookingsEndpoint;

  /** Creates the endpoint client for bookings. */
  constructor() {
    super(hosteraPlatformApiUrl);
    this.#bookingsEndpoint = new BaseEndpoint(this, bookingsEndpointPath);
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
   * Builds the path of an operation on a booking.
   * @param {number} bookingId - Booking identifier.
   * @param {string} operationPath - Path of the operation.
   * @returns {string} Path of the booking operation.
   * @private
   */
  #bookingOperationPath(bookingId, operationPath) {
    return `${bookingsEndpointPath}/${bookingId}${operationPath}`;
  }

  /**
   * Builds the request options that expect a booking to be at a version.
   * @param {number} version - Version the booking was read with.
   * @returns {import('axios').AxiosRequestConfig} Request options with the If-Match header.
   * @private
   */
  #ifMatch(version) {
    return { headers: { 'If-Match': `"${version}"` } };
  }

  /**
   * Fetches the bookings of a property.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the bookings' response.
   */
  getBookings(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, bookingsEndpointPath),
    );
  }

  /**
   * Fetches a booking.
   * @param {number} id - Booking identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the booking.
   */
  getBooking(id) {
    return this.#bookingsEndpoint.getById(id);
  }

  /**
   * Creates a pending booking; the platform assigns its code and quotes its total.
   * @param {number} propertyId - Property identifier.
   * @param {Object} resource - Booking to create.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created booking.
   */
  createBooking(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, bookingsEndpointPath),
      resource,
    );
  }

  /**
   * Updates the guest, stay, room, and rate plan of a booking.
   * @param {number} id - Booking identifier.
   * @param {number} version - Version the booking was read with.
   * @param {Object} resource - Updated booking.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated booking.
   */
  updateBooking(id, version, resource) {
    return this.http.put(
      `${bookingsEndpointPath}/${id}`,
      resource,
      this.#ifMatch(version),
    );
  }

  /**
   * Moves a booking to another status: confirmed, cancelled, no-show, or back to pending.
   * @param {number} id - Booking identifier.
   * @param {number} version - Version the booking was read with.
   * @param {Object} resource - Requested status and its details.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the changed booking.
   */
  transitionBooking(id, version, resource) {
    return this.http.post(
      this.#bookingOperationPath(id, bookingTransitionsEndpointPath),
      resource,
      this.#ifMatch(version),
    );
  }

  /**
   * Checks in the guest of a booking and issues the encoded key cards.
   * @param {number} id - Booking identifier.
   * @param {number} version - Version the booking was read with.
   * @param {Object} resource - Identity document and key cards.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the checked-in stay.
   */
  checkInBooking(id, version, resource) {
    return this.http.post(
      this.#bookingOperationPath(id, checkInEndpointPath),
      resource,
      this.#ifMatch(version),
    );
  }

  /**
   * Checks out the guest of a booking, ends its key cards, and marks the room for cleaning.
   * @param {number} id - Booking identifier.
   * @param {number} version - Version the booking was read with.
   * @param {Object} resource - Room condition and departure note.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the checked-out stay.
   */
  checkOutBooking(id, version, resource) {
    return this.http.post(
      this.#bookingOperationPath(id, checkOutEndpointPath),
      resource,
      this.#ifMatch(version),
    );
  }

  /**
   * Fetches the payments of a property's bookings.
   * @param {number} propertyId - Property identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the payments' response.
   */
  getPayments(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, paymentsEndpointPath),
    );
  }

  /**
   * Records a payment for a booking. Repeating the request with the same idempotency key records it only once.
   * @param {number} bookingId - Booking identifier.
   * @param {string} idempotencyKey - Key that identifies this payment.
   * @param {Object} resource - Payment to record.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the payment and the new balance due.
   */
  recordPayment(bookingId, idempotencyKey, resource) {
    return this.http.post(
      this.#bookingOperationPath(bookingId, paymentsEndpointPath),
      resource,
      { headers: { 'Idempotency-Key': idempotencyKey } },
    );
  }
}
