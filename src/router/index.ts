import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Dashboard from '@/views/Dashboard.vue';
import AddForm from '@/views/AddForm.vue';
import Login from '@/views/Login.vue';
import Forbidden from '@/views/Forbidden.vue';
import NotFound from '@/views/NotFound.vue';
import Questionnaire from '@/views/Questionnaire.vue';
import Admin from '@/layout/Admin.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/questionnaire/:id',
    name: 'Questionnaire',
    component: Questionnaire
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Admin,
    meta: {
      auth: true
    },
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'add',
        name: 'Add New Form',
        component: AddForm
      }
    ]
  },
  // {
  //   path: '/dashboard/add',
  //   name: 'Add New Form',
  //   component: AddForm,
  //   meta: {
  //     auth: true
  //   }
  // },
  {
    path: '/admin',
    name: 'Login',
    component: Login
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
