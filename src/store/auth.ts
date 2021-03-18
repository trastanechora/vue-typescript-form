import Store, { AuthState, AuthData, RegisterUserData } from '@/@types';
import { USER_ENDPOINT } from '@/@api';

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
  // async login(store: Store<AuthState> | any, params: AuthData): Promise<boolean> {
  //   await store.commit('setLoading', true);
  //   return new Promise((resolve, reject) => {
  //     if (params.username === 'admin' && params.password === 'password') {
  //       store.commit('setLoginStatus', true);
  //       store.commit(
  //         'ui/setSnackbar',
  //         {
  //           open: true,
  //           message: 'Login berhasil, selamat datang!',
  //           color: 'green',
  //           timeout: 4000
  //         },
  //         { root: true }
  //       );
  //       store.commit('setLoading', false);
  //       resolve(true);
  //     } else {
  //       store.commit(
  //         'ui/setSnackbar',
  //         {
  //           open: true,
  //           message: 'Maaf login gagal, username atau password salah',
  //           color: 'red',
  //           timeout: 4000
  //         },
  //         { root: true }
  //       );
  //       store.commit('setLoading', false);
  //       reject(false);
  //     }
  //   });
  // },
  // async logout(store: Store<AuthState> | any): Promise<any> {
  //   await store.commit('setLoading', true);
  //   await store.commit('setLoginStatus', false);
  //   await store.commit('setLoading', false);
  //   store.commit(
  //     'ui/setSnackbar',
  //     {
  //       open: true,
  //       message: 'Logout Berhasil!',
  //       color: 'green',
  //       timeout: 4000
  //     },
  //     { root: true }
  //   );
  //   return true;
  // }
  async login(store: Store<AuthState> | any, params: AuthData): Promise<any> {
    await store.commit('setLoading', true);
    return USER_ENDPOINT.loginUser(params)
      .then((res: any) => {
        store.commit('setLoginStatus', true);
        store.commit('user/setCurrentUser', res, { root: true });
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Login Berhasil!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        return true;
      })
      .catch((err: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: err,
            color: 'error',
            timeout: 4000
          },
          { root: true }
        );
        throw false;
      });
  },
  async register(store: Store<AuthState> | any, params: RegisterUserData): Promise<any> {
    await store.commit('setLoading', true);
    return USER_ENDPOINT.saveUser(params)
      .then((res: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Register success, please login!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        return res;
      })
      .catch((err: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: `Register failed: ${err}`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  },
  async logout(store: Store<AuthState> | any): Promise<any> {
    await store.commit('setLoading', true);
    store.commit('user/setCurrentUser', { uuid: '', username: '' }, { root: true });
    store.commit('setLoginStatus', false);
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
