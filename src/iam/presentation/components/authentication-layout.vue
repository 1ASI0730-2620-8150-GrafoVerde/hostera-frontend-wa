<script setup>
import { useI18n } from 'vue-i18n';
import BrandLogo from '../../../shared/presentation/components/brand-logo.vue';
import LanguageSwitcher from '../../../shared/presentation/components/language-switcher.vue';

const { t } = useI18n();

defineProps({
  /** Heading of the page. */
  title: { type: String, required: true },
  /** Text under the heading. */
  subtitle: { type: String, default: '' },
});
</script>

<template>
  <main
    class="min-h-screen flex align-items-center justify-content-center surface-ground p-3"
  >
    <div class="w-full flex flex-column gap-4" style="max-width: 26rem">
      <div class="flex align-items-center justify-content-center gap-2">
        <brand-logo />
        <span class="text-2xl font-semibold tracking-tight">Hostera</span>
      </div>
      <pv-card class="shadow-2">
        <template #content>
          <div class="flex flex-column gap-4 p-2">
            <div class="flex flex-column gap-2">
              <h1 class="m-0 text-2xl font-semibold tracking-tight">
                {{ title }}
              </h1>
              <p v-if="subtitle" class="m-0 text-color-secondary line-height-3">
                {{ subtitle }}
              </p>
            </div>
            <slot />
          </div>
        </template>
      </pv-card>
      <div class="flex justify-content-center">
        <div class="w-8rem">
          <language-switcher />
        </div>
      </div>
      <span class="text-center text-sm text-color-secondary">{{
        t('shared.app-layout.copyright')
      }}</span>
    </div>
  </main>
</template>
