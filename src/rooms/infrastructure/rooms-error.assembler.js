import { RoomsError } from '../domain/model/rooms.error.js';
import { toContextError } from '../../shared/infrastructure/problem-details.js';

/**
 * Assembler that translates the requests the Hostera Platform rejects into Rooms errors.
 *
 * @class RoomsErrorAssembler
 */
export class RoomsErrorAssembler {
  /**
   * Rooms error code for each problem title of the platform.
   * @type {Record<string, string>}
   */
  static codesByTitle = {
    DuplicateRoomTypeName: 'duplicate-room-type-name',
    DuplicateRoomNumber: 'duplicate-room-number',
    RoomTypeFromAnotherProperty: 'room-type-required',
    UnknownRoomType: 'room-type-required',
    InactiveRoomType: 'inactive-room-type',
    RoomTypeInUse: 'room-type-in-use',
    InvalidDateRange: 'invalid-date-range',
    RoomHeldByBooking: 'booking-controlled',
    DuplicateRatePlanName: 'duplicate-rate-plan-name',
    RoomTypeNotInRatePlan: 'room-type-not-in-plan',
  };

  /**
   * Converts a failed request into a Rooms error, or keeps it when the platform could not be reached.
   * @param {unknown} error - Error raised by the HTTP client.
   * @returns {RoomsError|unknown} Rooms error, or the original error.
   */
  static toErrorFromResponse(error) {
    return toContextError(error, RoomsError, this.codesByTitle);
  }
}
