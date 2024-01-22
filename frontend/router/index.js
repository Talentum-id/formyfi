import { createRouter, createWebHashHistory } from 'vue-router';
import App from '@/pages/index.vue';
import Responses from '@/pages/responses.vue';
import login from '@/pages/login.vue';
import signUp from '@/pages/sign-up.vue';
import quest from '@/pages/quest.vue';
import Preview from '@/pages/preview.vue';
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/',
    name: 'app',
    component: App,
    meta: {
      title: `Q&A List`,
      requiresAuth: true,
    },
  },
  {
    path: '/quest/:id',
    name: 'quest',
    component: quest,
    meta: {
      title: `Quest`,
      requiresAuth: true,
    },
  },
  {
    path: '/responses',
    name: 'responses',
    component: Responses,
    meta: {
      title: `Responses`,
      requiresAuth: true,
    },
  },
  {
    path: '/preview',
    name: 'preview',
    component: Preview,
    meta: {
      title: `Preview`,
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
  {
    path: '/login',
    name: '/login',
    component: login,
    meta: {
      title: `Login`,
      requiresAuth: false,
    },
  },
  {
    path: '/sign-up',
    name: '/sign-up',
    component: signUp,
    meta: {
      title: `Register`,
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const isAuthenticated = () => {
  return sessionStorage.getItem('isAuthenticated');
};

function setPageTitleMiddleware(to, from, next) {
  const pageTitle = to.matched.find((record) => record.meta.title);
  if (pageTitle) {
    window.document.title = pageTitle.meta.title;
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
  await setPageTitleMiddleware(to, from, next);
});

export default router;
