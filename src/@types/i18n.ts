/* ------------------------------------
=> Pages' dictionary related types
------------------------------------ */
export interface HeaderLang {
  selectLang: string;
  comingLang: string;
  english: string;
  bahasa: string;
  registerLogin: string;
  logout: string;
}
export interface ProfilePage {
  darkMode: string;
  enableBahasa: string;
}
export interface CurrentLanguageSetting {
  header: HeaderLang;
  profilePage: ProfilePage;
}

/* ------------------------------------
=> Store i18n related types
------------------------------------ */
export interface I18nState {
  isBahasaIndonesia: boolean;
  languageSetting: CurrentLanguageSetting;
}
