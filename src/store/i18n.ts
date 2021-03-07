import Store, { I18nState } from '@/@types';

/* ----------------------------------------------
=> State
----------------------------------------------- */
const state = (): I18nState => ({
  languageSetting: {
    header: {
      selectLang: 'Select Language',
      comingLang: 'Few more languages are coming soon!',
      english: 'English (EN - US)',
      bahasa: 'Bahasa Indonesia (ID)',
      registerLogin: 'Register / Login',
      logout: 'Logout'
    },
    profilePage: {
      darkMode: 'Dark Mode',
      enableBahasa: 'Enable Bahasa Indonesia'
    }
  },
  isBahasaIndonesia: false
});

/* ----------------------------------------------
=> Mutations
----------------------------------------------- */
const mutations = {
  setEnglishAsCurrentLanguage(state: I18nState): void {
    state.isBahasaIndonesia = false;
    state.languageSetting.header = {
      selectLang: 'Select Language',
      comingLang: 'Few more languages are coming soon!',
      english: 'English (EN - US)',
      bahasa: 'Bahasa Indonesia (ID)',
      registerLogin: 'Register / Login',
      logout: 'Logout'
    };
    state.languageSetting.profilePage = {
      darkMode: 'Dark Mode',
      enableBahasa: 'Enable Bahasa Indonesia'
    };
  },
  setBahasaAsCurrentLanguage(state: I18nState): void {
    state.isBahasaIndonesia = true;
    state.languageSetting.header = {
      selectLang: 'Pilih Bahasa',
      comingLang: 'Beberapa bahasa yang lain akan segera hadir!',
      english: 'English (EN - US)',
      bahasa: 'Bahasa Indonesia (ID)',
      registerLogin: 'Daftar / Masuk',
      logout: 'Keluar'
    };
    state.languageSetting.profilePage = {
      darkMode: 'Mode Gelap',
      enableBahasa: 'Aktifkan Tampilan Bahasa Indonesia'
    };
  }
};

/* ----------------------------------------------
=> Actions
----------------------------------------------- */
const actions = {
  changeLanguage(store: Store<I18nState> | any, params: string): void {
    if (params === 'EN') {
      store.commit('setEnglishAsCurrentLanguage');
    } else {
      store.commit('setBahasaAsCurrentLanguage');
    }
  }
};

export default {
  state,
  mutations,
  actions
};
