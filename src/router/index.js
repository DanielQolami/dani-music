/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

/* route level code-splitting
this generates a separate chunk (about.[hash].js) for this route
which is lazy-loaded when the route is visited. */
// we can group two chunks into one chunk.
const ManageMusic = () => import(/* webpackChunkName: 'groupedChunk' */'@/views/ManageMusic.vue');
const Song = () => import(/* webpackChunkName: 'groupedChunk' */'@/views/Song.vue');
const HomeView = () => import('@/views/HomeView.vue');
const AboutView = () => import(/* webpackChunkName: 'about' */ '@/views/AboutView.vue');
const TOS = () => import('@/components/TOS.vue');

const routes = [
  {
    path: '/',
    name: 'home' /* if a path gets changed in app, we will have to change all other related links, too. but, using name, we have more flexibility. */,
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    name: 'manage',
    /* alias: '/manage', // the old path, that we want to redirect to new path in next line.
    BUT, we will use redirect for better SEO. */
    path: '/manage-music',
    /* for locking the page & requiring an Authentication, first. */
    meta: {
      requiresAuth: true,
    },
    component: ManageMusic,
    /* beforeEnter: (to, from, next) => {
      if (store.state.userLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }, */
  },
  {
    // redirecting to the right path
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    name: 'tos',
    path: '/tos',
    component: TOS,
  },
  {
    /* 404 Page */
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('@/views/PageNotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass:
    'text-yellow-500' /* this code, sets active class to the active router-link */,
});

router.beforeEach((to, from, next) => {
  // console.log(to.matched);

  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

/* this is a vue router guard. this performs checks on EVERY route. (which is kinda excessive)
For Locking the site & taking users to login page, to authenticate, first.

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && auth.currentUser) {
  // if current page is login or the user is logged in, before. (auth.currentUser is from Firebase)
    next('/');
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser) {
    next('/login');
    return;
  }

  next(); // if none of above is correct, we will continue.
});

// you need to change some things in the store file, too. reference: easy authentication with vue 3 & firebase 9 (https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjInM7Diqb5AhWkQfEDHUJxAjYQwqsBegQIAxAB&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKc-FbPSdezg&usg=AOvVaw0N86q3GaasN-BW4Q0KGIoG)
*/

export default router;
