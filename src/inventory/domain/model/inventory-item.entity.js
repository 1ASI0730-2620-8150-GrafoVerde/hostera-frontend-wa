import { InventoryError } from './inventory.error.js';

/**
 * Inventory item entity within the Inventory bounded context.
 * It tracks one kind of supply, its quantities by storage location, and its stock history.
 *
 * @class InventoryItem
 */
export class InventoryItem {
  /**
   * Supported units of measure.
   * @type {string[]}
   */
  static units = ['units', 'liters', 'kilograms'];

  /**
   * Supported inventory item categories.
   * @type {string[]}
   */
  static categories = [
    'linen',
    'guest-amenities',
    'cleaning-supplies',
    'access-supplies',
  ];

  /**
   * @param {Object} params - Entity attributes.
   * @param {?number} [params.id=null] - Inventory item identifier.
   * @param {?number} [params.propertyId=null] - Identifier of the owning property.
   * @param {string} [params.name=''] - Inventory item name.
   * @param {string} [params.code=''] - Item code, unique within the property.
   * @param {string} [params.category=''] - Inventory item category.
   * @param {string} [params.unit='units'] - Unit of measure.
   * @param {?number} [params.primaryLocationId=null] - Identifier of the primary storage location.
   * @param {number} [params.lowStockThreshold=0] - Property-wide low-stock threshold.
   * @param {Array<{locationId: number, quantity: number}>} [params.stocks=[]] - On-hand quantities by storage location.
   * @param {StockAdjustment[]} [params.adjustments=[]] - Stock adjustment history.
   */
  constructor({
    id = null,
    propertyId = null,
    name = '',
    code = '',
    category = '',
    unit = 'units',
    primaryLocationId = null,
    lowStockThreshold = 0,
    stocks = [],
    adjustments = [],
  }) {
    this.id = id;
    this.propertyId = propertyId;
    this.name = name.trim();
    this.code = code.trim();
    this.category = category.trim();
    this.unit = unit;
    this.primaryLocationId = primaryLocationId;
    this.lowStockThreshold = lowStockThreshold;
    this.stocks = stocks;
    this.adjustments = adjustments;
  }

  /**
   * Validates a quantity expressed in the given unit of measure.
   * @param {number} quantity - Quantity to validate.
   * @param {string} unit - Unit of measure.
   * @param {boolean} [allowZero=false] - Whether zero is a valid quantity.
   * @throws {InventoryError} When the quantity is invalid for the unit.
   */
  static validateQuantity(quantity, unit, allowZero = false) {
    if (
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      (!allowZero && quantity === 0)
    )
      throw new InventoryError('invalid-quantity');
    if (unit === 'units' && !Number.isInteger(quantity))
      throw new InventoryError('whole-units');
  }

  /**
   * Total on-hand quantity across the property's storage locations.
   * @returns {number}
   */
  get totalQuantity() {
    return Number(
      this.stocks
        .reduce((total, stock) => total + stock.quantity, 0)
        .toFixed(6),
    );
  }

  /**
   * Stock condition based on the total quantity and the low-stock threshold.
   * @returns {'in-stock'|'low-stock'|'out-of-stock'}
   */
  get stockCondition() {
    if (this.totalQuantity === 0) return 'out-of-stock';
    return this.totalQuantity <= this.lowStockThreshold
      ? 'low-stock'
      : 'in-stock';
  }

  /**
   * Returns the on-hand quantity at one storage location.
   * @param {number} locationId - Storage location identifier.
   * @returns {number}
   */
  quantityAt(locationId) {
    return (
      this.stocks.find((stock) => stock.locationId === locationId)?.quantity ??
      0
    );
  }

  /**
   * Validates the inventory item's required attributes.
   * @throws {InventoryError} When a business rule is violated.
   */
  validate() {
    if (!this.name || !this.code || !this.category || !this.primaryLocationId)
      throw new InventoryError('required-fields');
    if (!InventoryItem.units.includes(this.unit))
      throw new InventoryError('invalid-unit');
    InventoryItem.validateQuantity(this.lowStockThreshold, this.unit, true);
  }

  /**
   * Ensures the item has a stock entry at the given storage location.
   * @param {number} locationId - Storage location identifier.
   * @returns {InventoryItem} Item with the storage location assigned.
   */
  assignStorageLocation(locationId) {
    if (this.stocks.some((stock) => stock.locationId === locationId))
      return this;
    return new InventoryItem({
      ...this,
      stocks: [...this.stocks, { locationId, quantity: 0 }],
    });
  }

  /**
   * Removes an empty secondary storage location assignment.
   * @param {number} locationId - Storage location identifier.
   * @returns {InventoryItem} Item without the storage location assignment.
   * @throws {InventoryError} When the location is primary or still holds stock.
   */
  unassignStorageLocation(locationId) {
    if (
      this.primaryLocationId === locationId ||
      this.quantityAt(locationId) !== 0
    )
      throw new InventoryError('assignment-in-use');
    return new InventoryItem({
      ...this,
      stocks: this.stocks.filter((stock) => stock.locationId !== locationId),
    });
  }

}
