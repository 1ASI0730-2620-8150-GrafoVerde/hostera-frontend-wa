import { User } from '../domain/model/user.entity.js';

/**
 * Maps user resources of the Hostera Platform into IAM domain entities.
 *
 * @class UserAssembler
 */
export class UserAssembler {
  /**
   * @param {Object} resource - User resource payload.
   * @returns {User} User entity.
   */
  static toEntityFromResource(resource) {
    return new User({
      id: resource['id'],
      username: resource['username'],
      organizationId: resource['organizationId'],
    });
  }

  /**
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response with one user resource.
   * @returns {User} User entity.
   */
  static toEntityFromResponse(response) {
    return this.toEntityFromResource(response.data);
  }
}
