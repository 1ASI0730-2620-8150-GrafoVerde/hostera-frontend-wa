/**
 * Custom type definitions for the Vite environment variables.
 *
 * @remarks
 * This allows for better type checking and autocompletion when using the environment variables in the code.
 */

/// <reference types="vite/client" />
interface ImportMetaEnv {
  /**
   * # VITE_HOSTERA_PLATFORM_API_URL is the base URL of the Hostera Platform API, such as http://localhost:5264/api/v1.
   */
  readonly VITE_HOSTERA_PLATFORM_API_URL: string;
  /**
   * # VITE_PROPERTIES_ENDPOINT_PATH is the path to the properties' endpoint.
   */
  readonly VITE_PROPERTIES_ENDPOINT_PATH: string;
  /**
   * # VITE_INVENTORY_ITEMS_ENDPOINT_PATH is the path to the inventory items' endpoint.
   */
  readonly VITE_INVENTORY_ITEMS_ENDPOINT_PATH: string;
  /**
   * # VITE_STORAGE_LOCATIONS_ENDPOINT_PATH is the path to the storage locations' endpoint.
   */
  readonly VITE_STORAGE_LOCATIONS_ENDPOINT_PATH: string;
  /**
   * # VITE_STOCK_ADJUSTMENTS_ENDPOINT_PATH is the path of the stock adjustments of an inventory item.
   */
  readonly VITE_STOCK_ADJUSTMENTS_ENDPOINT_PATH: string;
  /**
   * # VITE_INVENTORY_STOCKS_ENDPOINT_PATH is the path of the stocks of an inventory item.
   */
  readonly VITE_INVENTORY_STOCKS_ENDPOINT_PATH: string;
  /**
   * # VITE_ROOM_TYPES_ENDPOINT_PATH is the path to the room types' endpoint.
   */
  readonly VITE_ROOM_TYPES_ENDPOINT_PATH: string;
  /**
   * # VITE_ROOMS_ENDPOINT_PATH is the path to the rooms' endpoint.
   */
  readonly VITE_ROOMS_ENDPOINT_PATH: string;
  /**
   * # VITE_STATUS_PERIODS_ENDPOINT_PATH is the path to the status periods' endpoint.
   */
  readonly VITE_STATUS_PERIODS_ENDPOINT_PATH: string;
  /**
   * # VITE_ROOM_STATUS_ENDPOINT_PATH is the path of the operational status of a room.
   */
  readonly VITE_ROOM_STATUS_ENDPOINT_PATH: string;
  /**
   * # VITE_BOOKINGS_ENDPOINT_PATH is the path to the bookings' endpoint.
   */
  readonly VITE_BOOKINGS_ENDPOINT_PATH: string;
  /**
   * # VITE_PAYMENTS_ENDPOINT_PATH is the path to the payments' endpoint.
   */
  readonly VITE_PAYMENTS_ENDPOINT_PATH: string;
  /**
   * # VITE_BOOKING_TRANSITIONS_ENDPOINT_PATH is the path of the status transitions of a booking.
   */
  readonly VITE_BOOKING_TRANSITIONS_ENDPOINT_PATH: string;
  /**
   * # VITE_CHECK_IN_ENDPOINT_PATH is the path of the check-in of a booking.
   */
  readonly VITE_CHECK_IN_ENDPOINT_PATH: string;
  /**
   * # VITE_CHECK_OUT_ENDPOINT_PATH is the path of the check-out of a booking.
   */
  readonly VITE_CHECK_OUT_ENDPOINT_PATH: string;
  /**
   * # VITE_CREDENTIALS_ENDPOINT_PATH is the path to the credentials' endpoint.
   */
  readonly VITE_CREDENTIALS_ENDPOINT_PATH: string;
  /**
   * # VITE_STAFF_CREDENTIAL_ENCODING_ENDPOINT_PATH is the path that issues a staff credential on an encoded card.
   */
  readonly VITE_STAFF_CREDENTIAL_ENCODING_ENDPOINT_PATH: string;
  /**
   * # VITE_CREDENTIAL_REVOCATION_ENDPOINT_PATH is the path that revokes a credential.
   */
  readonly VITE_CREDENTIAL_REVOCATION_ENDPOINT_PATH: string;
  /**
   * # VITE_CREDENTIAL_REPLACEMENT_ENDPOINT_PATH is the path that replaces a credential with a new card.
   */
  readonly VITE_CREDENTIAL_REPLACEMENT_ENDPOINT_PATH: string;
  /**
   * # VITE_STAFF_MEMBERS_ENDPOINT_PATH is the path to the staff members' endpoint.
   */
  readonly VITE_STAFF_MEMBERS_ENDPOINT_PATH: string;
  /**
   * # VITE_ACCESS_EVENTS_ENDPOINT_PATH is the path to the access events' endpoint.
   */
  readonly VITE_ACCESS_EVENTS_ENDPOINT_PATH: string;
  /**
   * # VITE_RATE_PLANS_ENDPOINT_PATH is the path to the rate plans' endpoint.
   */
  readonly VITE_RATE_PLANS_ENDPOINT_PATH: string;
  /**
   * # VITE_DAILY_RATES_ENDPOINT_PATH is the path to the daily rates' endpoint.
   */
  readonly VITE_DAILY_RATES_ENDPOINT_PATH: string;
  /**
   * # VITE_PROPERTY_OVERVIEWS_ENDPOINT_PATH is the path to the property overviews' endpoint.
   */
  readonly VITE_PROPERTY_OVERVIEWS_ENDPOINT_PATH: string;
  /**
   * # VITE_DEMO_OPERATOR_ID is the staff member recorded as the operator of bookings, payments, and credentials until sign-in exists.
   */
  readonly VITE_DEMO_OPERATOR_ID: string;
  /**
   * # VITE_PRIMEVUE_LICENSE_KEY is the license key for the PrimeVue library.
   */
  readonly VITE_PRIMEVUE_LICENSE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
