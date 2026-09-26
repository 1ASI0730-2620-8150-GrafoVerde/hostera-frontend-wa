import { createI18n } from 'vue-i18n';
import enSharedHome from './locales/en/shared/home.json';
import enSharedAppLayout from './locales/en/shared/app-layout.json';
import enSharedLanguageSwitcher from './locales/en/shared/language-switcher.json';
import enSharedSidebarToggle from './locales/en/shared/sidebar-toggle.json';
import enInventoryInventoryTerms from './locales/en/inventory/inventory-terms.json';
import enInventoryInventoryLayout from './locales/en/inventory/inventory-layout.json';
import enInventoryInventoryItemList from './locales/en/inventory/inventory-item-list.json';
import enInventoryInventoryItemDetail from './locales/en/inventory/inventory-item-detail.json';
import enInventoryInventoryItemForm from './locales/en/inventory/inventory-item-form.json';
import enInventoryStorageLocationList from './locales/en/inventory/storage-location-list.json';
import enInventoryStorageLocationDetail from './locales/en/inventory/storage-location-detail.json';
import enInventoryStorageLocationForm from './locales/en/inventory/storage-location-form.json';
import enInventoryStockAdjustmentForm from './locales/en/inventory/stock-adjustment-form.json';
import enRoomsRoomsTerms from './locales/en/rooms/rooms-terms.json';
import enRoomsRoomsLayout from './locales/en/rooms/rooms-layout.json';
import enRoomsRoomAvailability from './locales/en/rooms/room-availability.json';
import enRoomsRoomTypeList from './locales/en/rooms/room-type-list.json';
import enRoomsRoomTypeForm from './locales/en/rooms/room-type-form.json';
import enRoomsRoomForm from './locales/en/rooms/room-form.json';
import enRoomsRoomStatusForm from './locales/en/rooms/room-status-form.json';
import enRoomsReservationControlledDialog from './locales/en/rooms/reservation-controlled-dialog.json';
import enRoomsRoomMonthCalendar from './locales/en/rooms/room-month-calendar.json';
import enRoomsRoomDetail from './locales/en/rooms/room-detail.json';
import esSharedHome from './locales/es/shared/home.json';
import esSharedAppLayout from './locales/es/shared/app-layout.json';
import esSharedLanguageSwitcher from './locales/es/shared/language-switcher.json';
import esSharedSidebarToggle from './locales/es/shared/sidebar-toggle.json';
import esInventoryInventoryTerms from './locales/es/inventory/inventory-terms.json';
import esInventoryInventoryLayout from './locales/es/inventory/inventory-layout.json';
import esInventoryInventoryItemList from './locales/es/inventory/inventory-item-list.json';
import esInventoryInventoryItemDetail from './locales/es/inventory/inventory-item-detail.json';
import esInventoryInventoryItemForm from './locales/es/inventory/inventory-item-form.json';
import esInventoryStorageLocationList from './locales/es/inventory/storage-location-list.json';
import esInventoryStorageLocationDetail from './locales/es/inventory/storage-location-detail.json';
import esInventoryStorageLocationForm from './locales/es/inventory/storage-location-form.json';
import esInventoryStockAdjustmentForm from './locales/es/inventory/stock-adjustment-form.json';
import esRoomsRoomsTerms from './locales/es/rooms/rooms-terms.json';
import esRoomsRoomsLayout from './locales/es/rooms/rooms-layout.json';
import esRoomsRoomAvailability from './locales/es/rooms/room-availability.json';
import esRoomsRoomTypeList from './locales/es/rooms/room-type-list.json';
import esRoomsRoomTypeForm from './locales/es/rooms/room-type-form.json';
import esRoomsRoomForm from './locales/es/rooms/room-form.json';
import esRoomsRoomStatusForm from './locales/es/rooms/room-status-form.json';
import esRoomsReservationControlledDialog from './locales/es/rooms/reservation-controlled-dialog.json';
import esRoomsRoomMonthCalendar from './locales/es/rooms/room-month-calendar.json';
import esRoomsRoomDetail from './locales/es/rooms/room-detail.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      shared: {
        home: enSharedHome,
        'app-layout': enSharedAppLayout,
        'language-switcher': enSharedLanguageSwitcher,
        'sidebar-toggle': enSharedSidebarToggle,
      },
      inventory: {
        'inventory-terms': enInventoryInventoryTerms,
        'inventory-layout': enInventoryInventoryLayout,
        'inventory-item-list': enInventoryInventoryItemList,
        'inventory-item-detail': enInventoryInventoryItemDetail,
        'inventory-item-form': enInventoryInventoryItemForm,
        'storage-location-list': enInventoryStorageLocationList,
        'storage-location-detail': enInventoryStorageLocationDetail,
        'storage-location-form': enInventoryStorageLocationForm,
        'stock-adjustment-form': enInventoryStockAdjustmentForm,
      },
      rooms: {
        'rooms-terms': enRoomsRoomsTerms,
        'rooms-layout': enRoomsRoomsLayout,
        'room-availability': enRoomsRoomAvailability,
        'room-type-list': enRoomsRoomTypeList,
        'room-type-form': enRoomsRoomTypeForm,
        'room-form': enRoomsRoomForm,
        'room-status-form': enRoomsRoomStatusForm,
        'reservation-controlled-dialog': enRoomsReservationControlledDialog,
        'room-month-calendar': enRoomsRoomMonthCalendar,
        'room-detail': enRoomsRoomDetail,
      },
    },
    es: {
      shared: {
        home: esSharedHome,
        'app-layout': esSharedAppLayout,
        'language-switcher': esSharedLanguageSwitcher,
        'sidebar-toggle': esSharedSidebarToggle,
      },
      inventory: {
        'inventory-terms': esInventoryInventoryTerms,
        'inventory-layout': esInventoryInventoryLayout,
        'inventory-item-list': esInventoryInventoryItemList,
        'inventory-item-detail': esInventoryInventoryItemDetail,
        'inventory-item-form': esInventoryInventoryItemForm,
        'storage-location-list': esInventoryStorageLocationList,
        'storage-location-detail': esInventoryStorageLocationDetail,
        'storage-location-form': esInventoryStorageLocationForm,
        'stock-adjustment-form': esInventoryStockAdjustmentForm,
      },
      rooms: {
        'rooms-terms': esRoomsRoomsTerms,
        'rooms-layout': esRoomsRoomsLayout,
        'room-availability': esRoomsRoomAvailability,
        'room-type-list': esRoomsRoomTypeList,
        'room-type-form': esRoomsRoomTypeForm,
        'room-form': esRoomsRoomForm,
        'room-status-form': esRoomsRoomStatusForm,
        'reservation-controlled-dialog': esRoomsReservationControlledDialog,
        'room-month-calendar': esRoomsRoomMonthCalendar,
        'room-detail': esRoomsRoomDetail,
      },
    },
  },
});

export default i18n;
