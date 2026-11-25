import { User } from './user.entity.js';

/**
 * Session entity within the IAM bounded context.
 * It holds the signed-in user and the bearer token the Hostera Platform issued for it.
 *
 * @class Session
 */
export class Session {
  /**
   * @param {Object} params - Entity attributes.
   * @param {User} params.user - Signed-in user.
   * @param {string} params.token - Bearer token sent with every request.
   */
  constructor({ user, token }) {
    this.user = user instanceof User ? user : new User(user);
    this.token = token;
  }

  /**
   * Whether the session can authenticate requests.
   * @returns {boolean}
   */
  get isValid() {
    return Boolean(this.user.id && this.token);
  }
}
