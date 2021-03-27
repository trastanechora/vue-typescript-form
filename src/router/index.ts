import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Dashboard from '@/views/Dashboard.vue';
import AddForm from '@/views/AddForm.vue';
import Login from '@/views/Login.vue';
import Forbidden from '@/views/Forbidden.vue';
import NotFound from '@/views/NotFound.vue';
import Questionnaire from '@/views/Questionnaire.vue';
import Response from '@/views/Response.vue';
import ThankYou from '@/views/ThankYou.vue';
import Profile from '@/views/Profile.vue';
import Default from '@/layout/Default.vue';
import Admin from '@/layout/Admin.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/admin',
        name: 'Login',
        component: Login
      },
      {
        path: '/thank-you',
        name: 'Thank You',
        component: ThankYou
      },
      {
        path: '/forbidden',
        name: 'forbidden',
        component: Forbidden
      }
    ]
  },
  {
    path: '/questionnaire/:id',
    name: 'Questionnaire',
    component: Questionnaire
  },

  {
    path: '/dashboard',
    component: Admin,
    meta: {
      auth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'form',
        name: 'Add New Form',
        component: AddForm
      },
      {
        path: ':id',
        name: 'View Response',
        component: Response
      }
    ]
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
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }; // Always scroll to top on route change
  }
});

router.beforeEach((to, _, next) => {
  const storeString = localStorage.getItem('vuex') || '{}';
  const store = JSON.parse(storeString);
  if (to.matched.some(record => record.meta.auth)) {
    if (store && !store.auth.isLogin) {
      next('/forbidden');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
