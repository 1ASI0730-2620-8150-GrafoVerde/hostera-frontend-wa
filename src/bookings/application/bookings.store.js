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
import { Booking } from '../domain/model/booking.entity.js';
import { BookingsError } from '../domain/model/bookings.error.js';
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

  /**
   * Derives the price of a stay as the sum of its nightly rates.
   * @param {Booking} booking - Booking with room type, rate plan, and stay dates.
   * @returns {number} Price of all nights in the property's currency.
   */
  function quoteTotal(booking) {
    const total = booking.nights.reduce(
      (sum, date) =>
        sum +
        (roomsStore.getNightlyRate(
          booking.roomTypeId,
          booking.ratePlanId,
          date,
        ) ?? 0),
      0,
    );
    return Math.round(total * 100) / 100;
  }

  /**
   * Whether a room is free for a stay: no other room-holding booking shares a night, and no status prevents booking.
   * @param {number} roomId - Room identifier.
   * @param {Booking} booking - Booking whose stay is checked; it never conflicts with itself.
   * @returns {boolean}
   */
  function isRoomAvailable(roomId, booking) {
    return (
      !bookings.value.some(
        (entry) =>
          entry['id'] !== booking.id &&
          entry.roomId === roomId &&
          entry.holdsRoom &&
          entry.overlaps(booking.checkInDate, booking.checkOutDate),
      ) &&
      roomsStore.isRoomBookable(roomId, booking.checkInDate, booking.lastNight)
    );
  }

  /**
   * Rejects a booking whose room, rate plan, or guests cannot be sold for its stay.
   * A room type or rate plan made inactive stays acceptable for the booking that already uses it.
   * @param {Booking} booking - Booking to check.
   * @param {?Booking} [currentBooking=null] - Persisted booking, when updating.
   * @throws {BookingsError} When the booking cannot be sold.
   */
  function ensureBookable(booking, currentBooking = null) {
    const roomType = roomsStore.getRoomTypeById(booking.roomTypeId);
    if (!roomType) throw new BookingsError('room-type-required');
    if (!roomType.isActive && currentBooking?.roomTypeId !== roomType.id)
      throw new BookingsError('inactive-room-type');
    if (roomsStore.getRoomById(booking.roomId)?.roomTypeId !== roomType.id)
      throw new BookingsError('room-not-in-room-type');
    const ratePlan = roomsStore.getRatePlanById(booking.ratePlanId);
    if (!ratePlan) throw new BookingsError('rate-plan-required');
    if (!ratePlan.isActive && currentBooking?.ratePlanId !== ratePlan.id)
      throw new BookingsError('inactive-rate-plan');
    if (!ratePlan.appliesTo(roomType.id))
      throw new BookingsError('rate-plan-not-for-room-type');
    if (booking.guests > roomType.capacity)
      throw new BookingsError('over-capacity');
    if (!isRoomAvailable(booking.roomId, booking))
      throw new BookingsError('room-unavailable');
  }

  /**
   * Tracks a create or update request and records its errors.
   * @template T
   * @param {Promise<T>} request - Pending infrastructure request.
   * @returns {Promise<T>} The same request result.
   */
  function trackSaving(request) {
    saving.value = true;
    return request
      .catch((error) => {
        errors.value.push(error);
        throw error;
      })
      .finally(() => {
        saving.value = false;
      });
  }

  /**
   * Creates a pending booking with the property's next booking code and its quoted total, then refreshes room availability.
   * @param {Booking} booking - Booking entity to persist.
   * @returns {Promise<Booking>} Created booking.
   * @throws {BookingsError} When a business rule is violated.
   */
  function addBooking(booking) {
    booking.validate();
    ensureBookable(booking);
    return trackSaving(
      bookingsApi
        .getLatestBooking(currentPropertyId.value)
        .then((response) => {
          const [latestBooking] =
            BookingAssembler.toEntitiesFromResponse(response);
          const newBooking = new Booking({
            ...booking,
            propertyId: currentPropertyId.value,
            code: Booking.nextCode(
              currentPropertyId.value,
              latestBooking?.code,
            ),
            status: 'pending',
            totalAmount: quoteTotal(booking),
            createdAt: new Date().toISOString().slice(0, 10),
          });
          return bookingsApi.createBooking(newBooking);
        })
        .then((response) => {
          const newBooking = BookingAssembler.toEntityFromResource(
            response.data,
          );
          bookings.value.push(newBooking);
          roomsStore.fetchRoomAssignments();
          return newBooking;
        }),
    );
  }

  /**
   * Updates a pending or confirmed booking, quoting a new total when its room type, rate plan, or nights change.
   * @param {Booking} booking - Booking entity with updated data.
   * @returns {Promise<Booking>} Updated booking.
   * @throws {BookingsError} When a business rule is violated.
   */
  function updateBooking(booking) {
    const currentBooking = getBookingById(booking.id);
    if (!currentBooking) throw new BookingsError('not-found');
    if (!currentBooking.isEditable) throw new BookingsError('not-editable');
    booking.validate();
    ensureBookable(booking, currentBooking);
    const updatedBooking = new Booking({
      ...booking,
      propertyId: currentBooking.propertyId,
      code: currentBooking.code,
      status: currentBooking.status,
      createdAt: currentBooking.createdAt,
      totalAmount: booking.hasSamePricingAs(currentBooking)
        ? currentBooking.totalAmount
        : quoteTotal(booking),
    });
    return saveChanges(updatedBooking);
  }

  /**
   * Persists a changed booking, replaces it in local state, and refreshes room availability.
   * @param {Booking} booking - Changed booking.
   * @returns {Promise<Booking>} Persisted booking.
   */
  function saveChanges(booking) {
    return trackSaving(
      bookingsApi.updateBooking(booking).then((response) => {
        const savedBooking = BookingAssembler.toEntityFromResource(
          response.data,
        );
        const index = bookings.value.findIndex(
          (entry) => entry['id'] === savedBooking.id,
        );
        if (index !== -1) bookings.value[index] = savedBooking;
        roomsStore.fetchRoomAssignments();
        return savedBooking;
      }),
    );
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
    quoteTotal,
    isRoomAvailable,
    addBooking,
    updateBooking,
  };
});

export default useBookingsStore;
