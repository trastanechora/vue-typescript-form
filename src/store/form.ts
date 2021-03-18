import Store, { FormState, Form, FormStatus, QuestionType, Respondent } from '@/@types';
import { FORM_ENDPOINT } from '@/@api';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): FormState => ({
  isLoading: false,
  isEdit: false,
  questionTypeList: [
    {
      label: 'Jawaban Singkat',
      value: QuestionType.TEXT_FIELD
    },
    {
      label: 'Jawaban Paragraf',
      value: QuestionType.TEXT_AREA
    },
    {
      label: 'Pilihan Ganda',
      value: QuestionType.RADIO
    },
    {
      label: 'Pilihan Ganda Berbaris',
      value: QuestionType.RADIO_ROW
    },
    {
      label: 'Kotak Centang',
      value: QuestionType.CHECKBOX
    },
    {
      label: 'Kotak Centang Berbaris',
      value: QuestionType.CHECKBOX_ROW
    },
    {
      label: 'Skala Linier',
      value: QuestionType.SCALE
    },
    {
      label: 'Tanggal',
      value: QuestionType.DATE
    },
    {
      label: 'Waktu',
      value: QuestionType.TIME
    }
  ],
  selectedForm: {
    uuid: '',
    authorUuid: '',
    label: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    dueDate: '',
    respondentCount: 0,
    questionCount: 0,
    status: FormStatus.OPEN,
    link: '',
    questions: [
      {
        title: 'Bagian ',
        questionList: []
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
  setEditState(state: FormState, param: boolean): void {
    state.isEdit = param;
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
  async updateEditState(store: Store<FormState> | any, param: boolean): Promise<void> {
    await store.commit('setEditState', param);
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
    const forms = await FORM_ENDPOINT.getForms();
    console.warn('new list form nih!', forms);
    await store.commit('setFormList', forms);
    await store.commit('setLoading', false);
  },
  async getFormById(store: Store<FormState> | any, param: string): Promise<Form | string> {
    try {
      await store.commit('setLoading', true);
      const form = await FORM_ENDPOINT.getFormById(param);
      console.warn('result!', form);
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
    const currentData = store.state.selectedForm;
    currentData.respondents.push(params);
    currentData.respondentCount = currentData.respondents.length;
    return FORM_ENDPOINT.editForm(currentData)
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
