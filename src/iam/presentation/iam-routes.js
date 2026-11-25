const signIn = () => import('./views/sign-in.vue');
const signUp = () => import('./views/sign-up.vue');

/**
 * Routes of the IAM bounded context, open to anonymous users.
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const iamRoutes = [
  {
    path: 'sign-in',
    name: 'iam-sign-in',
    component: signIn,
    meta: { title: 'Sign in', public: true },
  },
  {
    path: 'sign-up',
    name: 'iam-sign-up',
    component: signUp,
    meta: { title: 'Create account', public: true },
  },
];

export default iamRoutes;
