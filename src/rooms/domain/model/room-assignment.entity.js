/**
 * Room assignment entity within the Rooms bounded context.
 * It is a read-only reference to the reservation or stay that controls a room's days.
 *
 * @class RoomAssignment
 */
export class RoomAssignment {
  /**
   * Day statuses that a room assignment controls.
   * @type {string[]}
   */
  static statuses = ['reserved', 'occupied'];

  /**
   * @param {Object} params - Entity attributes.
   * @param {?number} [params.id=null] - Room assignment identifier.
   * @param {?number} [params.propertyId=null] - Identifier of the property that owns the room.
   * @param {?number} [params.roomId=null] - Identifier of the assigned room.
   * @param {string} [params.reservationCode=''] - Code of the controlling reservation.
   * @param {'reserved'|'occupied'} [params.status='reserved'] - Whether the guest is expected or staying.
   * @param {string} [params.startDate=''] - First ISO night covered by the assignment.
   * @param {string} [params.endDate=''] - Last ISO night covered by the assignment.
   */
  constructor({
    id = null,
    propertyId = null,
    roomId = null,
    reservationCode = '',
    status = 'reserved',
    startDate = '',
    endDate = '',
  }) {
    this.id = id;
    this.propertyId = propertyId;
    this.roomId = roomId;
    this.reservationCode = reservationCode;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * Whether the assignment covers a calendar day.
   * @param {string} date - ISO calendar day.
   * @returns {boolean}
   */
  covers(date) {
    return this.startDate <= date && date <= this.endDate;
  }

  /**
   * Whether the assignment shares at least one day with a date range.
   * @param {string} startDate - First ISO day of the range.
   * @param {string} endDate - Last ISO day of the range.
   * @returns {boolean}
   */
  overlaps(startDate, endDate) {
    return this.startDate <= endDate && startDate <= this.endDate;
  }
}
