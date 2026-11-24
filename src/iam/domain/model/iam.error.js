/**
 * Business-rule violation raised within the IAM bounded context.
 *
 * @class IamError
 * @extends Error
 */
export class IamError extends Error {
  /**
   * @param {string} code - Identifier of the violated business rule.
   */
  constructor(code) {
    super(code);
    this.name = 'IamError';
    this.code = code;
  }
}
