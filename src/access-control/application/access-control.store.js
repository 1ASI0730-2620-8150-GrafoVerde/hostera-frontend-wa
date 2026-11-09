/**
 * Application service store for the Access Control bounded context.
 * It coordinates credential use cases with the RFID encoder and keeps UI-facing state.
 *
 * @module useAccessControlStore
 */
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { AccessControlApi } from '../infrastructure/access-control-api.js';
import { CredentialAssembler } from '../infrastructure/credential.assembler.js';
import { StaffMemberAssembler } from '../infrastructure/staff-member.assembler.js';
import { AccessEventAssembler } from '../infrastructure/access-event.assembler.js';
import { AccessControlErrorAssembler } from '../infrastructure/access-control-error.assembler.js';
import { RfidEncoder } from '../infrastructure/rfid-encoder.js';
import { Credential } from '../domain/model/credential.entity.js';
import { AccessControlError } from '../domain/model/access-control.error.js';
import useRoomsStore from '../../rooms/application/rooms.store.js';

const accessControlApi = new AccessControlApi();
const rfidEncoder = new RfidEncoder();

/**
 * Staff member recorded as the operator of credential changes until IAM is implemented.
 * @type {number}
 */
const demoOperatorId = Number(import.meta.env.VITE_DEMO_OPERATOR_ID);

/**
 * Local hour at which guest key cards stop opening doors on the check-out day.
 * @type {number}
 */
const checkOutHour = 11;

/**
 * Reactive store that exposes Access Control commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useAccessControlStore = defineStore('access-control', () => {
  const roomsStore = useRoomsStore();

  /**
   * List of credential entities of the current property.
   * @type {import('vue').Ref<Credential[]>}
   */
  const credentials = ref([]);
  /**
   * List of staff member entities of the current property.
   * @type {import('vue').Ref<StaffMember[]>}
   */
  const staffMembers = ref([]);
  /**
   * List of access event entities of the current property.
   * @type {import('vue').Ref<AccessEvent[]>}
   */
  const accessEvents = ref([]);
  /**
   * List of errors encountered during API operations.
   * @type {import('vue').Ref<Error[]>}
   */
  const errors = ref([]);
  /**
   * Whether credentials have been loaded from the API.
   * @type {import('vue').Ref<boolean>}
   */
  const credentialsLoaded = ref(false);
  /**
   * Whether staff members have been loaded from the API.
   * @type {import('vue').Ref<boolean>}
   */
  const staffMembersLoaded = ref(false);
  /**
   * Whether access events have been loaded from the API.
   * @type {import('vue').Ref<boolean>}
   */
  const accessEventsLoaded = ref(false);
  /**
   * Whether a create or update operation is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const saving = ref(false);
  /**
   * State of the front desk RFID encoder.
   * @type {import('vue').Ref<'ready'|'encoding'|'verifying'|'encoded'|'failed'>}
   */
  const encoderState = ref('ready');
  /**
   * Identifier of the property whose access is managed, shared with the Rooms context.
   * @type {import('vue').ComputedRef<?number>}
   */
  const currentPropertyId = computed(() => roomsStore.currentPropertyId);

  /**
   * Loads one property-scoped collection and ignores responses for a previously selected property.
   * @param {(propertyId: number) => Promise<import('axios').AxiosResponse>} request - Infrastructure request.
   * @param {{toEntitiesFromResponse: Function}} assembler - Assembler for the collection.
   * @param {import('vue').Ref<Array>} collection - Collection state.
   * @param {import('vue').Ref<boolean>} loaded - Loaded flag of the collection.
   * @returns {Promise<void>}
   */
  function fetchCollection(request, assembler, collection, loaded) {
    const propertyId = currentPropertyId.value;
    collection.value = [];
    loaded.value = false;
    if (!propertyId) return Promise.resolve();
    return request(propertyId)
      .then((response) => {
        if (propertyId !== currentPropertyId.value) return;
        collection.value = assembler.toEntitiesFromResponse(response);
        loaded.value = true;
      })
      .catch((error) => {
        if (propertyId === currentPropertyId.value) errors.value.push(error);
      });
  }

  /**
   * Loads the current property's credentials, staff members, and access events.
   * @returns {Promise<void>}
   */
  function fetchAccessControl() {
    errors.value = [];
    return Promise.all([
      fetchCollection(
        (propertyId) => accessControlApi.getCredentials(propertyId),
        CredentialAssembler,
        credentials,
        credentialsLoaded,
      ),
      fetchCollection(
        (propertyId) => accessControlApi.getStaffMembers(propertyId),
        StaffMemberAssembler,
        staffMembers,
        staffMembersLoaded,
      ),
      fetchCollection(
        (propertyId) => accessControlApi.getAccessEvents(propertyId),
        AccessEventAssembler,
        accessEvents,
        accessEventsLoaded,
      ),
    ]).then(() => {});
  }

  /**
   * Reloads the current property's credentials without clearing them, such as after a stay issued or ended key cards.
   * @returns {Promise<void>}
   */
  function refreshCredentials() {
    const propertyId = currentPropertyId.value;
    if (!propertyId) return Promise.resolve();
    return accessControlApi
      .getCredentials(propertyId)
      .then((response) => {
        if (propertyId !== currentPropertyId.value) return;
        credentials.value =
          CredentialAssembler.toEntitiesFromResponse(response);
        credentialsLoaded.value = true;
      })
      .catch((error) => {
        errors.value.push(error);
      });
  }

  // Access follows the property selected in any context.
  watch(currentPropertyId, fetchAccessControl, { immediate: true });

  /**
   * Returns the current moment as an ISO date-time.
   * @returns {string}
   */
  function now() {
    return new Date().toISOString();
  }

  /**
   * Finds a credential entity by identifier.
   * @param {number|string} id - Credential identifier.
   * @returns {Credential|undefined} Matching credential, if available.
   */
  function getCredentialById(id) {
    let idNum = parseInt(id);
    return credentials.value.find((credential) => credential['id'] === idNum);
  }

  /**
   * Finds a staff member entity by identifier.
   * @param {number|string} id - Staff member identifier.
   * @returns {StaffMember|undefined} Matching staff member, if available.
   */
  function getStaffMemberById(id) {
    let idNum = parseInt(id);
    return staffMembers.value.find((member) => member['id'] === idNum);
  }

  /**
   * Derives a credential's status now.
   * @param {Credential} credential - Credential to check.
   * @returns {'active'|'scheduled'|'expired'|'revoked'}
   */
  function getCredentialStatus(credential) {
    return credential.statusAt(now());
  }

  /**
   * Lists the key cards of a booking, newest first.
   * @param {number} bookingId - Booking identifier.
   * @returns {Credential[]} Key cards of the booking.
   */
  function getKeyCardsOfBooking(bookingId) {
    return credentials.value
      .filter((credential) => credential.bookingId === bookingId)
      .toSorted((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }

  /**
   * Lists the access events of a credential, newest first.
   * @param {number} credentialId - Credential identifier.
   * @returns {AccessEvent[]} Access events of the credential.
   */
  function getEventsOfCredential(credentialId) {
    return accessEvents.value
      .filter((accessEvent) => accessEvent.credentialId === credentialId)
      .toSorted((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  /**
   * Tracks a create or update request and records its errors.
   * The rules the platform rejects are reported as Access Control errors.
   * @template T
   * @param {Promise<T>} request - Pending infrastructure request.
   * @returns {Promise<T>} The same request result.
   */
  function trackSaving(request) {
    saving.value = true;
    return request
      .catch((error) => {
        const accessControlError =
          AccessControlErrorAssembler.toErrorFromResponse(error);
        errors.value.push(accessControlError);
        throw accessControlError;
      })
      .finally(() => {
        saving.value = false;
      });
  }

  /**
   * Replaces a credential in local state with the version the platform returned, or appends it.
   * @param {Object} resource - Credential resource.
   * @returns {Credential} Persisted credential.
   */
  function replaceCredentialState(resource) {
    const savedCredential = CredentialAssembler.toEntityFromResource(resource);
    const index = credentials.value.findIndex(
      (entry) => entry['id'] === savedCredential.id,
    );
    if (index === -1) credentials.value.push(savedCredential);
    else credentials.value[index] = savedCredential;
    return savedCredential;
  }

  /**
   * Writes a new key card on the front desk encoder, retrying until its card ID is unique in the property.
   * @returns {Promise<string>} Card ID of the encoded card.
   * @throws {Error} When the encoder fails.
   */
  async function encodeKeyCard() {
    try {
      let cardId;
      do {
        cardId = await rfidEncoder.encode((state) => {
          encoderState.value = state;
        });
      } while (credentials.value.some((entry) => entry.cardId === cardId));
      encoderState.value = 'encoded';
      return cardId;
    } catch (error) {
      encoderState.value = 'failed';
      throw error;
    }
  }

  /**
   * Returns the encoder to its ready state, such as when a new card is placed.
   */
  function resetEncoder() {
    encoderState.value = 'ready';
  }

  /**
   * Issues a staff credential on a new key card; a staff member holds at most one usable credential.
   * @param {import('../domain/issue-staff-credential.command.js').IssueStaffCredentialCommand} issueStaffCredentialCommand - Issue command.
   * @returns {Promise<Credential>} Issued credential.
   * @throws {AccessControlError} When a business rule is violated.
   */
  async function issueStaffCredential(issueStaffCredentialCommand) {
    const { staffMemberId, scope, validUntil } = issueStaffCredentialCommand;
    const staffMember = getStaffMemberById(staffMemberId);
    if (!staffMember) throw new AccessControlError('staff-member-required');
    const issuedAt = now();
    if (
      credentials.value.some(
        (credential) =>
          credential.staffMemberId === staffMemberId &&
          credential.isUsableAt(issuedAt),
      )
    )
      throw new AccessControlError('staff-credential-exists');
    const draft = new Credential({
      propertyId: currentPropertyId.value,
      cardId: '0000',
      type: 'staff-credential',
      holderName: staffMember.name,
      staffMemberId,
      scope,
      validFrom: issuedAt,
      validUntil,
      issuedAt,
      issuedBy: demoOperatorId,
    });
    draft.validate();
    const cardId = await encodeKeyCard();
    const credential = new Credential({ ...draft, cardId });
    credential.validate();
    return trackSaving(
      accessControlApi
        .issueStaffCredential(
          currentPropertyId.value,
          CredentialAssembler.toIssueStaffCredentialResourceFromEntity(
            credential,
            demoOperatorId,
          ),
        )
        .then((response) => replaceCredentialState(response.data)),
    );
  }

  /**
   * Builds the moment guest key cards stop opening doors: the check-out time on the check-out day.
   * @param {string} checkOutDate - ISO check-out day.
   * @returns {string} ISO date-time.
   */
  function guestAccessEnd(checkOutDate) {
    const [year, month, day] = checkOutDate.split('-').map(Number);
    return new Date(year, month - 1, day, checkOutHour).toISOString();
  }

  /**
   * Revokes an active or scheduled credential immediately.
   * @param {import('../domain/revoke-credential.command.js').RevokeCredentialCommand} revokeCredentialCommand - Revoke command.
   * @returns {Promise<Credential>} Revoked credential.
   * @throws {AccessControlError} When the credential cannot be revoked.
   */
  async function revokeCredential(revokeCredentialCommand) {
    const { credentialId, reason, note } = revokeCredentialCommand;
    const credential = getCredentialById(credentialId);
    if (!credential) throw new AccessControlError('not-found');
    const revoked = credential.revoke({
      reason,
      note,
      at: now(),
      by: demoOperatorId,
    });
    return trackSaving(
      accessControlApi
        .revokeCredential(
          credential.id,
          CredentialAssembler.toRevokeResourceFromEntity(
            revoked,
            demoOperatorId,
          ),
        )
        .then((response) => replaceCredentialState(response.data)),
    );
  }

  /**
   * Revokes a credential and encodes a new card with the same holder, scope, and access period.
   * The platform revokes the credential and issues its replacement in one operation.
   * @param {number} credentialId - Identifier of the credential to replace.
   * @returns {Promise<Credential>} Replacement credential.
   * @throws {AccessControlError} When the credential cannot be replaced.
   */
  async function replaceCredential(credentialId) {
    const credential = getCredentialById(credentialId);
    if (!credential) throw new AccessControlError('not-found');
    credential.revoke({ reason: 'replaced', at: now(), by: demoOperatorId });
    const cardId = await encodeKeyCard();
    const replacement = await trackSaving(
      accessControlApi
        .replaceCredential(
          credential.id,
          CredentialAssembler.toReplaceResource(cardId, demoOperatorId),
        )
        .then((response) => replaceCredentialState(response.data)),
    );
    await refreshCredentials();
    return getCredentialById(replacement.id) ?? replacement;
  }

  return {
    credentials,
    staffMembers,
    accessEvents,
    errors,
    credentialsLoaded,
    staffMembersLoaded,
    accessEventsLoaded,
    saving,
    encoderState,
    currentPropertyId,
    fetchAccessControl,
    refreshCredentials,
    demoOperatorId,
    getCredentialById,
    getStaffMemberById,
    getCredentialStatus,
    getKeyCardsOfBooking,
    getEventsOfCredential,
    guestAccessEnd,
    encodeKeyCard,
    resetEncoder,
    issueStaffCredential,
    revokeCredential,
    replaceCredential,
  };
});

export default useAccessControlStore;
