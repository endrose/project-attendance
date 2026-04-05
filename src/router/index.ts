import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

const APP_TITLE = 'AksaDigitex Attendance BackOffice';

function resolveDocumentTitle(to: { matched: Array<{ meta: Record<string, unknown> }> }): string {

  const nearesTitle = [...to.matched]
    .reverse()
    .map((r) => r.meta && r.meta.title)
    .find((title): title is string => typeof title === 'string' && title.length > 0);


  return nearesTitle ? ` ${APP_TITLE} |  ${nearesTitle}` : APP_TITLE;
}


export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // BeforeEach route
  Router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // Here you would check if the user is authenticated
    const isAuthenticated = false; // Replace with actual authentication check

    if (requiresAuth && !isAuthenticated) {
      // If the route requires auth and the user isn't authenticated, redirect to login
      next('/login');
    } else {
      // Otherwise, proceed to the route
      next();
    }
  });

  // Always leave this as last one,
  // but you can also remove it
  Router.afterEach((to) => {
    if (process.env.CLIENT) {
      document.title = resolveDocumentTitle(to);
    }
  });

  return Router;
});
