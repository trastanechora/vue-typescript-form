import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Vote from '../views/Vote.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
    // component: () => import('../views/Home.vue')
  },
  {
    path: '/vote',
    name: 'Vote',
    component: Vote
    // component: () => import('../views/Vote.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
    // component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
    // component: () => import('../views/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
    // component: () => import('../views/Profile.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
