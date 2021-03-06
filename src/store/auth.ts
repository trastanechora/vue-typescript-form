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
        console.warn('success');
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        console.warn('failed');
        store.commit('setLoading', false);
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
