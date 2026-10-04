/**
 * Application service store for the Overview bounded context.
 * It reads bookings and rooms from their contexts and the portfolio of every property to summarize operations.
 *
 * @module useOverviewStore
 */
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { OverviewApi } from '../infrastructure/overview-api.js';
import { PropertyOverviewAssembler } from '../infrastructure/property-overview.assembler.js';
import useRoomsStore from '../../rooms/application/rooms.store.js';
import useBookingsStore from '../../bookings/application/bookings.store.js';

const overviewApi = new OverviewApi();

/**
 * Reactive store that exposes Overview queries.
 *
 * @returns {Object} Store state and actions.
 */
const useOverviewStore = defineStore('overview', () => {
  const roomsStore = useRoomsStore();
  const bookingsStore = useBookingsStore();

  /**
   * Overview of each property for today.
   * @type {import('vue').Ref<PropertyOverview[]>}
   */
  const propertyOverviews = ref([]);
  /**
   * Whether property overviews have been loaded from the API.
   * @type {import('vue').Ref<boolean>}
   */
  const propertyOverviewsLoaded = ref(false);
  /**
   * Errors encountered while loading property overviews.
   * @type {import('vue').Ref<Error[]>}
   */
  const propertyOverviewErrors = ref([]);

  /**
   * Returns the current local ISO calendar day.
   * @returns {string}
   */
  function today() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  /**
   * Loads the overview of every property for today.
   * @returns {Promise<void>}
   */
  function fetchPropertyOverviews() {
    propertyOverviewErrors.value = [];
    propertyOverviewsLoaded.value = false;
    return overviewApi
      .getPortfolio()
      .then((responses) => {
        propertyOverviews.value =
          PropertyOverviewAssembler.toEntitiesFromResponses(
            roomsStore.properties,
            responses,
            today(),
          );
        propertyOverviewsLoaded.value = true;
      })
      .catch((error) => {
        propertyOverviewErrors.value.push(error);
      });
  }

  // Overviews follow the loaded properties and refresh when bookings change.
  watch(
    () => [roomsStore.properties.length, bookingsStore.bookings],
    () => {
      if (roomsStore.propertiesLoaded) fetchPropertyOverviews();
    },
    { immediate: true },
  );

  return {
    propertyOverviews,
    propertyOverviewsLoaded,
    propertyOverviewErrors,
    fetchPropertyOverviews,
  };
});

export default useOverviewStore;
