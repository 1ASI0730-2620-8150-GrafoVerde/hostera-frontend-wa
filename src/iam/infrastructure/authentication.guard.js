import useIamStore from '../application/iam.store.js';

/**
 * Navigation guard that sends anonymous users to sign in, remembering where they were going,
 * and keeps signed-in users away from the sign-in and sign-up pages.
 * Routes open to anonymous users declare `meta.public`.
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @returns {import('vue-router').RouteLocationRaw|boolean} True to allow navigation, or the route to redirect to.
 */
export const authenticationGuard = (to) => {
  const store = useIamStore();
  const isPublic = to.meta['public'] === true;
  if (!store.isSignedIn && !isPublic)
    return {
      name: 'iam-sign-in',
      query: to.fullPath === '/' ? {} : { redirect: to.fullPath },
    };
  if (store.isSignedIn && isPublic) return { name: 'overview' };
  return true;
};

/**
 * Path to open after signing in: the page the user was going to, or the overview.
 * Only paths inside the application are accepted.
 * @param {import('vue-router').RouteLocationNormalized} route - Current route of the sign-in page.
 * @returns {string} Path inside the application.
 */
export const redirectPathAfterSignIn = (route) => {
  const redirect = route.query['redirect'];
  return typeof redirect === 'string' &&
    redirect.startsWith('/') &&
    !redirect.startsWith('//')
    ? redirect
    : '/';
};
