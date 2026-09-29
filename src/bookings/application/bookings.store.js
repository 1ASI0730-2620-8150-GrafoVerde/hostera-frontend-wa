/**
 * Application service store for the Bookings bounded context.
 * It coordinates booking use cases with the rooms, rates, and availability of the Rooms context and keeps UI-facing state.
 *
 * @module useBookingsStore
 */
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { BookingsApi } from '../infrastructure/bookings-api.js';
import { BookingAssembler } from '../infrastructure/booking.assembler.js';
import useRoomsStore from '../../rooms/application/rooms.store.js';

const bookingsApi = new BookingsApi();

/**
 * Reactive store that exposes Bookings commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useBookingsStore = defineStore('bookings', () => {
  const roomsStore = useRoomsStore();

  /**
   * List of booking entities of the current property.
   * @type {import('vue').Ref<Booking[]>}
   */
  const bookings = ref([]);
  /**
   * List of errors encountered during API operations.
   * @type {import('vue').Ref<Error[]>}
   */
  const errors = ref([]);
  /**
   * Whether bookings have been loaded from the API.
   * @type {import('vue').Ref<boolean>}
   */
  const bookingsLoaded = ref(false);
  /**
   * Whether a create or update operation is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const saving = ref(false);
  /**
   * Identifier of the property whose bookings are managed, shared with the Rooms context.
   * @type {import('vue').ComputedRef<?number>}
   */
  const currentPropertyId = computed(() => roomsStore.currentPropertyId);
  /**
   * Number of loaded bookings.
   * @type {import('vue').ComputedRef<number>}
   */
  const bookingsCount = computed(() => {
    return bookingsLoaded.value ? bookings.value.length : 0;
  });

  /**
   * Loads the current property's bookings and ignores responses for a previously selected property.
   * @returns {Promise<void>}
   */
  function fetchBookings() {
    const propertyId = currentPropertyId.value;
    errors.value = [];
    bookings.value = [];
    bookingsLoaded.value = false;
    if (!propertyId) return Promise.resolve();
    return bookingsApi
      .getBookings(propertyId)
      .then((response) => {
        if (propertyId !== currentPropertyId.value) return;
        bookings.value = BookingAssembler.toEntitiesFromResponse(response);
        bookingsLoaded.value = true;
      })
      .catch((error) => {
        if (propertyId === currentPropertyId.value) errors.value.push(error);
      });
  }

  // Bookings follow the property selected in either context.
  watch(currentPropertyId, fetchBookings, { immediate: true });

  /**
   * Finds a booking entity by identifier.
   * @param {number|string} id - Booking identifier.
   * @returns {Booking|undefined} Matching booking, if available.
   */
  function getBookingById(id) {
    let idNum = parseInt(id);
    return bookings.value.find((booking) => booking['id'] === idNum);
  }

  return {
    bookings,
    errors,
    bookingsLoaded,
    saving,
    currentPropertyId,
    bookingsCount,
    fetchBookings,
    getBookingById,
  };
});

export default useBookingsStore;
