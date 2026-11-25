/**
 * User entity within the IAM bounded context.
 * A user signs in to Hostera and works with the properties of its organization.
 *
 * @class User
 */
export class User {
  /**
   * Roles a user can hold within its organization.
   * @type {string[]}
   */
  static roles = ['operations-manager', 'operator'];

  /**
   * @param {Object} params - Entity attributes.
   * @param {?number} [params.id=null] - User identifier.
   * @param {string} [params.username=''] - Name the user signs in with.
   * @param {string} [params.fullName=''] - First and last names of the person who uses the account.
   * @param {?string} [params.role=null] - Role of the user within its organization, or null when unknown.
   * @param {?number} [params.organizationId=null] - Identifier of the organization of the user.
   */
  constructor({
    id = null,
    username = '',
    fullName = '',
    role = null,
    organizationId = null,
  } = {}) {
    this.id = id;
    this.username = username;
    this.fullName = fullName ?? '';
    this.role = User.roles.includes(role) ? role : null;
    this.organizationId = organizationId;
  }

  /**
   * Name that represents the user: its full name, or its username when the full name is unknown.
   * @returns {string} Display name of the user.
   */
  get displayName() {
    return this.fullName.trim() || this.username;
  }

  /**
   * Up to two uppercase letters that represent the user, taken from the parts of its display name.
   * @returns {string} Initials of the user.
   */
  get initials() {
    const parts = this.displayName.split(/[\s._-]+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
