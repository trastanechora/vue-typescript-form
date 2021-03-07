import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Vote from '../views/Vote.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Forbidden from '../views/Forbidden.vue';
import NotFound from '../views/NotFound.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/vote',
    name: 'Vote',
    component: Vote
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      auth: true,
      permission: 'admin'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      auth: true
    }
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: Forbidden
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _, next) => {
  const storeString = localStorage.getItem('vuex') || '';
  const store = JSON.parse(storeString);
  if (to.matched.some(record => record.meta.auth)) {
    if (store && !store.auth.isLogin) {
      next('/login');
    } else {
      if (to.matched.some(record => record.meta.permission)) {
        if (store.user.currentUser.role === to.meta.permission) {
          next();
        } else {
          next('/forbidden');
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
