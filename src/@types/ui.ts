/* ------------------------------------
=> Snackbar types
------------------------------------ */
export interface Snackbar {
  open: boolean;
  message: string;
  color: string;
  timeout: number;
}

/* ------------------------------------
=> Page's related types
------------------------------------ */
export interface SidebarMenuItem {
  icon: string;
  title: string;
  to: string;
}

export interface TableHeader {
  text: string;
  value: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  divider?: boolean;
  class?: string | string[];
  width?: string | number;
  filter?: (value: any, search: string, item: any) => boolean;
  sort?: (a: any, b: any) => number;
}

export type VForm = Vue & { validate: () => boolean; reset: () => void; resetValidation: () => void };

/* ------------------------------------
=> Store UI related types
------------------------------------ */
export interface UiState {
  snackbar: Snackbar;
}
