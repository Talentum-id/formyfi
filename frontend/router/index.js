import { createRouter, createWebHistory, useRoute } from 'vue-router';
import App from '@/pages/index.vue';
import Responses from '@/pages/responses.vue';
import MyResponses from '@/pages/my-responses.vue';
import login from '@/pages/login.vue';
import signUp from '@/pages/sign-up.vue';
import quest from '@/pages/quest.vue';
import Preview from '@/pages/preview.vue';
import Profile from '@/pages/profile.vue';
import Leaderboard from '@/pages/leaderboard.vue';
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
      requiresAuth: false,
    },
  },
  {
    path: '/responses/:id',
    name: 'responses',
    component: Responses,
    meta: {
      title: `Responses`,
      requiresAuth: true,
    },
  },
  {
    path: '/my-responses',
    name: 'my-responses',
    component: MyResponses,
    meta: {
      title: `My Responses`,
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      title: `Profile`,
      requiresAuth: true,
    },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard,
    meta: {
      title: `Leaderboard`,
      requiresAuth: true,
    },
  },
  {
    path: '/preview',
    name: 'preview',
    component: Preview,
    meta: {
      title: `Preview`,
      requiresAuth: true,
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
  history: createWebHistory(),
  routes,
});

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated');
};

function setPageTitleMiddleware(to, from, next) {
  const pageTitle = to.matched.find((record) => record.meta.title);
  if (pageTitle) {
    window.document.title = pageTitle.meta.title;
  }
}

router.beforeEach(async (to, from, next) => {
  useAuthStore().isQuest = to.name === 'quest';

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
  await setPageTitleMiddleware(to, from, next);
});

export default router;
