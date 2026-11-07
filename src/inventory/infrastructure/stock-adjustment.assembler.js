import { StockAdjustment } from '../domain/model/stock-adjustment.entity.js';

/**
 * Maps stock adjustment resources of the Hostera Platform API into Inventory domain entities, and adjust-stock
 * commands into API resources.
 *
 * The API records each adjustment with a signed `quantityChange` and labels both rows of a transfer with the
 * `transfer` operation. The domain keeps a positive quantity with an `in` or `out` direction, so the assembler
 * derives the direction from the sign of the change.
 *
 * @class StockAdjustmentAssembler
 */
export class StockAdjustmentAssembler {
  /**
   * @param {Object} resource - Stock adjustment resource payload.
   * @returns {StockAdjustment} Stock adjustment entity.
   */
  static toEntityFromResource(resource) {
    return new StockAdjustment({
      id: resource.id,
      operation: resource.quantityChange < 0 ? 'out' : 'in',
      quantity: Math.abs(resource.quantityChange),
      locationId: resource.storageLocationId,
      reason: resource.reason,
      note: resource.note ?? '',
      recordedAt: resource.recordedAt,
      operator: resource.operator,
      transferId: resource.transferId ?? null,
    });
  }

  /**
   * Maps an adjust-stock command into the resource expected by the API.
   * @param {import('../domain/adjust-stock.command.js').AdjustStockCommand} command - Adjust-stock command.
   * @param {string} operator - Name of the staff member who records the movement.
   * @returns {Object} Adjust stock resource.
   */
  static toResourceFromCommand(command, operator) {
    return {
      operation: command.operation,
      quantity: command.quantity,
      storageLocationId: command.locationId,
      destinationStorageLocationId:
        command.operation === 'transfer' ? command.destinationLocationId : null,
      reason: command.reason,
      note: command.note?.trim() || null,
      operator,
    };
  }
}
