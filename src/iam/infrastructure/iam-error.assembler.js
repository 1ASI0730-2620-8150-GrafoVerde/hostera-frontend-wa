import { IamError } from '../domain/model/iam.error.js';
import { toContextError } from '../../shared/infrastructure/problem-details.js';

/**
 * Assembler that translates the requests the Hostera Platform rejects into IAM errors.
 *
 * @class IamErrorAssembler
 */
export class IamErrorAssembler {
  /**
   * IAM error code for each problem title of the platform.
   * @type {Record<string, string>}
   */
  static codesByTitle = {
    InvalidCredentials: 'invalid-credentials',
    UsernameAlreadyTaken: 'username-taken',
    InvalidInput: 'invalid-input',
    AuthenticationRequired: 'authentication-required',
  };

  /**
   * Converts a failed request into an IAM error, or keeps it when the platform could not be reached.
   * @param {unknown} error - Error raised by the HTTP client.
   * @returns {IamError|unknown} IAM error, or the original error.
   */
  static toErrorFromResponse(error) {
    return toContextError(error, IamError, this.codesByTitle);
  }
}
