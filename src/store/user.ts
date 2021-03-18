import Store, { UserState, User } from '@/@types';
import { USER_ENDPOINT } from '@/@api';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): UserState => ({
  isLoading: false,
  currentUser: {
    uuid: '',
    username: '',
    displayName: '',
    role: 'user',
    imgUrl: ''
  },
  userList: []
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: UserState, params: boolean): void {
    state.isLoading = params;
  },
  setCurrentUser(state: UserState, param: User): void {
    state.currentUser = param;
  },
  setUserList(state: UserState, param: User[]): void {
    state.userList = param;
  }
};

/* ------------------------------------------------
  => Actions
  ----------------------------------------------- */
const actions: any = {
  async getUsers(store: Store<UserState> | any): Promise<any> {
    await store.commit('setLoading', true);
    const users = await USER_ENDPOINT.getUsers();
    await store.commit('setUserList', users);
    await store.commit('setLoading', false);
    return users;
  },
  async editUser(store: Store<UserState> | any, user: User): Promise<any> {
    await store.commit('setLoading', true);
    return USER_ENDPOINT.editUser(user)
      .then((res: User) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Edit User Success!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.dispatch('getUsers');
        return res;
      })
      .catch((err: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: `Edit User Failed: ${err}!`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  },
  async deleteUser(store: Store<UserState> | any, user: User): Promise<any> {
    return USER_ENDPOINT.deleteUser(user)
      .then((res: User) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Delete User Success!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.dispatch('getUsers');
        return res;
      })
      .catch((err: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: `Delete User Failed: ${err}!`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  }
};

export default {
  state,
  mutations,
  actions
};
