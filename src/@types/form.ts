/* ------------------------------------
=> Store Form related types
------------------------------------ */
export enum QuestionType {
  TEXT_FIELD = 'text_field',
  TEXT_AREA = 'text_area',
  SWITCH = 'switch',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox'
}

export enum FormStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ENDED = 'ended',
  DELETED = 'deleted'
}

export interface Option {
  text: string;
  value: string | number;
}
export interface Question {
  key: number;
  order: number;
  type: QuestionType;
  text: string;
  options: Option[];
}

export interface Answer {
  key: number;
  type: QuestionType;
  value: string | number | Option;
}

export interface Respondent {
  answers: Answer[];
}
export interface Form {
  uuid: string;
  label: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string;
  respondentCount: number;
  questionCount: number;
  status: FormStatus;
  link: string;
  questions: Question[];
  respondents: Respondent[];
}

/* ------------------------------------
=> Vuex Form State
------------------------------------ */
export interface FormState {
  isLoading: boolean;
  selectedForm: Form;
  formList: Form[];
}
