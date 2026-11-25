import { IamError } from './model/iam.error.js';

/**
 * Command that registers a new user, who starts a new organization without properties.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
  /**
   * Longest username the platform accepts.
   * @type {number}
   */
  static usernameMaxLength = 50;

  /**
   * Fewest characters of a password.
   * @type {number}
   */
  static passwordMinLength = 8;

  /**
   * Most characters of a password.
   * @type {number}
   */
  static passwordMaxLength = 64;

  /**
   * @param {Object} params - Command attributes.
   * @param {string} params.username - Name the new user will sign in with.
   * @param {string} params.password - Password of the new user.
   * @throws {IamError} When the username is empty or too long, or the password has an invalid length.
   */
  constructor({ username, password }) {
    const normalizedUsername = username.trim();
    if (!normalizedUsername) throw new IamError('username-required');
    if (normalizedUsername.length > SignUpCommand.usernameMaxLength)
      throw new IamError('username-too-long');
    if (
      password.length < SignUpCommand.passwordMinLength ||
      password.length > SignUpCommand.passwordMaxLength
    )
      throw new IamError('invalid-password-length');
    this.username = normalizedUsername;
    this.password = password;
  }
}
