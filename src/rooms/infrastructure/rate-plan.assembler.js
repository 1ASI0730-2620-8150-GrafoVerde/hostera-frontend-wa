import { RatePlan } from '../domain/model/rate-plan.entity.js';

/**
 * Maps rate plan resources into Rooms domain entities.
 *
 * @class RatePlanAssembler
 */
export class RatePlanAssembler {
  /**
   * @param {Object} resource - Rate plan resource payload.
   * @returns {RatePlan} Rate plan entity.
   */
  static toEntityFromResource(resource) {
    return new RatePlan({
      ...resource,
      includedServices: resource.includedServices?.[0] ?? 'room-only',
      cancellationPolicy: resource.cancellationPolicy ?? '',
    });
  }

  /**
   * Parses rate plan resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with rate plan resources.
   * @returns {RatePlan[]} Rate plan entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['rate-plans'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a rate plan entity into the resource that creates it.
   * The platform keeps a list of included services, whereas the rate plan offers one board option.
   * @param {RatePlan} entity - Rate plan entity.
   * @returns {Object} Create rate plan resource.
   */
  static toCreateResourceFromEntity(entity) {
    return {
      name: entity.name,
      refundable: entity.refundable,
      cancellationPolicy: entity.refundable ? entity.cancellationPolicy : null,
      includedServices: [entity.includedServices],
      roomTypeIds: [...entity.roomTypeIds],
    };
  }

  /**
   * Converts a rate plan entity into the resource that updates it, including its activation.
   * @param {RatePlan} entity - Rate plan entity.
   * @returns {Object} Update rate plan resource.
   */
  static toUpdateResourceFromEntity(entity) {
    return {
      ...this.toCreateResourceFromEntity(entity),
      status: entity.status,
    };
  }
}
