import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import ui from './ui';
import auth from './auth';
import user from './user';
import i18n from './i18n';

Vue.use(Vuex);

const dataState = createPersistedState({
  paths: ['user.currentUser', 'auth.isLogin', 'i18n']
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
    user: {
      namespaced: true,
      ...user
    },
    i18n: {
      namespaced: true,
      ...i18n
    }
  }
});
