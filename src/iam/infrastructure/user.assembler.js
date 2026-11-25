import { User } from '../domain/model/user.entity.js';

/**
 * Maps user resources of the Hostera Platform into IAM domain entities.
 *
 * @class UserAssembler
 */
export class UserAssembler {
  /**
   * User role for each role name of the platform.
   * @type {Record<string, string>}
   */
  static rolesByResourceRole = {
    OperationsManager: 'operations-manager',
    Operator: 'operator',
  };

  /**
   * @param {?string} resourceRole - Role name of the platform.
   * @returns {?string} User role, or null when the platform sent none or an unknown one.
   */
  static toRoleFromResourceRole(resourceRole) {
    return this.rolesByResourceRole[resourceRole] ?? null;
  }

  /**
   * @param {?string} role - User role.
   * @returns {?string} Role name of the platform, or null when the role is unknown.
   */
  static toResourceRoleFromRole(role) {
    const entry = Object.entries(this.rolesByResourceRole).find(
      ([, userRole]) => userRole === role,
    );
    return entry ? entry[0] : null;
  }

  /**
   * @param {Object} resource - User resource payload.
   * @returns {User} User entity.
   */
  static toEntityFromResource(resource) {
    return new User({
      id: resource['id'],
      username: resource['username'],
      fullName: resource['fullName'],
      role: this.toRoleFromResourceRole(resource['role']),
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
