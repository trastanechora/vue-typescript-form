/* ------------------------------------
=> Store Form related types
------------------------------------ */
export enum QuestionType {
  EMPTY = '',
  TEXT_FIELD = 'text_field',
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
  value: string | number;
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
}

export interface QuestionSection {
  title: string;
  questionList: Question[];
}

export interface Answer {
  key: number;
  type: QuestionTypeObject;
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
  questions: QuestionSection[];
  respondents: Respondent[];
}

/* ------------------------------------
=> Vuex Form State
------------------------------------ */
export interface FormState {
  isLoading: boolean;
  selectedForm: Form;
  questionTypeList: QuestionTypeObject[];
  formList: Form[];
}
