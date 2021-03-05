/* ------------------------------------
=> Store Auth related types
------------------------------------ */
export interface AuthData {
  username: string;
  password: string;
}

/* ------------------------------------
=> Vuex Auth State
------------------------------------ */
export interface AuthState {
  isLoading: boolean;
  isLogin: boolean;
}
