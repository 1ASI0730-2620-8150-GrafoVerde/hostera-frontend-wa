<script setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { usePrimeVue } from 'primevue/config';
import AppLayout from './shared/presentation/components/app-layout.vue';

const { locale, getLocaleMessage } = useI18n();
const primevue = usePrimeVue();
const route = useRoute();

// PrimeVue components, such as DatePicker, read their texts from PrimeVue's own locale.
watch(
  locale,
  (value) => {
    const { aria, ...texts } =
      getLocaleMessage(value).shared['primevue-locale'];
    Object.assign(primevue.config.locale, texts);
    Object.assign(primevue.config.locale.aria, aria);
  },
  { immediate: true },
);
</script>

<template>
  <!-- Sign-in and sign-up pages open without the application layout. -->
  <template v-if="route.matched.length">
    <router-view v-if="route.meta['public']" />
    <app-layout v-else />
  </template>
</template>
