import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const propertiesEndpointPath = import.meta.env.VITE_PROPERTIES_ENDPOINT_PATH;
const inventoryItemsEndpointPath = import.meta.env
  .VITE_INVENTORY_ITEMS_ENDPOINT_PATH;
const storageLocationsEndpointPath = import.meta.env
  .VITE_STORAGE_LOCATIONS_ENDPOINT_PATH;
const stockAdjustmentsEndpointPath = import.meta.env
  .VITE_STOCK_ADJUSTMENTS_ENDPOINT_PATH;
const inventoryStocksEndpointPath = import.meta.env
  .VITE_INVENTORY_STOCKS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Inventory bounded-context endpoints of the Hostera Platform RESTful API.
 *
 * Collections are scoped to a property, as in
 * `/properties/{propertyId}/inventory-items`, while single resources are reached by their own identifier,
 * as in `/inventory-items/{id}`.
 *
 * @class InventoryApi
 * @extends BaseApi
 */
export class InventoryApi extends BaseApi {
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #propertiesEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #inventoryItemsEndpoint;
  /**
   * @type {BaseEndpoint}
   * @private
   */
  #storageLocationsEndpoint;

  /** Creates endpoint clients for properties, inventory items, and storage locations. */
  constructor() {
    super(hosteraPlatformApiUrl);
    this.#propertiesEndpoint = new BaseEndpoint(this, propertiesEndpointPath);
    this.#inventoryItemsEndpoint = new BaseEndpoint(
      this,
      inventoryItemsEndpointPath,
    );
    this.#storageLocationsEndpoint = new BaseEndpoint(
      this,
      storageLocationsEndpointPath,
    );
  }

  /**
   * Builds the path of a collection that belongs to a property.
   * @param {number|string} propertyId - The ID of the property.
   * @param {string} collectionPath - The path of the collection.
   * @returns {string} The property-scoped collection path.
   * @private
   */
  #propertyCollectionPath(propertyId, collectionPath) {
    return `${propertiesEndpointPath}/${propertyId}${collectionPath}`;
  }

  /**
   * Fetches all properties.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the properties' response.
   */
  getProperties() {
    return this.#propertiesEndpoint.getAll();
  }

  /**
   * Fetches the inventory items of a property.
   * @param {number|string} propertyId - The ID of the property.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the inventory items' response.
   */
  getInventoryItems(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, inventoryItemsEndpointPath),
    );
  }

  /**
   * Creates an inventory item in a property.
   * @param {number|string} propertyId - The ID of the property.
   * @param {Object} resource - Create inventory item resource.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created inventory item response.
   */
  createInventoryItem(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, inventoryItemsEndpointPath),
      resource,
    );
  }

  /**
   * Updates an inventory item.
   * @param {number|string} id - The ID of the inventory item.
   * @param {Object} resource - Update inventory item resource.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated inventory item response.
   */
  updateInventoryItem(id, resource) {
    return this.#inventoryItemsEndpoint.update(id, resource);
  }

  /**
   * Records a stock adjustment or transfer for an inventory item.
   * @param {number|string} id - The ID of the inventory item.
   * @param {Object} resource - Adjust stock resource.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the adjusted inventory item response.
   */
  adjustStock(id, resource) {
    return this.http.post(
      `${inventoryItemsEndpointPath}/${id}${stockAdjustmentsEndpointPath}`,
      resource,
    );
  }

  /**
   * Removes an empty secondary storage location from an inventory item.
   * @param {number|string} id - The ID of the inventory item.
   * @param {number|string} storageLocationId - The ID of the storage location to remove.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated inventory item response.
   */
  unassignStorageLocation(id, storageLocationId) {
    return this.http.delete(
      `${inventoryItemsEndpointPath}/${id}${inventoryStocksEndpointPath}/${storageLocationId}`,
    );
  }

  /**
   * Fetches the storage locations of a property.
   * @param {number|string} propertyId - The ID of the property.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the storage locations' response.
   */
  getStorageLocations(propertyId) {
    return this.http.get(
      this.#propertyCollectionPath(propertyId, storageLocationsEndpointPath),
    );
  }

  /**
   * Creates a storage location in a property.
   * @param {number|string} propertyId - The ID of the property.
   * @param {Object} resource - Create storage location resource.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created storage location response.
   */
  createStorageLocation(propertyId, resource) {
    return this.http.post(
      this.#propertyCollectionPath(propertyId, storageLocationsEndpointPath),
      resource,
    );
  }

  /**
   * Updates a storage location.
   * @param {number|string} id - The ID of the storage location.
   * @param {Object} resource - Update storage location resource.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated storage location response.
   */
  updateStorageLocation(id, resource) {
    return this.#storageLocationsEndpoint.update(id, resource);
  }

  /**
   * Deletes a storage location by its ID.
   * @param {number|string} id - The ID of the storage location to delete.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
   */
  deleteStorageLocation(id) {
    return this.#storageLocationsEndpoint.delete(id);
  }
}
