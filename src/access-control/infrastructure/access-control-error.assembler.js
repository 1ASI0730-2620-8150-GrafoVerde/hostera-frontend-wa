import { AccessControlError } from '../domain/model/access-control.error.js';
import { toContextError } from '../../shared/infrastructure/problem-details.js';

/**
 * Assembler that translates the requests the Hostera Platform rejects into Access Control errors.
 *
 * @class AccessControlErrorAssembler
 */
export class AccessControlErrorAssembler {
  /**
   * Access Control error code for each problem title of the platform.
   * @type {Record<string, string>}
   */
  static codesByTitle = {
    StaffMemberNotFound: 'staff-member-required',
    StaffCredentialExists: 'staff-credential-exists',
    DuplicateCardId: 'duplicate-card-id',
    CredentialNotUsable: 'invalid-credential-change',
  };

  /**
   * Converts a failed request into an Access Control error, or keeps it when the platform could not be reached.
   * @param {unknown} error - Error raised by the HTTP client.
   * @returns {AccessControlError|unknown} Access Control error, or the original error.
   */
  static toErrorFromResponse(error) {
    return toContextError(error, AccessControlError, this.codesByTitle);
  }
}
