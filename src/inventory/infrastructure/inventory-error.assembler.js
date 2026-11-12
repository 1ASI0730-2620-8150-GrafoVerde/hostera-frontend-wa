import { InventoryError } from '../domain/model/inventory.error.js';
import { toContextError } from '../../shared/infrastructure/problem-details.js';

/**
 * Assembler that translates the requests the Hostera Platform rejects into Inventory errors.
 *
 * @class InventoryErrorAssembler
 */
export class InventoryErrorAssembler {
  /**
   * Inventory error code for each problem title of the platform.
   * @type {Record<string, string>}
   */
  static codesByTitle = {
    StorageLocationFromAnotherProperty: 'location-required',
    DuplicateStorageLocationCode: 'duplicate-location',
    DuplicateInventoryItemCode: 'duplicate-item-code',
    StorageLocationInUse: 'location-in-use',
    StorageLocationNotAssigned: 'location-required',
    StorageLocationAssignmentInUse: 'assignment-in-use',
    UnitChangeNotAllowed: 'unit-locked',
    InvalidAdjustmentReason: 'invalid-reason',
    InsufficientStock: 'insufficient-stock',
  };

  /**
   * Converts a failed request into an Inventory error, or keeps it when the platform could not be reached.
   * @param {unknown} error - Error raised by the HTTP client.
   * @returns {InventoryError|unknown} Inventory error, or the original error.
   */
  static toErrorFromResponse(error) {
    return toContextError(error, InventoryError, this.codesByTitle);
  }
}
