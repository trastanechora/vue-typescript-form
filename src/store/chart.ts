import Store, { ChartState, Chart } from '@/@types';

/* ----------------------------------------------
=> State
----------------------------------------------- */
const state = (): ChartState => ({
  chartData: [
    {
      label: 'Angular',
      value: 20,
      color: '#b02f28'
    },
    {
      label: 'React',
      value: 25,
      color: '#00D8FF'
    },
    {
      label: 'Vue',
      value: 30,
      color: '#2f993d'
    },
    {
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
  setChartData(state: ChartState, param: Chart[]): void {
    state.chartData = param;
  }
};

/* ----------------------------------------------
=> Actions
----------------------------------------------- */
const actions = {
  updateChartData(store: Store<ChartState> | any, param: Chart[]): void {
    store.commit('setChartData', param);
  }
};

export default {
  state,
  mutations,
  actions
};
