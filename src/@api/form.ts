// import { uuid } from 'vue-uuid';
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
        console.log('Error opening DB!', e);
        reject('Error');
      };
      request.onsuccess = (e: any) => {
        DB = e.target.result;
        resolve(DB);
      };
      request.onupgradeneeded = (e: any) => {
        console.log('DB Upgrade success!');
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
  async getForms(): Promise<any> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['forms'], 'readonly');
      const store = trans.objectStore('forms');
      const forms: any = [];
      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          forms.push(cursor.value);
          cursor.continue();
        }
      };
      trans.oncomplete = () => {
        resolve(forms);
      };
    });
  },
  /* ------------------------------------
  => [GET] Get Form by UUID
  ------------------------------------ */
  async getFormById(id: string): Promise<Form> {
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
  => [PUT] Edit Form and Submit Response
  ------------------------------------ */
  async editForm(formData: Form): Promise<Form> {
    console.warn('formData', formData);
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['forms'], 'readwrite');
      const formStore = trans.objectStore('forms');
      const getFormRequest = formStore.openCursor();
      getFormRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.uuid === formData.uuid) {
            console.warn('result', result.value);
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
