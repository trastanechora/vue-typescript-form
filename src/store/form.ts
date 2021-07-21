import Store, { FormState, Form, FormStatus, Respondent, FormStateType } from '@/@types';
import { FORM_ENDPOINT, RESPONDENT_ENDPOINT } from '@/@api';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): FormState => ({
  isLoading: false,
  stateType: FormStateType.NEW,
  selectedForm: {
    uuid: '',
    authorUuid: '',
    label: '',
    description: '',
    imageBanner: undefined,
    createdAt: '',
    updatedAt: '',
    startDate: '',
    dueDate: '',
    respondentCount: 0,
    questionCount: 0,
    status: FormStatus.OPEN,
    link: '',
    questions: [
      {
        title: 'Halaman ',
        sectionList: []
      }
    ],
    respondents: []
  },
  formList: [],
  respondentList: []
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: FormState, param: boolean): void {
    state.isLoading = param;
  },
  setStateType(state: FormState, param: FormStateType): void {
    state.stateType = param;
  },
  setSelectedForm(state: FormState, param: Form): void {
    state.selectedForm = param;
  },
  setFormList(state: FormState, params: Form[]): void {
    state.formList = params;
  },
  addForm(state: FormState, param: Form): void {
    state.formList.push(param);
  }
};

/* ------------------------------------------------
  => Actions
  ----------------------------------------------- */
const actions: any = {
  async updateStateType(store: Store<FormState> | any, param: FormStateType): Promise<void> {
    await store.commit('setStateType', param);
  },
  async updateSelectedForm(store: Store<FormState> | any, params: Form): Promise<boolean> {
    await store.commit('setLoading', true);
    return new Promise(resolve => {
      store.commit('setSelectedForm', params);
      store.commit('setLoading', false);
      resolve(true);
    });
  },
  async getForms(store: Store<FormState> | any): Promise<void> {
    await store.commit('setLoading', true);
    const forms = await FORM_ENDPOINT.getForms(store.rootState.user.currentUser.uuid);
    console.warn('forms', forms);
    await store.commit('setFormList', forms);
    await store.commit('setLoading', false);
  },
  async getFormById(store: Store<FormState> | any, param: string): Promise<Form | string> {
    try {
      await store.commit('setLoading', true);
      const form = await FORM_ENDPOINT.getFormById(param);
      store.commit('setSelectedForm', form);
      await store.commit('setLoading', false);
      return form;
    } catch (err) {
      store.commit(
        'ui/setSnackbar',
        {
          open: true,
          message: 'Maaf, form tidak dapat ditemukan',
          color: 'red',
          timeout: 4000
        },
        { root: true }
      );
      await store.commit('setLoading', false);
      throw err;
    }
  },
  async saveForm(store: Store<FormState> | any, params: Form): Promise<boolean> {
    await store.commit('setLoading', true);
    return FORM_ENDPOINT.saveForm(params)
      .then((res: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Form berhasil disimpan!',
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
            message: `Form gagal disimpan: ${err}`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  },
  async editForm(store: Store<FormState> | any, params: Form): Promise<boolean> {
    await store.commit('setLoading', true);
    return FORM_ENDPOINT.editForm(params)
      .then((res: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Perubahan form berhasil disimpan!',
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
            message: `Form gagal disimpan: ${err}`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  },
  async submitResponse(store: Store<FormState> | any, params: Respondent): Promise<boolean> {
    await store.commit('setLoading', true);
    return RESPONDENT_ENDPOINT.saveRespondent(params)
      .then((res: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Tanggapan Anda telah berhasil disimpan!',
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
            message: `Tanggapan gagal disimpan: ${err}`,
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        throw err;
      });
  },
  async deleteForm(store: Store<FormState> | any): Promise<any> {
    return FORM_ENDPOINT.deleteForm(store.state.selectedForm)
      .then((res: Form) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Sukses menghapus Form!',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.dispatch('getForms');
        return res;
      })
      .catch((err: any) => {
        store.commit('setLoading', false);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: `Menghapus Form gagal: ${err}!`,
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
