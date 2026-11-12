import { InventoryItem } from '../domain/model/inventory-item.entity.js';
import { StockAdjustmentAssembler } from './stock-adjustment.assembler.js';

/**
 * Maps inventory item resources of the Hostera Platform API, including their stock and history, into Inventory
 * domain entities, and inventory item entities into API resources.
 *
 * @class InventoryItemAssembler
 */
export class InventoryItemAssembler {
  /**
   * @param {Object} resource - Inventory item resource payload.
   * @returns {InventoryItem} Inventory item entity.
   */
  static toEntityFromResource(resource) {
    return new InventoryItem({
      id: resource.id,
      propertyId: resource.propertyId,
      name: resource.name,
      code: resource.code,
      category: resource.category,
      unit: resource.unit,
      primaryLocationId: resource.primaryLocationId,
      lowStockThreshold: resource.lowStockThreshold,
      stocks: (resource.stocks ?? []).map((stock) => ({
        locationId: stock.storageLocationId,
        quantity: stock.quantity,
      })),
      adjustments: (resource.adjustments ?? []).map((adjustment) =>
        StockAdjustmentAssembler.toEntityFromResource(adjustment),
      ),
    });
  }

  /**
   * Parses inventory item resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with inventory item resources.
   * @returns {InventoryItem[]} Inventory item entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['inventory-items'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a new inventory item into the create resource expected by the API.
   * The platform records the opening quantity in the primary location in the same operation.
   * @param {InventoryItem} entity - Inventory item to create.
   * @param {number} [openingQuantity=0] - Stock received in the primary location when the item is created.
   * @param {?string} [operator=null] - Operator who records the opening stock.
   * @returns {Object} Create inventory item resource.
   */
  static toCreateResourceFromEntity(
    entity,
    openingQuantity = 0,
    operator = null,
  ) {
    return {
      code: entity.code,
      ...this.toUpdateResourceFromEntity(entity),
      openingQuantity,
      operator,
    };
  }

  /**
   * Maps an inventory item into the update resource expected by the API. The code cannot change.
   * @param {InventoryItem} entity - Inventory item with its updated data.
   * @returns {Object} Update inventory item resource.
   */
  static toUpdateResourceFromEntity(entity) {
    return {
      name: entity.name,
      category: entity.category,
      unit: entity.unit,
      primaryLocationId: entity.primaryLocationId,
      lowStockThreshold: entity.lowStockThreshold,
    };
  }
}
