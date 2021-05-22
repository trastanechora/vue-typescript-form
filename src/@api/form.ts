import { RESPONDENT_ENDPOINT } from '@/@api';
import { convertByteArrayToBlob } from '@/@utils';
import { Respondent } from '@/@types';

const DB_NAME = 'formdb';
const DB_VERSION = 1;
let DB: any;

import { Form } from '@/@types';

export const FORM_ENDPOINT: any = {
  /* ------------------------------------
  => Check IndexedDB
  ------------------------------------ */
  async getDb(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = e => {
        console.log('[API] Error opening DB!', e);
        reject('Error');
      };
      request.onsuccess = (e: any) => {
        DB = e.target.result;
        resolve(DB);
      };
      request.onupgradeneeded = (e: any) => {
        console.log('[API] DB Upgrade success!');
        const db: any = e.target.result;
        const objectStore = db.createObjectStore('forms', { keyPath: 'uuid' });
        objectStore.createIndex('label', 'label', { unique: false });
        objectStore.createIndex('description', 'description', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        objectStore.createIndex('dueDate', 'dueDate', { unique: false });
        objectStore.createIndex('questionCount', 'questionCount', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
        objectStore.createIndex('link', 'link', { unique: false });
      };
    });
  },
  /* ------------------------------------
  => [GET] Get List of Forms
  ------------------------------------ */
  async getForms(userUuid: string): Promise<any> {
    const db: any = await this.getDb();
    const trans = db.transaction(['forms'], 'readonly');
    const store = trans.objectStore('forms');
    const forms: any = [];
    const editedForms: any = [];
    store.openCursor().onsuccess = (e: any) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.authorUuid === userUuid) {
          const targetForm = cursor.value;
          forms.push(targetForm);
        }
        cursor.continue();
      }
    };

    return new Promise(resolve => {
      trans.oncomplete = async () => {
        for (let currentFormIndex = 0; currentFormIndex < forms.length; currentFormIndex++) {
          const currentForm = { ...forms[currentFormIndex] };
          const rawRespondents = await RESPONDENT_ENDPOINT.getRespondentByFormId(currentForm.uuid);
          currentForm.respondentCount = rawRespondents.length;
          editedForms.push(currentForm);
        }
        resolve(editedForms);
      };
    });
  },
  /* ------------------------------------
  => [GET] Get Form by UUID
  ------------------------------------ */
  async retrieveFormById(id: string): Promise<Form> {
    // This function is a helper
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['forms'], 'readonly');
      const formStore = trans.objectStore('forms');
      const getFormRequest = formStore.openCursor();
      getFormRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.uuid === id) {
            resolve(result.value);
          }
          result.continue();
        } else {
          reject('Form tidak dapat ditemukan');
        }
      };
    });
  },
  async getFormById(id: string): Promise<Form> {
    const selectedForm = await this.retrieveFormById(id);
    const rawRespondents = await RESPONDENT_ENDPOINT.getRespondentByFormId(selectedForm.uuid);
    const respondentLength: number = rawRespondents.length;
    if (respondentLength === 0) {
      selectedForm.respondents = [];
      selectedForm.respondentCount = 0;
      return selectedForm;
    }
    const answers = rawRespondents[0].answers;
    const answerKey: string[] = [];
    Object.keys(answers).forEach((key: string) => {
      answerKey.push(key);
    });
    const processedRespondents: Respondent[] = [];
    for (let respondentIndex = 0; respondentIndex < respondentLength; respondentIndex++) {
      const processedRespondent = rawRespondents[respondentIndex];
      const processedAnswers = rawRespondents[respondentIndex].answers;
      for (let answerIndex = 0; answerIndex < answerKey.length; answerIndex++) {
        if (
          typeof rawRespondents[respondentIndex].answers[`${answerKey[answerIndex]}`] === 'object' &&
          !rawRespondents[respondentIndex].answers[`${answerKey[answerIndex]}`].length
        ) {
          processedAnswers[`${answerKey[answerIndex]}`] = await convertByteArrayToBlob(
            rawRespondents[respondentIndex].answers[`${answerKey[answerIndex]}`]
          );
        }
        processedRespondent.answers = processedAnswers;
      }
      processedRespondents.push(processedRespondent);
    }
    selectedForm.respondents = processedRespondents;
    selectedForm.respondentCount = respondentLength;
    return selectedForm;
  },
  /* ------------------------------------
  => [POST] Insert New Form
  ------------------------------------ */
  async saveForm(formData: Form): Promise<void> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['forms'], 'readwrite');
      const store = trans.objectStore('forms');
      store.put(formData);
      trans.oncomplete = () => {
        resolve();
      };
      trans.onerror = () => {
        reject('Menambahkan form gagal, mohon periksa kembali!');
      };
    });
  },
  /* ------------------------------------
  => [PUT] Edit Form
  ------------------------------------ */
  async editForm(formData: Form): Promise<Form> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['forms'], 'readwrite');
      const formStore = trans.objectStore('forms');
      const getFormRequest = formStore.openCursor();
      getFormRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.uuid === formData.uuid) {
            formStore.put(formData);
            resolve(formData);
          }
          result.continue();
        } else {
          reject('Form tidak dapat ditemukan!');
        }
      };
    });
  },
  /* ------------------------------------
  => [DELETE] Delete Form
  ------------------------------------ */
  async deleteForm(form: any): Promise<void> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['forms'], 'readwrite');
      const store = trans.objectStore('forms');
      store.delete(form.uuid);
      trans.oncomplete = () => {
        resolve();
      };
    });
  }
};
