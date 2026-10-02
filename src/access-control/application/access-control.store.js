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
import { RfidEncoder } from '../infrastructure/rfid-encoder.js';
import useRoomsStore from '../../rooms/application/rooms.store.js';

const accessControlApi = new AccessControlApi();
const rfidEncoder = new RfidEncoder();

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
   * Loads the current property's credentials and staff members.
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
    ]).then(() => {});
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

  return {
    credentials,
    staffMembers,
    errors,
    credentialsLoaded,
    staffMembersLoaded,
    saving,
    encoderState,
    currentPropertyId,
    fetchAccessControl,
    getCredentialById,
    getStaffMemberById,
    getCredentialStatus,
    getKeyCardsOfBooking,
    encodeKeyCard,
    resetEncoder,
  };
});

export default useAccessControlStore;
