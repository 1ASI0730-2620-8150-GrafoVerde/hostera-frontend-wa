<script setup>
import { useI18n } from 'vue-i18n';
import { formatDayRange } from '../calendar-format.js';

defineProps({
  room: { type: Object, required: true },
  roomAssignment: { type: Object, required: true },
});
const visible = defineModel('visible', { type: Boolean });

const { t, locale } = useI18n();
</script>

<template>
  <pv-dialog
    v-model:visible="visible"
    modal
    :header="t('rooms.booking-controlled-dialog.title')"
    :draggable="false"
    class="w-full mx-3"
    style="max-width: 32rem"
  >
    <div class="flex flex-column gap-3">
      <pv-message severity="warn" icon="pi pi-lock">
        <div class="flex flex-column gap-1">
          <span class="font-semibold">{{
            t('rooms.booking-controlled-dialog.summary', {
              status: t(
                `rooms.rooms-terms.day-statuses.${roomAssignment.status}`,
              ),
            })
          }}</span>
          <span>{{
            t('rooms.booking-controlled-dialog.detail', {
              number: room.number,
              code: roomAssignment.bookingCode,
              dates: formatDayRange(
                roomAssignment.startDate,
                roomAssignment.endDate,
                locale,
              ),
            })
          }}</span>
        </div>
      </pv-message>
      <p class="m-0 line-height-3 text-color-secondary">
        {{ t('rooms.booking-controlled-dialog.help') }}
      </p>
    </div>
    <template #footer>
      <pv-button
        :label="t('rooms.booking-controlled-dialog.close')"
        rounded
        autofocus
        @click="visible = false"
      />
    </template>
  </pv-dialog>
</template>
