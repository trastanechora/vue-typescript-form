import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import ui from './ui';
import auth from './auth';
import form from './form';
import user from './user';
import board from './board';

Vue.use(Vuex);

const dataState = createPersistedState({
  paths: ['auth.isLogin', 'form', 'user.currentUser']
});

export default new Vuex.Store({
  plugins: [dataState],
  modules: {
    ui: {
      namespaced: true,
      ...ui
    },
    auth: {
      namespaced: true,
      ...auth
    },
    form: {
      namespaced: true,
      ...form
    },
    board: {
      namespaced: true,
      ...board
    },
    user: {
      namespaced: true,
      ...user
    }
  }
});
