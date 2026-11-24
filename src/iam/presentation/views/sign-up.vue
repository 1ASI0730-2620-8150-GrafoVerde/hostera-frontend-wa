<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useIamStore from '../../application/iam.store.js';
import { SignUpCommand } from '../../domain/sign-up.command.js';
import { IamError } from '../../domain/model/iam.error.js';
import { redirectPathAfterSignIn } from '../../infrastructure/authentication.guard.js';
import AuthenticationLayout from '../components/authentication-layout.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useIamStore();
const { submitting } = storeToRefs(store);
const { signUp } = store;

const passwordLimits = {
  min: SignUpCommand.passwordMinLength,
  max: SignUpCommand.passwordMaxLength,
};

const form = reactive({ username: '', password: '', confirmPassword: '' });
const submitted = ref(false);
const errorCode = ref('');

const usernameError = computed(() => {
  if (!submitted.value) return '';
  const username = form.username.trim();
  if (!username) return t('iam.iam-terms.errors.username-required');
  if (username.length > SignUpCommand.usernameMaxLength)
    return t('iam.iam-terms.errors.username-too-long', {
      max: SignUpCommand.usernameMaxLength,
    });
  return '';
});
const passwordError = computed(() =>
  submitted.value &&
  (form.password.length < passwordLimits.min ||
    form.password.length > passwordLimits.max)
    ? t('iam.iam-terms.errors.invalid-password-length', passwordLimits)
    : '',
);
const confirmPasswordError = computed(() =>
  submitted.value && form.confirmPassword !== form.password
    ? t('iam.sign-up.passwords-mismatch')
    : '',
);

/**
 * Registers the user, signs it in, and opens the page it was going to, or the overview.
 */
const signUpUser = async () => {
  submitted.value = true;
  errorCode.value = '';
  if (usernameError.value || passwordError.value || confirmPasswordError.value)
    return;
  try {
    await signUp(
      new SignUpCommand({ username: form.username, password: form.password }),
    );
    await router.replace(redirectPathAfterSignIn(route));
  } catch (error) {
    errorCode.value = error instanceof IamError ? error.code : 'connection';
  }
};
</script>

<template>
  <authentication-layout
    :title="t('iam.sign-up.title')"
    :subtitle="t('iam.sign-up.subtitle')"
  >
    <pv-message
      v-if="errorCode"
      severity="error"
      icon="pi pi-exclamation-circle"
      role="alert"
    >
      {{ t(`iam.iam-terms.errors.${errorCode}`, passwordLimits) }}
    </pv-message>

    <form
      class="flex flex-column gap-4"
      novalidate
      @submit.prevent="signUpUser"
    >
      <div class="flex flex-column gap-2">
        <label for="sign-up-username" class="font-medium">{{
          t('iam.iam-terms.username')
        }}</label>
        <pv-input-text
          id="sign-up-username"
          v-model="form.username"
          autocomplete="username"
          autofocus
          :invalid="Boolean(usernameError)"
          :aria-describedby="
            usernameError ? 'sign-up-username-error' : undefined
          "
          fluid
        />
        <small
          v-if="usernameError"
          id="sign-up-username-error"
          class="text-red-700"
          >{{ usernameError }}</small
        >
      </div>
      <div class="flex flex-column gap-2">
        <label for="sign-up-password" class="font-medium">{{
          t('iam.iam-terms.password')
        }}</label>
        <pv-password
          v-model="form.password"
          input-id="sign-up-password"
          :feedback="false"
          toggle-mask
          autocomplete="new-password"
          :invalid="Boolean(passwordError)"
          aria-describedby="sign-up-password-hint"
          fluid
        />
        <small
          id="sign-up-password-hint"
          :class="passwordError ? 'text-red-700' : 'text-color-secondary'"
          >{{
            passwordError || t('iam.sign-up.password-hint', passwordLimits)
          }}</small
        >
      </div>
      <div class="flex flex-column gap-2">
        <label for="sign-up-confirm-password" class="font-medium">{{
          t('iam.sign-up.confirm-password')
        }}</label>
        <pv-password
          v-model="form.confirmPassword"
          input-id="sign-up-confirm-password"
          :feedback="false"
          toggle-mask
          autocomplete="new-password"
          :invalid="Boolean(confirmPasswordError)"
          :aria-describedby="
            confirmPasswordError ? 'sign-up-confirm-password-error' : undefined
          "
          fluid
        />
        <small
          v-if="confirmPasswordError"
          id="sign-up-confirm-password-error"
          class="text-red-700"
          >{{ confirmPasswordError }}</small
        >
      </div>
      <pv-button
        type="submit"
        :label="t('iam.sign-up.submit')"
        icon="pi pi-user-plus"
        :loading="submitting"
        fluid
      />
    </form>

    <p class="m-0 text-center text-color-secondary">
      {{ t('iam.sign-up.has-account') }}
      <router-link
        :to="{ name: 'iam-sign-in', query: route.query }"
        class="text-primary font-medium no-underline hover:underline"
        >{{ t('iam.sign-up.sign-in') }}</router-link
      >
    </p>
  </authentication-layout>
</template>
