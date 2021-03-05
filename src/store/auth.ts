import Store, { AuthState, AuthData } from '@/@types';
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
    const data = params;
    console.warn('login data:', data);
    await store.commit('setLoading', false);
  },
  async register(store: Store<AuthState> | any, params: AuthData): Promise<any> {
    await store.commit('setLoading', true);
    console.warn('register data:', params);
    USER_ENDPOINT.saveUser(params);
    await store.commit('setLoading', false);
  },
  async logout(store: Store<AuthState> | any): Promise<any> {
    await store.commit('setLoading', true);
    console.warn('Logging out..');
    await store.commit('setLoading', false);
  }
};

export default {
  state,
  mutations,
  actions
};
