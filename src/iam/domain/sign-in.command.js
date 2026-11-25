/**
 * Command that asks the Hostera Platform to authenticate a user.
 *
 * @class SignInCommand
 */
export class SignInCommand {
  /**
   * @param {Object} params - Command attributes.
   * @param {string} params.username - Name the user signs in with.
   * @param {string} params.password - Password of the user.
   */
  constructor({ username, password }) {
    this.username = username.trim();
    this.password = password;
  }
}
