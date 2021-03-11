import Store, { AuthState, AuthData } from '@/@types';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): AuthState => ({
  isLoading: false,
  isLogin: false
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: AuthState, params: boolean): void {
    state.isLoading = params;
  },
  setLoginStatus(state: AuthState, params: boolean): void {
    state.isLogin = params;
  }
};

/* ------------------------------------------------
  => Actions
  ----------------------------------------------- */
const actions: any = {
  async login(store: Store<AuthState> | any, params: AuthData): Promise<boolean> {
    await store.commit('setLoading', true);
    return new Promise((resolve, reject) => {
      if (params.username === 'admin' && params.password === 'password') {
        store.commit('setLoginStatus', true);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Login berhasil, selamat datang!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        resolve(true);
      } else {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Maaf login gagal, username atau password salah',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        reject(false);
      }
    });
  },
  async logout(store: Store<AuthState> | any): Promise<any> {
    await store.commit('setLoading', true);
    await store.commit('setLoginStatus', false);
    await store.commit('setLoading', false);
    store.commit(
      'ui/setSnackbar',
      {
        open: true,
        message: 'Logout Berhasil!',
        color: 'green',
        timeout: 4000
      },
      { root: true }
    );
    return true;
  }
};

export default {
  state,
  mutations,
  actions
};
