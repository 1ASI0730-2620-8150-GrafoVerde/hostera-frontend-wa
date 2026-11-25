import useIamStore from '../application/iam.store.js';
import { configureSessionHandlers } from '../../shared/infrastructure/base-api.js';

/**
 * Makes every request to the Hostera Platform carry the bearer token of the session,
 * and sends the user to sign in again when the platform no longer accepts that token.
 * @param {import('vue-router').Router} router - Application router.
 * @returns {void}
 */
export function registerIamInterceptor(router) {
  configureSessionHandlers({
    token: () => useIamStore().token,
    onAuthenticationRequired: () => {
      const store = useIamStore();
      if (!store.isSignedIn) return;
      store.expireSession();
      const { fullPath } = router.currentRoute.value;
      router.push({ name: 'iam-sign-in', query: { redirect: fullPath } });
    },
  });
}
