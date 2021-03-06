import Vue from 'vue';
import Vuex from 'vuex';

import ui from './ui';
import auth from './auth';
import user from './user';

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
    }
  }
});
