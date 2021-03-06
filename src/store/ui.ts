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
  }
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
    store.commit('setSnackbar', {
      snackbarOpen: true,
      snackbarMessage: params.message,
      snackTimeout: params.timeout === 0 ? 0 : params.timeout > 0 ? params.timeout : 4000,
      snackbarColor: params.color ? params.color : ''
    });
  }
};

export default {
  state,
  mutations,
  actions
};
