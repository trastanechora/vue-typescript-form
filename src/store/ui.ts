import Store, { UiState, Snackbar } from '../@types';

/* ----------------------------------------------
=> State
----------------------------------------------- */
const state = (): UiState => ({
  snackbar: {
    open: false,
    message: '',
    color: 'success',
    timeout: 4000
  },
  isDark: false
});

/* ----------------------------------------------
=> Mutations
----------------------------------------------- */
const mutations = {
  closeSnackbar(state: UiState): void {
    state.snackbar.open = false;
  },
  setSnackbar(state: UiState, params: Snackbar): void {
    state.snackbar.open = true;
    state.snackbar.message = params.message;
    state.snackbar.color = params.color;
    state.snackbar.timeout = params.timeout;
  },
  setIsDark(state: UiState, param: boolean): void {
    state.isDark = param;
  }
};

/* ----------------------------------------------
=> Actions
----------------------------------------------- */
const actions = {
  clearSnackbar(store: Store<UiState> | any): void {
    store.commit('closeSnackbar');
  },
  showSnackbar(store: Store<UiState> | any, params: Snackbar): void {
    store.commit('setSnackbar', params);
  },
  changeIsDark(store: Store<UiState> | any, param: boolean): void {
    store.commit('setIsDark', param);
  }
};

export default {
  state,
  mutations,
  actions
};
