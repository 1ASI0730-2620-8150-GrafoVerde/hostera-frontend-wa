import { Credential } from '../domain/model/credential.entity.js';

/**
 * Maps credential resources into Access Control domain entities.
 *
 * @class CredentialAssembler
 */
export class CredentialAssembler {
  /**
   * @param {Object} resource - Credential resource payload.
   * @returns {Credential} Credential entity.
   */
  static toEntityFromResource(resource) {
    return new Credential({
      ...resource,
      revocationNote: resource.revocationNote ?? '',
    });
  }

  /**
   * Parses credential resources from a response and maps them into entities.
   *
   * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with credential resources.
   * @returns {Credential[]} Credential entities.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources =
      response.data instanceof Array
        ? response.data
        : response.data['credentials'];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a staff credential draft into the resource that issues it on the encoded card.
   * @param {Credential} entity - Staff credential to issue.
   * @param {number} issuedBy - Staff member who issues the credential.
   * @returns {Object} Issue staff credential resource.
   */
  static toIssueStaffCredentialResourceFromEntity(entity, issuedBy) {
    return {
      staffMemberId: entity.staffMemberId,
      scope: entity.scope,
      validFrom: entity.validFrom,
      validUntil: entity.validUntil || null,
      cardId: entity.cardId,
      issuedBy,
    };
  }

  /**
   * Converts a revoked credential into the resource that revokes it.
   * @param {Credential} entity - Revoked copy of the credential.
   * @param {number} operatorId - Staff member who revokes the credential.
   * @returns {Object} Revoke credential resource.
   */
  static toRevokeResourceFromEntity(entity, operatorId) {
    return {
      reason: entity.revocationReason,
      note: entity.revocationNote || null,
      operatorId,
    };
  }

  /**
   * Builds the resource that replaces a credential with a newly encoded card.
   * @param {string} cardId - Card ID of the new card.
   * @param {number} operatorId - Staff member who replaces the credential.
   * @returns {Object} Replace credential resource.
   */
  static toReplaceResource(cardId, operatorId) {
    return { cardId, operatorId };
  }
}
