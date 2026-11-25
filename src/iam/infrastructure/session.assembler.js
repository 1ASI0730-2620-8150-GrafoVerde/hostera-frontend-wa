import { Session } from '../domain/model/session.entity.js';
import { UserAssembler } from './user.assembler.js';

/**
 * Maps the authenticated user that the Hostera Platform returns on sign-in into an IAM session.
 *
 * @class SessionAssembler
 */
export class SessionAssembler {
  /**
   * @param {{id: number, username: string, organizationId: number, token: string}} resource - Authenticated user resource.
   * @returns {Session} Session entity.
   */
  static toEntityFromResource(resource) {
    return new Session({
      user: UserAssembler.toEntityFromResource(resource),
      token: resource['token'],
    });
  }

  /**
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response of the sign-in endpoint.
   * @returns {Session} Session entity.
   */
  static toEntityFromResponse(response) {
    return this.toEntityFromResource(response.data);
  }

  /**
   * @param {Session} session - Session entity.
   * @returns {{id: number, username: string, organizationId: number, token: string}} Resource kept in the browser.
   */
  static toResourceFromEntity(session) {
    return {
      id: session.user.id,
      username: session.user.username,
      organizationId: session.user.organizationId,
      token: session.token,
    };
  }
}
