/* ------------------------------------
=> Store User related types
------------------------------------ */
export interface User {
  uuid: string;
  username: string;
  displayName: string;
  role: string;
  imgUrl: string;
}

export interface RegisterUserData {
  username: string;
  password: string;
  displayName: string;
}

/* ------------------------------------
=> Vuex User State
------------------------------------ */
export interface UserState {
  isLoading: boolean;
  currentUser: User;
  userList: User[];
}
