import { DailyRate } from '../domain/model/daily-rate.entity.js';

/**
 * Maps daily rate resources into Rooms domain entities.
 *
 * @class DailyRateAssembler
 */
export class DailyRateAssembler {
  /**
   * @param {Object} resource - Daily rate resource payload.
   * @returns {DailyRate} Daily rate entity.
   */
  static toEntityFromResource(resource) {
    return new DailyRate({ ...resource });
  }

  /**
   * Parses daily rate resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with daily rate resources.
   * @returns {DailyRate[]} Daily rate entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['daily-rates'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a set-daily-rates command into the resource that sets the nightly rate of a date range.
   * A null amount returns the nights to the base nightly rate of the room type.
   * @param {import('../domain/set-daily-rates.command.js').SetDailyRatesCommand} command - Set-daily-rates command.
   * @returns {Object} Set daily rates resource.
   */
  static toResourceFromCommand(command) {
    return {
      roomTypeId: command.roomTypeId,
      startDate: command.startDate,
      endDate: command.endDate,
      amount: command.useBaseRate ? null : command.amount,
    };
  }
}
