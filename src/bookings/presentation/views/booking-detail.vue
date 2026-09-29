<script setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import useBookingsStore from '../../application/bookings.store.js';
import useRoomsStore from '../../../rooms/application/rooms.store.js';
import {
  formatDay,
  formatMoney,
} from '../../../shared/presentation/calendar-format.js';
import BookingsLayout from '../components/bookings-layout.vue';
import BookingStatusTag from '../components/booking-status-tag.vue';

const { t, locale } = useI18n();
const route = useRoute();
const store = useBookingsStore();
const roomsStore = useRoomsStore();
const { currentProperty } = toRefs(roomsStore);
const { getBookingById } = store;
const { getRoomById, getRoomTypeById, getRatePlanById } = roomsStore;

const booking = computed(() => getBookingById(route.params.id));
const room = computed(() => getRoomById(booking.value?.roomId));
const roomType = computed(() => getRoomTypeById(booking.value?.roomTypeId));
const ratePlan = computed(() => getRatePlanById(booking.value?.ratePlanId));
const currency = computed(() => currentProperty.value?.currency ?? 'PEN');
const nightsCount = computed(() => booking.value?.nights.length ?? 0);
const breadcrumbItems = computed(() => [
  {
    label: t('bookings.booking-detail.bookings'),
    route: { name: 'bookings-list' },
  },
  { label: booking.value?.code },
]);
const guestFacts = computed(() => [
  {
    label: t('bookings.booking-detail.email'),
    value: booking.value.guestEmail,
  },
  {
    label: t('bookings.booking-detail.phone'),
    value: booking.value.guestPhone || '—',
  },
  {
    label: t('bookings.booking-detail.language'),
    value: t(
      `bookings.bookings-terms.languages.${booking.value.preferredLanguage}`,
    ),
  },
]);
const bookingFacts = computed(() => [
  {
    label: t('bookings.booking-detail.code'),
    value: booking.value.code,
    mono: true,
  },
  {
    label: t('bookings.booking-detail.rate-plan'),
    value: ratePlan.value?.name ?? '—',
  },
  {
    label: t('bookings.booking-detail.created'),
    value: booking.value.createdAt
      ? formatDay(booking.value.createdAt, locale.value, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '—',
  },
]);

/**
 * Formats a stay day with its weekday.
 * @param {string} date - ISO calendar day.
 * @returns {string} Localized day, such as "Wed, Oct 7".
 */
const stayDay = (date) =>
  formatDay(date, locale.value, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
</script>

<template>
  <bookings-layout>
    <template v-if="booking">
      <pv-breadcrumb :model="breadcrumbItems" class="p-0 bg-transparent">
        <template #item="{ item }">
          <router-link
            v-if="item.route"
            :to="item.route"
            class="text-color-secondary hover:text-primary"
            >{{ item.label }}</router-link
          >
          <span v-else class="font-mono font-medium">{{ item.label }}</span>
        </template>
      </pv-breadcrumb>

      <header
        class="flex flex-column md:flex-row md:align-items-center gap-3 pb-4 border-bottom-1 surface-border"
      >
        <div class="flex align-items-center gap-3 flex-1 min-w-0">
          <pv-avatar
            icon="pi pi-user"
            size="large"
            shape="square"
            class="flex-shrink-0 bg-primary-50 text-primary border-round-lg"
            aria-hidden="true"
          />
          <div class="flex flex-column gap-1 min-w-0">
            <div class="flex flex-wrap align-items-center gap-2">
              <h2 class="m-0 text-2xl font-bold tracking-tight">
                {{ booking.guestName }}
              </h2>
              <booking-status-tag :status="booking.status" />
            </div>
            <span class="font-mono text-sm text-color-secondary">{{
              booking.code
            }}</span>
          </div>
        </div>
        <div class="flex flex-wrap align-items-center gap-2">
          <router-link
            v-if="room"
            v-slot="{ navigate }"
            :to="{ name: 'rooms-room-detail', params: { id: room.id } }"
            custom
          >
            <pv-button
              :label="t('bookings.booking-detail.view-room')"
              icon="pi pi-key"
              severity="secondary"
              text
              rounded
              @click="navigate"
            />
          </router-link>
          <router-link
            v-if="booking.isEditable"
            v-slot="{ navigate }"
            :to="{
              name: 'bookings-booking-edit',
              params: { id: booking.id },
            }"
            custom
          >
            <pv-button
              :label="t('bookings.booking-detail.edit')"
              icon="pi pi-pencil"
              rounded
              @click="navigate"
            />
          </router-link>
        </div>
      </header>

      <pv-message
        v-if="!booking.isEditable"
        severity="secondary"
        variant="simple"
        size="small"
        icon="pi pi-lock"
      >
        {{ t('bookings.booking-detail.read-only') }}
      </pv-message>

      <section
        class="grid grid-nogutter align-items-center gap-3 md:gap-0 p-4 surface-card border-1 surface-border border-round-xl"
        :aria-label="t('bookings.booking-detail.stay')"
      >
        <div class="col-12 md:col-3 flex flex-column gap-1">
          <span class="text-sm text-color-secondary">{{
            t('bookings.booking-detail.check-in')
          }}</span>
          <span class="text-xl font-semibold">{{
            stayDay(booking.checkInDate)
          }}</span>
        </div>
        <div
          class="col-12 md:col-2 flex align-items-center gap-2 text-color-secondary"
        >
          <i class="pi pi-moon" aria-hidden="true" />
          <span class="text-sm">{{
            t('bookings.bookings-terms.nights', nightsCount)
          }}</span>
        </div>
        <div class="col-12 md:col-3 flex flex-column gap-1">
          <span class="text-sm text-color-secondary">{{
            t('bookings.booking-detail.check-out')
          }}</span>
          <span class="text-xl font-semibold">{{
            stayDay(booking.checkOutDate)
          }}</span>
        </div>
        <div class="col-6 md:col-2 flex flex-column gap-1">
          <span class="text-sm text-color-secondary">{{
            t('bookings.booking-detail.room')
          }}</span>
          <span class="font-semibold"
            ><span class="font-mono">{{ room?.number ?? '—' }}</span> ·
            {{ roomType?.name }}</span
          >
        </div>
        <div class="col-6 md:col-2 flex flex-column gap-1">
          <span class="text-sm text-color-secondary">{{
            t('bookings.booking-detail.guests')
          }}</span>
          <span class="font-semibold">{{
            t('bookings.bookings-terms.guests', booking.guests)
          }}</span>
        </div>
      </section>

      <div class="grid">
        <div class="col-12 xl:col-8">
          <div
            class="flex flex-column gap-4 h-full p-4 surface-card border-1 surface-border border-round-xl"
          >
            <section class="flex flex-column gap-3">
              <h3
                class="flex align-items-center gap-2 m-0 text-base font-semibold"
              >
                <i
                  class="pi pi-id-card text-color-secondary"
                  aria-hidden="true"
                />
                {{ t('bookings.booking-detail.guest-information') }}
              </h3>
              <dl class="grid m-0">
                <div
                  v-for="fact in guestFacts"
                  :key="fact.label"
                  class="col-12 md:col-4 flex flex-column gap-1"
                >
                  <dt class="text-sm text-color-secondary">{{ fact.label }}</dt>
                  <dd
                    class="m-0 font-medium overflow-hidden text-overflow-ellipsis"
                  >
                    {{ fact.value }}
                  </dd>
                </div>
              </dl>
            </section>
            <pv-divider class="m-0" />
            <section class="flex flex-column gap-3">
              <h3
                class="flex align-items-center gap-2 m-0 text-base font-semibold"
              >
                <i
                  class="pi pi-ticket text-color-secondary"
                  aria-hidden="true"
                />
                {{ t('bookings.booking-detail.booking-information') }}
              </h3>
              <dl class="grid m-0">
                <div
                  v-for="fact in bookingFacts"
                  :key="fact.label"
                  class="col-12 md:col-4 flex flex-column gap-1"
                >
                  <dt class="text-sm text-color-secondary">{{ fact.label }}</dt>
                  <dd :class="['m-0 font-medium', { 'font-mono': fact.mono }]">
                    {{ fact.value }}
                  </dd>
                </div>
              </dl>
            </section>
            <pv-divider class="m-0" />
            <section class="flex flex-column gap-3">
              <h3
                class="flex align-items-center gap-2 m-0 text-base font-semibold"
              >
                <i
                  class="pi pi-comment text-color-secondary"
                  aria-hidden="true"
                />
                {{ t('bookings.booking-detail.guest-request') }}
              </h3>
              <p
                :class="[
                  'm-0 p-3 surface-50 border-round-lg line-height-3',
                  { 'text-color-secondary': !booking.guestRequest },
                ]"
              >
                {{
                  booking.guestRequest ||
                  t('bookings.booking-detail.no-request')
                }}
              </p>
            </section>
          </div>
        </div>

        <aside class="col-12 xl:col-4">
          <div
            class="flex flex-column gap-3 p-4 surface-50 border-1 surface-border border-round-xl"
          >
            <h3
              class="flex align-items-center gap-2 m-0 text-base font-semibold"
            >
              <i class="pi pi-wallet text-color-secondary" aria-hidden="true" />
              {{ t('bookings.booking-detail.price') }}
            </h3>
            <div class="flex align-items-end justify-content-between gap-3">
              <span class="text-color-secondary">{{
                t('bookings.booking-detail.total')
              }}</span>
              <span class="font-mono text-2xl font-semibold">{{
                formatMoney(booking.totalAmount, currency, locale)
              }}</span>
            </div>
            <span class="text-sm text-color-secondary">
              {{ t('bookings.bookings-terms.nights', nightsCount) }} ·
              {{ ratePlan?.name }}
            </span>
            <p class="m-0 text-sm text-color-secondary line-height-3">
              {{ t('bookings.booking-detail.total-help') }}
            </p>
          </div>
        </aside>
      </div>
    </template>
    <pv-message v-else severity="warn" icon="pi pi-search">
      <div class="flex flex-column sm:flex-row sm:align-items-center gap-3">
        <span>{{ t('bookings.booking-detail.not-found') }}</span>
        <router-link :to="{ name: 'bookings-list' }" class="font-medium">{{
          t('bookings.booking-detail.back')
        }}</router-link>
      </div>
    </pv-message>
  </bookings-layout>
</template>
