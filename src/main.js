import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import i18n from './i18n.js'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip'
import {
  Button,
  Card,
  Checkbox,
  Column,
  ConfirmationService,
  ConfirmDialog,
  DataTable,
  Dialog,
  DialogService,
  Drawer,
  FileUpload,
  FloatLabel,
  IconField,
  InputIcon,
  InputNumber,
  InputText,
  Menu,
  Rating,
  Row,
  Select,
  SelectButton,
  Tag,
  Toast,
  Textarea,
  ToastService,
  Toolbar,
} from 'primevue'
import router from './router.js'
import pinia from './pinia.js'

const primeVueLicenseKey = import.meta.env.VITE_PRIMEVUE_LICENSE_KEY

createApp(App)
  .use(i18n)
  .use(PrimeVue, {
    theme: { preset: Material },
    ripple: true,
    license: primeVueLicenseKey,
  })
  .use(ConfirmationService)
  .use(DialogService)
  .use(ToastService)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-checkbox', Checkbox)
  .component('pv-column', Column)
  .component('pv-confirm-dialog', ConfirmDialog)
  .component('pv-data-table', DataTable)
  .component('pv-dialog', Dialog)
  .component('pv-drawer', Drawer)
  .component('pv-file-upload', FileUpload)
  .component('pv-float-label', FloatLabel)
  .component('pv-icon-field', IconField)
  .component('pv-input-icon', InputIcon)
  .component('pv-input-number', InputNumber)
  .component('pv-input-text', InputText)
  .component('pv-menu', Menu)
  .component('pv-rating', Rating)
  .component('pv-row', Row)
  .component('pv-select', Select)
  .component('pv-select-button', SelectButton)
  .component('pv-tag', Tag)
  .component('pv-textarea', Textarea)
  .component('pv-toast', Toast)
  .component('pv-toolbar', Toolbar)
  .directive('tooltip', Tooltip)
  .use(pinia)
  .use(router)
  .mount('#app')
