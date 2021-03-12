import Store, { FormState, Form, FormStatus, QuestionType } from '@/@types';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): FormState => ({
  isLoading: false,
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
    label: '',
    description: '',
    createdDate: '',
    updatedDate: '',
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
  formList: []
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: FormState, param: boolean): void {
    state.isLoading = param;
  },
  setSelectedForm(state: FormState, params: Form): void {
    state.selectedForm = params;
  },
  addForm(state: FormState, params: Form): void {
    state.formList.push(params);
  }
};

/* ------------------------------------------------
  => Actions
  ----------------------------------------------- */
const actions: any = {
  async updateSelectedForm(store: Store<FormState> | any, params: Form): Promise<boolean> {
    await store.commit('setLoading', true);
    return new Promise(resolve => {
      store.commit('setSelectedForm', params);
      // Pinjam dulu
      store.commit(
        'ui/setSnackbar',
        {
          open: true,
          message: 'Form berhasil disimpan',
          color: 'green',
          timeout: 4000
        },
        { root: true }
      );
      // Pinjam dulu
      store.commit('setLoading', false);
      resolve(true);
    });
  },
  async saveForm(store: Store<FormState> | any, params: Form): Promise<boolean> {
    await store.commit('setLoading', true);
    return new Promise(resolve => {
      store.commit('addForm', params);
      store.commit(
        'ui/setSnackbar',
        {
          open: true,
          message: 'Form berhasil disimpan',
          color: 'green',
          timeout: 4000
        },
        { root: true }
      );
      store.commit('setLoading', false);
      resolve(true);
    });
  }
};

export default {
  state,
  mutations,
  actions
};
