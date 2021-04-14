/* ------------------------------------
=> Store Form related types
------------------------------------ */
export enum QuestionType {
  EMPTY = '',
  TEXT_FIELD = 'text_field',
  NUMERIC_FIELD = 'numeric_field',
  TEXT_AREA = 'text_area',
  SELECT = 'select',
  RADIO = 'radio',
  RADIO_ROW = 'radio_row',
  CHECKBOX = 'checkbox',
  CHECKBOX_ROW = 'checkbox_row',
  SCALE = 'scale',
  DATE = 'date',
  TIME = 'time'
}

export enum FormStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ENDED = 'ended',
  DELETED = 'deleted'
}

export interface Option {
  text: string;
  value: string | number | boolean;
  otherValue?: string;
  icon?: string;
}

export interface QuestionTypeObject {
  label: string;
  value: QuestionType;
  icon?: string;
}
export interface Question {
  key: string;
  text: string;
  type: QuestionTypeObject;
  required: boolean;
  description?: string;
  options?: Option[];
  image?: any;
}

export interface QuestionSection {
  title: string;
  questionList: Question[];
}

export interface Respondent {
  uuid: string;
  answers: any;
  submitDate: string;
}

export interface Form {
  uuid: string;
  authorUuid: string;
  label: string;
  description: string;
  imageBanner: any;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  questionCount: number;
  status: FormStatus;
  link: string;
  questions: QuestionSection[];
  respondentCount: number;
  respondents: Respondent[];
}

/* ------------------------------------
=> Vuex Form State
------------------------------------ */
export interface FormState {
  isLoading: boolean;
  isEdit: boolean;
  selectedForm: Form;
  formList: Form[];
  respondentList: Respondent[];
}
