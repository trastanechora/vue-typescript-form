import Store, { ChartState, Chart } from '@/@types';

/* ----------------------------------------------
=> State
----------------------------------------------- */
const state = (): ChartState => ({
  isLoading: false,
  chartData: [
    {
      id: '1',
      label: 'Angular',
      value: 20,
      color: '#b02f28'
    },
    {
      id: '2',
      label: 'React',
      value: 25,
      color: '#00D8FF'
    },
    {
      id: '3',
      label: 'Vue',
      value: 30,
      color: '#2f993d'
    },
    {
      id: '4',
      label: 'Svelte',
      value: 15,
      color: '#ad5a17'
    }
  ]
});

/* ----------------------------------------------
=> Mutations
----------------------------------------------- */
const mutations = {
  setLoading(state: ChartState, param: boolean): void {
    state.isLoading = param;
  },
  setChartData(state: ChartState, param: Chart[]): void {
    state.chartData = param;
  }
};

/* ----------------------------------------------
=> Actions
----------------------------------------------- */
const actions = {
  updateChartData(store: Store<ChartState> | any, chartData: Chart): Promise<boolean> {
    return new Promise(resolve => {
      store.commit('setLoading', true);
      store.commit('setChartData', chartData);
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
