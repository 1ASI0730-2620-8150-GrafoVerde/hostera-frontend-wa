import { PropertyOverview } from '../domain/model/property-overview.entity.js';

/**
 * Maps the property overviews of the Hostera Platform into property overview entities.
 *
 * @class PropertyOverviewAssembler
 */
export class PropertyOverviewAssembler {
  /**
   * Converts a property overview resource into an entity.
   * @param {Object} resource - Property overview resource.
   * @returns {PropertyOverview} Property overview entity.
   */
  static toEntityFromResource(resource) {
    return new PropertyOverview({
      propertyId: resource.propertyId,
      name: resource.name,
      roomsCount: resource.roomsCount,
      heldRooms: resource.heldRooms,
      roomsNeedingCleaning: resource.roomsNeedingCleaning,
      roomsOutOfOrder: resource.roomsOutOfOrder,
    });
  }

  /**
   * Converts the property overviews response into entities.
   * @param {import('axios').AxiosResponse<{overviews: Object[]}>} response - HTTP response.
   * @returns {PropertyOverview[]} Property overview entities, or an empty list when the request failed.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    return response.data.overviews.map((resource) =>
      this.toEntityFromResource(resource),
    );
  }
}
