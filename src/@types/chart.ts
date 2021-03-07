/* ------------------------------------
=> Chart data types
------------------------------------ */
export interface Chart {
  label: string;
  value: number;
  color?: string;
}

/* ------------------------------------
=> Store Chart related types
------------------------------------ */
export interface ChartState {
  chartData: Chart[];
}
