import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

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
  Router.beforeEach((to) => {
    const auth = useAuthStore();

    auth.hydrateUserFromStorage();

    const isAuthenticated = auth.isAuthenticated;
    const isLogin = to.path === '/login';

    // 🔥 semua route kecuali login wajib auth
    if (!isLogin && !isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }

    if (to.matched.some((r) => r.meta.requiresSuperAdmin) && !auth.isSuperAdmin) {
      return '/';
    }

    if (isLogin && isAuthenticated) {
      return '/';
    }

    return true;
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
