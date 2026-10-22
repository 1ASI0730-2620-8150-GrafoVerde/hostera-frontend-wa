<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import LanguageSwitcher from './language-switcher.vue';
import BrandLogo from './brand-logo.vue';

const { t } = useI18n();
const route = useRoute();

// On desktop the inset sidebar rests as icons and expands over the content on hover;
// below PrimeFlex's lg breakpoint it becomes an off-canvas overlay.
const compactQuery = window.matchMedia('(max-width: 991px)');
const compact = ref(compactQuery.matches);
const sidebarOpen = ref(false);
const collapsed = computed(() => !compact.value && !sidebarOpen.value);

// Terms and conditions published with the landing page, shared by every Hostera product.
const termsUrl =
  'https://1asi0730-2620-8150-grafoverde.github.io/landing-page/terms.html';

// Signed-in operator placeholder until the IAM context is implemented.
const currentOperator = { name: 'Lucía Martín', initials: 'LM' };

// The operator block opens a menu with the language choice and the terms and conditions.
const accountMenu = ref(null);
const accountMenuOpen = ref(false);

/**
 * Opens or closes the account menu next to the operator block.
 * @param {Event} event - Click event of the operator block.
 */
const toggleAccountMenu = (event) => accountMenu.value.toggle(event);

const navigationItems = [
  {
    label: 'shared.app-layout.overview',
    icon: 'pi pi-objects-column',
    to: { name: 'overview' },
    section: '/',
    exact: true,
  },
  {
    label: 'shared.app-layout.bookings',
    icon: 'pi pi-calendar',
    to: { name: 'bookings-list' },
    section: '/bookings',
  },
  {
    label: 'shared.app-layout.rooms',
    icon: 'pi pi-key',
    to: { name: 'rooms-availability' },
    section: '/rooms',
  },
  {
    label: 'shared.app-layout.inventory',
    icon: 'pi pi-box',
    to: { name: 'inventory-items' },
    section: '/inventory',
  },
  {
    label: 'shared.app-layout.access-control',
    icon: 'pi pi-lock',
    to: { name: 'access-control-credentials' },
    section: '/access-control',
  },
];

/**
 * Whether the current route belongs to a navigation item's section; the overview matches only its own path.
 * @param {Object} item - Navigation item.
 * @returns {boolean}
 */
const isCurrentSection = (item) =>
  item.exact
    ? route.path === item.section
    : route.path.startsWith(item.section);

/**
 * Switches the sidebar between its persistent and overlay modes.
 * @param {MediaQueryListEvent} event - Media query change event.
 */
const updateCompact = (event) => {
  compact.value = event.matches;
  sidebarOpen.value = false;
};

onMounted(() => compactQuery.addEventListener('change', updateCompact));
onBeforeUnmount(() =>
  compactQuery.removeEventListener('change', updateCompact),
);

watch(
  () => route.fullPath,
  () => {
    if (compact.value) sidebarOpen.value = false;
  },
);
</script>

<template>
  <pv-sidebar-layout class="h-screen overflow-hidden">
    <pv-sidebar
      id="app-sidebar"
      v-model:open="sidebarOpen"
      :variant="compact ? 'sidebar' : 'inset'"
      :collapsible="compact ? 'offcanvas' : 'icon'"
      :open-on-hover="!compact"
      overlay
      width="15rem"
      icon-width="3.75rem"
    >
      <pv-sidebar-spacer />
      <pv-sidebar-aside :class="{ 'border-right-1 surface-border': compact }">
        <pv-sidebar-panel
          :class="{ 'border-round-xl shadow-3': !compact && sidebarOpen }"
        >
          <pv-sidebar-header class="h-4rem justify-content-center px-2">
            <router-link :to="{ name: 'overview' }" class="flex">
              <brand-logo />
            </router-link>
          </pv-sidebar-header>
          <pv-sidebar-content class="pt-2">
            <pv-sidebar-group>
              <nav :aria-label="t('shared.app-layout.navigation')">
                <pv-sidebar-menu>
                  <pv-sidebar-menu-item
                    v-for="item in navigationItems"
                    :key="item.label"
                  >
                    <pv-sidebar-menu-button
                      v-slot="slotProps"
                      as-child
                      :is-active="isCurrentSection(item)"
                    >
                      <router-link
                        :to="item.to"
                        :class="slotProps.class"
                        v-bind="slotProps.a11yAttrs"
                        :aria-current="
                          isCurrentSection(item) ? 'page' : undefined
                        "
                      >
                        <i :class="[item.icon, 'text-lg']" aria-hidden="true" />
                        <span class="white-space-nowrap">{{
                          t(item.label)
                        }}</span>
                      </router-link>
                    </pv-sidebar-menu-button>
                  </pv-sidebar-menu-item>
                </pv-sidebar-menu>
              </nav>
            </pv-sidebar-group>
          </pv-sidebar-content>
          <pv-sidebar-footer :class="collapsed ? 'p-2' : 'p-3'">
            <button
              type="button"
              :class="[
                'account-trigger flex align-items-center gap-2 w-full border-none border-round-lg cursor-pointer text-left text-color',
                collapsed
                  ? 'justify-content-center p-0 bg-transparent'
                  : 'p-2 surface-100',
              ]"
              :aria-label="t('shared.app-layout.account-menu')"
              aria-haspopup="true"
              aria-controls="account-menu"
              :aria-expanded="accountMenuOpen"
              @click="toggleAccountMenu"
            >
              <pv-avatar
                :label="currentOperator.initials"
                shape="circle"
                class="bg-primary flex-shrink-0 font-medium"
                aria-hidden="true"
              />
              <div v-if="!collapsed" class="flex flex-column min-w-0">
                <span class="text-sm font-medium white-space-nowrap">{{
                  currentOperator.name
                }}</span>
                <span class="text-sm text-color-secondary white-space-nowrap">{{
                  t('shared.app-layout.operator-role')
                }}</span>
              </div>
              <i
                v-if="!collapsed"
                class="pi pi-chevron-up ml-auto text-sm text-color-secondary"
                aria-hidden="true"
              />
            </button>
            <pv-popover
              id="account-menu"
              ref="accountMenu"
              @show="accountMenuOpen = true"
              @hide="accountMenuOpen = false"
            >
              <div class="flex flex-column gap-3 w-16rem">
                <div class="flex flex-column gap-2">
                  <span class="text-sm font-medium">{{
                    t('shared.language-switcher.label')
                  }}</span>
                  <language-switcher />
                </div>
                <pv-divider class="m-0" />
                <a
                  :href="termsUrl"
                  target="_blank"
                  rel="noopener"
                  class="flex align-items-center gap-2 p-2 border-round-md text-color no-underline hover:surface-100"
                  :aria-label="t('shared.app-layout.terms-new-tab')"
                >
                  <i class="pi pi-file" aria-hidden="true" />
                  <span>{{ t('shared.app-layout.terms') }}</span>
                  <i
                    class="pi pi-external-link ml-auto text-sm text-color-secondary"
                    aria-hidden="true"
                  />
                </a>
                <span class="text-sm text-color-secondary">{{
                  t('shared.app-layout.copyright')
                }}</span>
              </div>
            </pv-popover>
          </pv-sidebar-footer>
        </pv-sidebar-panel>
      </pv-sidebar-aside>
    </pv-sidebar>
    <pv-sidebar-backdrop v-if="compact" />

    <pv-sidebar-main class="overflow-y-auto">
      <router-view />
    </pv-sidebar-main>
    <pv-toast position="bottom-right" />
    <pv-confirm-dialog />
  </pv-sidebar-layout>
</template>
