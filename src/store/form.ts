import Store, { FormState, Form, FormStatus } from '@/@types';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): FormState => ({
  isLoading: false,
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
    questions: [],
    respondents: []
  },
  formList: []
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: FormState, params: boolean): void {
    state.isLoading = params;
  },
  setSelectedForm(state: FormState, params: Form): void {
    state.selectedForm = params;
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
