import Vue from 'vue';
import Vuex from 'vuex';

import ui from './ui';
import auth from './auth';
import user from './user';
import i18n from './i18n';

Vue.use(Vuex);

export default new Vuex.Store({
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
