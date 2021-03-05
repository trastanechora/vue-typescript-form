/* ------------------------------------
=> Store User related types
------------------------------------ */
export interface User {
  id: string;
  username: string;
}

/* ------------------------------------
=> Vuex User State
------------------------------------ */
export interface UserState {
  isLoading: boolean;
  currentUser: User;
  userList: User[];
}
