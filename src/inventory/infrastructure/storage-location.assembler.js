import { StorageLocation } from '../domain/model/storage-location.entity.js';

/**
 * Maps storage location resources of the Hostera Platform API into Inventory domain entities, and storage location
 * entities into API resources.
 *
 * @class StorageLocationAssembler
 */
export class StorageLocationAssembler {
  /**
   * @param {Object} resource - Storage location resource payload.
   * @returns {StorageLocation} Storage location entity.
   */
  static toEntityFromResource(resource) {
    return new StorageLocation({
      ...resource,
      description: resource.description ?? '',
    });
  }

  /**
   * Parses storage location resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with storage location resources.
   * @returns {StorageLocation[]} Storage location entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['storage-locations'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a new storage location into the create resource expected by the API.
   * @param {StorageLocation} entity - Storage location to create.
   * @returns {Object} Create storage location resource.
   */
  static toCreateResourceFromEntity(entity) {
    return {
      code: entity.code,
      ...this.toUpdateResourceFromEntity(entity),
    };
  }

  /**
   * Maps a storage location into the update resource expected by the API. The code cannot change.
   * @param {StorageLocation} entity - Storage location with its updated data.
   * @returns {Object} Update storage location resource.
   */
  static toUpdateResourceFromEntity(entity) {
    return {
      name: entity.name,
      type: entity.type,
      area: entity.area,
      responsibleTeam: entity.responsibleTeam,
      description: entity.description || null,
    };
  }
}
