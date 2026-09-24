import { createI18n } from 'vue-i18n';
import enSharedHome from './locales/en/shared/home.json';
import enSharedAppLayout from './locales/en/shared/app-layout.json';
import enSharedLanguageSwitcher from './locales/en/shared/language-switcher.json';
import enSharedSidebarToggle from './locales/en/shared/sidebar-toggle.json';
import esSharedHome from './locales/es/shared/home.json';
import esSharedAppLayout from './locales/es/shared/app-layout.json';
import esSharedLanguageSwitcher from './locales/es/shared/language-switcher.json';
import esSharedSidebarToggle from './locales/es/shared/sidebar-toggle.json';

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
    },
    es: {
      shared: {
        home: esSharedHome,
        'app-layout': esSharedAppLayout,
        'language-switcher': esSharedLanguageSwitcher,
        'sidebar-toggle': esSharedSidebarToggle,
      },
    },
  },
});

export default i18n;
