import { IamError } from './model/iam.error.js';

/**
 * Command that registers a new user, who starts a new organization without properties.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
  /**
   * Fewest characters of a full name.
   * @type {number}
   */
  static fullNameMinLength = 2;

  /**
   * Most characters of a full name.
   * @type {number}
   */
  static fullNameMaxLength = 100;

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
   * @param {string} params.fullName - First and last names of the person who will use the account.
   * @param {string} params.username - Name the new user will sign in with.
   * @param {string} params.password - Password of the new user.
   * @throws {IamError} When the full name is empty or has an invalid length, the username is empty or too long, or the password has an invalid length.
   */
  constructor({ fullName, username, password }) {
    const normalizedFullName = fullName.trim();
    if (!normalizedFullName) throw new IamError('full-name-required');
    if (
      normalizedFullName.length < SignUpCommand.fullNameMinLength ||
      normalizedFullName.length > SignUpCommand.fullNameMaxLength
    )
      throw new IamError('invalid-full-name-length');
    const normalizedUsername = username.trim();
    if (!normalizedUsername) throw new IamError('username-required');
    if (normalizedUsername.length > SignUpCommand.usernameMaxLength)
      throw new IamError('username-too-long');
    if (
      password.length < SignUpCommand.passwordMinLength ||
      password.length > SignUpCommand.passwordMaxLength
    )
      throw new IamError('invalid-password-length');
    this.fullName = normalizedFullName;
    this.username = normalizedUsername;
    this.password = password;
  }
}
