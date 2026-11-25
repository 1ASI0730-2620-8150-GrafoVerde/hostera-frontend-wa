<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useIamStore from '../../application/iam.store.js';
import { SignInCommand } from '../../domain/sign-in.command.js';
import { IamError } from '../../domain/model/iam.error.js';
import { redirectPathAfterSignIn } from '../../infrastructure/authentication.guard.js';
import AuthenticationLayout from '../components/authentication-layout.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useIamStore();
const { submitting, sessionExpired } = storeToRefs(store);
const { signIn } = store;

const form = reactive({ username: '', password: '' });
const submitted = ref(false);
const errorCode = ref('');

const usernameMissing = computed(
  () => submitted.value && !form.username.trim(),
);
const passwordMissing = computed(() => submitted.value && !form.password);

/**
 * Signs the user in and opens the page it was going to, or the overview.
 */
const signInUser = async () => {
  submitted.value = true;
  errorCode.value = '';
  if (!form.username.trim() || !form.password) return;
  try {
    await signIn(new SignInCommand(form));
    await router.replace(redirectPathAfterSignIn(route));
  } catch (error) {
    errorCode.value = error instanceof IamError ? error.code : 'connection';
  }
};
</script>

<template>
  <authentication-layout
    :title="t('iam.sign-in.title')"
    :subtitle="t('iam.sign-in.subtitle')"
  >
    <pv-message
      v-if="errorCode"
      severity="error"
      icon="pi pi-exclamation-circle"
      role="alert"
    >
      {{ t(`iam.iam-terms.errors.${errorCode}`) }}
    </pv-message>
    <pv-message
      v-else-if="sessionExpired"
      severity="info"
      icon="pi pi-info-circle"
    >
      {{ t('iam.sign-in.session-expired') }}
    </pv-message>

    <form
      class="flex flex-column gap-4"
      novalidate
      @submit.prevent="signInUser"
    >
      <div class="flex flex-column gap-2">
        <label for="sign-in-username" class="font-medium">{{
          t('iam.iam-terms.username')
        }}</label>
        <pv-input-text
          id="sign-in-username"
          v-model="form.username"
          autocomplete="username"
          autofocus
          :invalid="usernameMissing"
          :aria-describedby="
            usernameMissing ? 'sign-in-username-error' : undefined
          "
          fluid
        />
        <small
          v-if="usernameMissing"
          id="sign-in-username-error"
          class="text-red-700"
          >{{ t('iam.iam-terms.errors.username-required') }}</small
        >
      </div>
      <div class="flex flex-column gap-2">
        <label for="sign-in-password" class="font-medium">{{
          t('iam.iam-terms.password')
        }}</label>
        <pv-password
          v-model="form.password"
          input-id="sign-in-password"
          :feedback="false"
          toggle-mask
          autocomplete="current-password"
          :invalid="passwordMissing"
          :aria-describedby="
            passwordMissing ? 'sign-in-password-error' : undefined
          "
          fluid
        />
        <small
          v-if="passwordMissing"
          id="sign-in-password-error"
          class="text-red-700"
          >{{ t('iam.iam-terms.errors.password-required') }}</small
        >
      </div>
      <pv-button
        type="submit"
        :label="t('iam.sign-in.submit')"
        icon="pi pi-sign-in"
        :loading="submitting"
        fluid
      />
    </form>

    <p class="m-0 text-center text-color-secondary">
      {{ t('iam.sign-in.no-account') }}
      <router-link
        :to="{ name: 'iam-sign-up', query: route.query }"
        class="text-primary font-medium no-underline hover:underline"
        >{{ t('iam.sign-in.sign-up') }}</router-link
      >
    </p>
  </authentication-layout>
</template>
