/**
 * User entity within the IAM bounded context.
 * A user signs in to Hostera and works with the properties of its organization.
 *
 * @class User
 */
export class User {
  /**
   * @param {Object} params - Entity attributes.
   * @param {?number} [params.id=null] - User identifier.
   * @param {string} [params.username=''] - Name the user signs in with.
   * @param {?number} [params.organizationId=null] - Identifier of the organization of the user.
   */
  constructor({ id = null, username = '', organizationId = null } = {}) {
    this.id = id;
    this.username = username;
    this.organizationId = organizationId;
  }

  /**
   * Up to two uppercase letters that represent the user, taken from the parts of its username.
   * @returns {string} Initials of the user.
   */
  get initials() {
    const parts = this.username.split(/[\s._-]+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
