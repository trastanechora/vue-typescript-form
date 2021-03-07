/* ------------------------------------
=> Chart data types
------------------------------------ */
export interface Chart {
  id: string;
  label: string;
  value: number;
  color?: string;
}

/* ------------------------------------
=> Store Chart related types
------------------------------------ */
export interface ChartState {
  isLoading: boolean;
  chartData: Chart[];
}
