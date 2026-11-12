import { StatusPeriod } from '../domain/model/status-period.entity.js';

/**
 * Maps status period resources into Rooms domain entities.
 *
 * @class StatusPeriodAssembler
 */
export class StatusPeriodAssembler {
  /**
   * @param {Object} resource - Status period resource payload.
   * @returns {StatusPeriod} Status period entity.
   */
  static toEntityFromResource(resource) {
    return new StatusPeriod({ ...resource });
  }

  /**
   * Parses status period resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with status period resources.
   * @returns {StatusPeriod[]} Status period entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['status-periods'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a set-room-status command into the resource that sets or releases the status of a room.
   * @param {import('../domain/set-room-status.command.js').SetRoomStatusCommand} command - Set-room-status command.
   * @returns {Object} Set room status resource.
   */
  static toResourceFromCommand(command) {
    return {
      status: command.status,
      startDate: command.startDate,
      endDate: command.endDate,
      reason: command.status === 'available' ? null : command.reason.trim(),
    };
  }
}
