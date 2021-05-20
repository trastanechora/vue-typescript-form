// import { uuid } from 'vue-uuid';
import { convertBlobToByteArray } from '../@utils';

const DB_NAME = 'respondentdb';
const DB_VERSION = 1;
let DB: any;

// import { Form } from '@/@types';

export const RESPONDENT_ENDPOINT: any = {
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
        const objectStore = db.createObjectStore('respondents', { keyPath: 'uuid' });
        objectStore.createIndex('formId', 'formId', { unique: false });
        objectStore.createIndex('response', 'response', { unique: false });
        objectStore.createIndex('submitDate', 'submitDate', { unique: false });
      };
    });
  },
  /* ------------------------------------
  => [GET] Get Respondent List by Form UUID
  ------------------------------------ */
  async getRespondentByFormId(formId: string): Promise<any> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['respondents'], 'readonly');
      const store = trans.objectStore('respondents');
      const respondents: any = [];
      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.formId === formId) {
            respondents.push(cursor.value);
          }
          cursor.continue();
        }
      };
      trans.oncomplete = () => {
        resolve(respondents);
      };
    });
  },
  /* ------------------------------------
  => [POST] Insert New Respondent
  ------------------------------------ */
  async saveRespondent(respondent: any): Promise<void> {
    const db: any = await this.getDb();
    const processedRespondent = { ...respondent };
    const keys: string[] = [];
    Object.keys(respondent.answers).forEach(async (key: string) => {
      keys.push(key);
    });
    for (let index = 0; index < keys.length; index++) {
      if (typeof respondent.answers[keys[index]] === 'object' && !respondent.answers[keys[index]].length) {
        processedRespondent.answers[keys[index]] = await convertBlobToByteArray(respondent.answers[keys[index]]);
      } else {
        processedRespondent.answers[keys[index]] = respondent.answers[keys[index]];
      }
    }
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['respondents'], 'readwrite');
      const store = trans.objectStore('respondents');
      store.put(processedRespondent);
      trans.oncomplete = () => {
        resolve();
      };
      trans.onerror = () => {
        reject('Gagal menyimpan jawaban, mohon periksa kembali!');
      };
    });
  }
};
