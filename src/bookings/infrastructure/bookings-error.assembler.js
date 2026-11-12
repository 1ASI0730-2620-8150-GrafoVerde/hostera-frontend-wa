import { BookingsError } from '../domain/model/bookings.error.js';
import { toContextError } from '../../shared/infrastructure/problem-details.js';

/**
 * Assembler that translates the requests the Hostera Platform rejects into Bookings errors.
 *
 * @class BookingsErrorAssembler
 */
export class BookingsErrorAssembler {
  /**
   * Bookings error code for each problem title of the platform.
   * @type {Record<string, string>}
   */
  static codesByTitle = {
    InvalidStayDates: 'invalid-stay-dates',
    RoomTypeNotFound: 'room-type-required',
    RatePlanNotFound: 'rate-plan-required',
    RoomNotInRoomType: 'room-not-in-room-type',
    InactiveRoomType: 'inactive-room-type',
    InactiveRatePlan: 'inactive-rate-plan',
    RatePlanNotForRoomType: 'rate-plan-not-for-room-type',
    OverCapacity: 'over-capacity',
    RoomUnavailable: 'room-unavailable',
    NotEditable: 'not-editable',
    InvalidStatusChange: 'invalid-status-change',
    CancellationReasonRequired: 'invalid-cancellation-reason',
    CancellationNoteRequired: 'cancellation-note-required',
    PaymentsNotAccepted: 'payments-not-accepted',
    InvalidPaymentAmount: 'invalid-payment-amount',
    PaymentExceedsBalance: 'payment-exceeds-balance',
    InvalidPaymentDate: 'invalid-payment-date',
    IdentityNotVerified: 'identity-not-verified',
    KeyCardRequired: 'key-card-required',
    KeyCardsNotIssued: 'key-cards-not-issued',
    BalanceDue: 'balance-due',
    ConcurrencyConflict: 'concurrency-conflict',
  };

  /**
   * Converts a failed request into a Bookings error, or keeps it when the platform could not be reached.
   * @param {unknown} error - Error raised by the HTTP client.
   * @returns {BookingsError|unknown} Bookings error, or the original error.
   */
  static toErrorFromResponse(error) {
    return toContextError(error, BookingsError, this.codesByTitle);
  }
}
