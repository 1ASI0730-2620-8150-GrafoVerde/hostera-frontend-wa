import { Booking } from '../domain/model/booking.entity.js';

/**
 * Maps booking resources into Bookings domain entities.
 *
 * @class BookingAssembler
 */
export class BookingAssembler {
  /**
   * Returns the calendar day of a date-time in the time zone of the browser.
   * @param {?string} value - ISO date-time.
   * @returns {string} ISO calendar day, or an empty string.
   * @private
   */
  static #toLocalDay(value) {
    if (!value) return '';
    const date = new Date(value);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  /**
   * @param {Object} resource - Booking resource payload.
   * @returns {Booking} Booking entity.
   */
  static toEntityFromResource(resource) {
    return new Booking({
      ...resource,
      guestPhone: resource.guestPhone ?? '',
      guestRequest: resource.guestRequest ?? '',
      createdAt: this.#toLocalDay(resource.createdAt),
      cancellationNote: resource.cancellationNote ?? '',
      guestDocumentNumber: resource.guestDocumentNumber ?? '',
      departureNote: resource.departureNote ?? '',
    });
  }

  /**
   * Parses booking resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with booking resources.
   * @returns {Booking[]} Booking entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['bookings'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a booking entity into the resource that creates it or updates its guest, stay, room, and rate plan.
   * @param {Booking} entity - Booking entity.
   * @returns {Object} Booking resource.
   */
  static toResourceFromEntity(entity) {
    return {
      guestName: entity.guestName,
      guestEmail: entity.guestEmail,
      guestPhone: entity.guestPhone || null,
      preferredLanguage: entity.preferredLanguage,
      checkInDate: entity.checkInDate,
      checkOutDate: entity.checkOutDate,
      guests: entity.guests,
      roomTypeId: entity.roomTypeId,
      roomId: entity.roomId,
      ratePlanId: entity.ratePlanId,
      guestRequest: entity.guestRequest || null,
    };
  }

  /**
   * Converts a booking whose status changed into the resource that asks the platform for that transition.
   * @param {Booking} entity - Booking with its new status.
   * @param {number} operatorId - Staff member who changes the status.
   * @returns {Object} Transition booking resource.
   */
  static toTransitionResourceFromEntity(entity, operatorId) {
    const cancelled = entity.status === 'cancelled';
    return {
      status: entity.status,
      operatorId,
      cancellationReason: cancelled ? entity.cancellationReason : null,
      cancellationNote: cancelled ? entity.cancellationNote || null : null,
    };
  }

  /**
   * Converts a check-in command into the resource that checks the guest in.
   * @param {import('../domain/check-in-booking.command.js').CheckInBookingCommand} command - Check-in command.
   * @param {number} operatorId - Staff member who completes the check-in.
   * @returns {Object} Check-in booking resource.
   */
  static toCheckInResourceFromCommand(command, operatorId) {
    return {
      documentType: command.documentType,
      documentNumber: command.documentNumber.trim(),
      documentVerified: command.documentVerified,
      keyCardIds: [...command.keyCardIds],
      operatorId,
    };
  }

  /**
   * Converts a check-out command into the resource that checks the guest out.
   * @param {import('../domain/check-out-booking.command.js').CheckOutBookingCommand} command - Check-out command.
   * @param {number} operatorId - Staff member who completes the check-out.
   * @returns {Object} Check-out booking resource.
   */
  static toCheckOutResourceFromCommand(command, operatorId) {
    return {
      roomCondition: command.roomCondition,
      departureNote: command.note.trim() || null,
      operatorId,
    };
  }
}
