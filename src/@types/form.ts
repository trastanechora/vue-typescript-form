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
  TIME = 'time',
  FILE = 'file'
}

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  OTHER = 'other'
}

export enum TextfieldType {
  FREETEXT = 'freetext',
  ALPHANUMERIC = 'alphanumeric',
  NUMERIC = 'numeric',
  ALPHABET = 'alphabet',
  TELEPHONE = 'telephone',
  EMAIL = 'email'
}

export enum FormStatus {
  UNSTARTED = 'unstarted',
  OPEN = 'open',
  CLOSED = 'closed',
  ENDED = 'ended',
  DELETED = 'deleted'
}

export enum FormStateType {
  NEW = 'new',
  EDIT = 'edit',
  DUPLICATE = 'duplicate'
}

export interface Option {
  text: string;
  value: string | number | boolean | TextfieldType | FileType;
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
  tableHeader?: string;
  type: QuestionTypeObject;
  validation?: Option;
  required: boolean;
  description?: string;
  options?: Option[];
  image?: any;
  isImport?: boolean;
}

export interface QuestionPage {
  title: string;
  sectionList: QuestionSection[];
}

export interface QuestionSection {
  title: string;
  customTitle?: boolean;
  questionList: Question[];
}

export interface Respondent {
  uuid: string;
  formId: string;
  answers: any;
  submitDate: string;
  isImport?: boolean;
  importId?: string;
}

export interface Form {
  uuid: string;
  authorUuid: string;
  label: string;
  description: string;
  imageBanner: any;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  dueDate?: string;
  lastReceived?: string;
  questionCount: number;
  status: FormStatus;
  link: string;
  questions: QuestionPage[];
  respondentCount: number;
  respondents?: Respondent[];
  isImport?: boolean;
  importId?: string;
}

/* ------------------------------------
=> Vuex Form State
------------------------------------ */
export interface FormState {
  isLoading: boolean;
  stateType: FormStateType;
  selectedForm: Form;
  formList: Form[];
  respondentList: Respondent[];
  postponeNotification: boolean;
}
