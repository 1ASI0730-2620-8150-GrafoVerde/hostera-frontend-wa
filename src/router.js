import { createRouter, createWebHistory } from 'vue-router';
import Home from './shared/presentation/views/home.vue';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import roomsRoutes from './rooms/presentation/rooms-routes.js';
import bookingsRoutes from './bookings/presentation/bookings-routes.js';
import accessControlRoutes from './access-control/presentation/access-control-routes.js';
import overviewRoutes from './overview/presentation/overview-routes.js';
import iamRoutes from './iam/presentation/iam-routes.js';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';
import { registerIamInterceptor } from './iam/infrastructure/iam.interceptor.js';

const routes = [
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/iam', children: iamRoutes },
  { path: '/bookings', children: bookingsRoutes },
  { path: '/access-control', children: accessControlRoutes },
  {
    path: '/rooms',
    name: 'rooms',
    redirect: { name: 'rooms-availability' },
    children: roomsRoutes,
  },
  {
    path: '/inventory',
    name: 'inventory',
    redirect: { name: 'inventory-items' },
    children: inventoryRoutes,
  },
  { path: '/', children: overviewRoutes },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

registerIamInterceptor(router);

/**
 * Global navigation guard that sends anonymous users to sign in and updates the document title.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @returns {import('vue-router').RouteLocationRaw|boolean} - True to allow navigation, or the route to redirect to.
 */
router.beforeEach((to) => {
  const authentication = authenticationGuard(to);
  if (authentication !== true) return authentication;
  // Set the page title
  let baseTitle = 'Hostera';
  document.title = to.meta['title']
    ? `${baseTitle} - ${to.meta['title']}`
    : baseTitle;
  return true;
});

export default router;
