import { RoomAssignment } from '../domain/model/room-assignment.entity.js';

/**
 * Maps room assignment resources into Rooms domain entities.
 *
 * @class RoomAssignmentAssembler
 */
export class RoomAssignmentAssembler {
  /**
   * @param {Object} resource - Room assignment resource payload.
   * @returns {RoomAssignment} Room assignment entity.
   */
  static toEntityFromResource(resource) {
    return new RoomAssignment({ ...resource });
  }

  /**
   * Parses room assignment resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with room assignment resources.
   * @returns {RoomAssignment[]} Room assignment entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['room-assignments'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
