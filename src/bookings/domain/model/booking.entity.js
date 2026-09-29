import { BookingsError } from './bookings.error.js';

/**
 * Booking entity within the Bookings bounded context.
 * It arranges a planned guest stay in one room over a range of nights and keeps the guest's contact details.
 *
 * @class Booking
 */
export class Booking {
  /**
   * Booking statuses, from the first request to the end of the stay.
   * @type {string[]}
   */
  static statuses = [
    'pending',
    'confirmed',
    'checked-in',
    'checked-out',
    'cancelled',
    'no-show',
  ];

  /**
   * Statuses whose booking keeps its room for its nights.
   * @type {string[]}
   */
  static roomHoldingStatuses = ['pending', 'confirmed', 'checked-in'];

  /**
   * Statuses whose booking can still be edited.
   * @type {string[]}
   */
  static editableStatuses = ['pending', 'confirmed'];

  /**
   * Languages a guest can prefer for communication.
   * @type {string[]}
   */
  static preferredLanguages = ['es', 'en'];

  /**
   * Checks whether a value is an existing calendar day in ISO `YYYY-MM-DD` format.
   * @param {*} value - Value to check.
   * @private
   * @returns {boolean}
   */
  static #isCalendarDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
      return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }

  /**
   * Moves an ISO calendar day by a number of days.
   * @param {string} value - ISO calendar day.
   * @param {number} days - Days to add; negative values move backwards.
   * @private
   * @returns {string} ISO calendar day.
   */
  static #addDays(value, days) {
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  /**
   * Builds the code that follows a property's latest booking code.
   * Each property numbers its bookings in its own thousand, such as BKG-1001 for the first property.
   * @param {number} propertyId - Identifier of the property.
   * @param {?string} latestCode - Highest booking code of the property, if any.
   * @returns {string} Next booking code.
   */
  static nextCode(propertyId, latestCode) {
    return `BKG-${Math.max(Booking.numberOf(latestCode), propertyId * 1000) + 1}`;
  }

  /**
   * Reads the sequential number of a booking code.
   * @param {string} code - Booking code.
   * @returns {number} Booking number, or 0 when the code has none.
   */
  static numberOf(code) {
    return Number(/^BKG-(\d+)$/.exec(code ?? '')?.[1] ?? 0);
  }

  /**
   * @param {Object} params - Entity attributes.
   * @param {?number} [params.id=null] - Booking identifier.
   * @param {?number} [params.propertyId=null] - Identifier of the property.
   * @param {string} [params.code=''] - Booking code shown to guests and staff.
   * @param {string} [params.status='pending'] - Booking status.
   * @param {string} [params.guestName=''] - Guest's full name.
   * @param {string} [params.guestEmail=''] - Guest's email address.
   * @param {string} [params.guestPhone=''] - Guest's phone number.
   * @param {string} [params.preferredLanguage='es'] - Guest's preferred language.
   * @param {string} [params.checkInDate=''] - ISO day of the first night.
   * @param {string} [params.checkOutDate=''] - ISO day the guest leaves, after the last night.
   * @param {number} [params.guests=1] - Number of guests.
   * @param {?number} [params.roomTypeId=null] - Identifier of the booked room type.
   * @param {?number} [params.roomId=null] - Identifier of the assigned room.
   * @param {?number} [params.ratePlanId=null] - Identifier of the rate plan.
   * @param {number} [params.totalAmount=0] - Price of all nights when the booking was saved.
   * @param {string} [params.guestRequest=''] - Guest's request for the stay.
   * @param {string} [params.createdAt=''] - ISO day the booking was created.
   * @param {?string} [params.confirmedAt=null] - ISO date-time the booking was confirmed.
   * @param {?string} [params.confirmedBy=null] - Operator who confirmed the booking.
   * @param {?string} [params.cancelledAt=null] - ISO date-time the booking was cancelled.
   * @param {?string} [params.cancelledBy=null] - Operator who cancelled the booking.
   * @param {?string} [params.cancellationReason=null] - Why the booking was cancelled.
   * @param {string} [params.cancellationNote=''] - Internal note about the cancellation.
   * @param {?string} [params.noShowAt=null] - ISO date-time the no-show was recorded.
   * @param {?string} [params.noShowBy=null] - Operator who recorded the no-show.
   */
  constructor({
    id = null,
    propertyId = null,
    code = '',
    status = 'pending',
    guestName = '',
    guestEmail = '',
    guestPhone = '',
    preferredLanguage = 'es',
    checkInDate = '',
    checkOutDate = '',
    guests = 1,
    roomTypeId = null,
    roomId = null,
    ratePlanId = null,
    totalAmount = 0,
    guestRequest = '',
    createdAt = '',
    confirmedAt = null,
    confirmedBy = null,
    cancelledAt = null,
    cancelledBy = null,
    cancellationReason = null,
    cancellationNote = '',
    noShowAt = null,
    noShowBy = null,
  }) {
    this.id = id;
    this.propertyId = propertyId;
    this.code = code;
    this.status = status;
    this.guestName = guestName.trim();
    this.guestEmail = guestEmail.trim();
    this.guestPhone = guestPhone.trim();
    this.preferredLanguage = preferredLanguage;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.guests = guests;
    this.roomTypeId = roomTypeId;
    this.roomId = roomId;
    this.ratePlanId = ratePlanId;
    this.totalAmount = totalAmount;
    this.guestRequest = guestRequest.trim();
    this.createdAt = createdAt;
    this.confirmedAt = confirmedAt;
    this.confirmedBy = confirmedBy;
    this.cancelledAt = cancelledAt;
    this.cancelledBy = cancelledBy;
    this.cancellationReason = cancellationReason;
    this.cancellationNote = cancellationNote.trim();
    this.noShowAt = noShowAt;
    this.noShowBy = noShowBy;
  }

  /**
   * Whether the booking keeps its room for its nights.
   * @returns {boolean}
   */
  get holdsRoom() {
    return Booking.roomHoldingStatuses.includes(this.status);
  }

  /**
   * Whether the booking can still be edited.
   * @returns {boolean}
   */
  get isEditable() {
    return Booking.editableStatuses.includes(this.status);
  }

  /**
   * Whether the booking can be confirmed.
   * @returns {boolean}
   */
  get canBeConfirmed() {
    return this.status === 'pending';
  }

  /**
   * Confirms a pending booking.
   * @param {string} at - ISO date-time of the confirmation.
   * @param {string} by - Operator who confirms.
   * @returns {Booking} Confirmed copy of the booking.
   * @throws {BookingsError} When the booking is not pending.
   */
  confirm(at, by) {
    if (!this.canBeConfirmed) throw new BookingsError('invalid-status-change');
    return new Booking({
      ...this,
      status: 'confirmed',
      confirmedAt: at,
      confirmedBy: by,
    });
  }

  /**
   * Lists the nights of the stay, from the check-in day to the day before check-out.
   * @returns {string[]} ISO days of each night.
   */
  get nights() {
    const nights = [];
    for (
      let date = this.checkInDate;
      date < this.checkOutDate;
      date = Booking.#addDays(date, 1)
    )
      nights.push(date);
    return nights;
  }

  /**
   * The ISO day of the last night of the stay.
   * @returns {string}
   */
  get lastNight() {
    return Booking.#addDays(this.checkOutDate, -1);
  }

  /**
   * Whether the stay shares at least one night with another stay.
   * @param {string} checkInDate - ISO check-in day of the other stay.
   * @param {string} checkOutDate - ISO check-out day of the other stay.
   * @returns {boolean}
   */
  overlaps(checkInDate, checkOutDate) {
    return this.checkInDate < checkOutDate && checkInDate < this.checkOutDate;
  }

  /**
   * Whether another booking uses the same room, nights, and rate plan, so its saved price still applies.
   * @param {Booking} booking - Booking to compare.
   * @returns {boolean}
   */
  hasSamePricingAs(booking) {
    return (
      this.roomTypeId === booking.roomTypeId &&
      this.ratePlanId === booking.ratePlanId &&
      this.checkInDate === booking.checkInDate &&
      this.checkOutDate === booking.checkOutDate
    );
  }

  /**
   * Validates the booking's attributes.
   * @throws {BookingsError} When a business rule is violated.
   */
  validate() {
    if (
      !this.guestName ||
      !this.guestEmail ||
      !this.roomTypeId ||
      !this.roomId ||
      !this.ratePlanId
    )
      throw new BookingsError('required-fields');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guestEmail))
      throw new BookingsError('invalid-email');
    if (!Booking.preferredLanguages.includes(this.preferredLanguage))
      throw new BookingsError('invalid-language');
    if (
      !Booking.#isCalendarDay(this.checkInDate) ||
      !Booking.#isCalendarDay(this.checkOutDate) ||
      this.checkOutDate <= this.checkInDate
    )
      throw new BookingsError('invalid-stay-dates');
    if (!Number.isInteger(this.guests) || this.guests < 1)
      throw new BookingsError('invalid-guests');
    if (!Booking.statuses.includes(this.status))
      throw new BookingsError('invalid-status');
  }
}
