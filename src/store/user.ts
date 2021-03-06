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
    voteGiven: false,
    voteValue: 'N/A',
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
    console.warn('users', users);
    await store.commit('setUserList', users);
    await store.commit('setLoading', false);
    return users;
  }
};

export default {
  state,
  mutations,
  actions
};
