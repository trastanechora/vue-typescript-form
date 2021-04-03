const DB_NAME = 'boarddb';
const DB_VERSION = 1;
let DB: any;

import { Board } from '@/@types';

export const BOARD_ENDPOINT: any = {
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
        const objectStore = db.createObjectStore('boards', { keyPath: 'id' });
        objectStore.createIndex('title', 'title', { unique: false });
        objectStore.createIndex('description', 'description', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        objectStore.createIndex('cardGroup', 'cardGroup', { unique: false });
        objectStore.createIndex('memberList', 'memberList', { unique: false });
      };
    });
  },
  /* ------------------------------------
  => [GET] Get List of Boards
  ------------------------------------ */
  async getBoards(userUuid: string): Promise<any> {
    console.warn('Getting Boards');
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['boards'], 'readonly');
      const store = trans.objectStore('boards');
      const boards: any = [];
      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          console.warn('cursor.value.ownerUuid', cursor.value.ownerUuid);
          if (cursor.value.ownerUuid === userUuid) {
            boards.push(cursor.value);
          }
          cursor.continue();
        }
      };
      trans.oncomplete = () => {
        resolve(boards);
      };
    });
  },
  /* ------------------------------------
  => [GET] Get Board by ID
  ------------------------------------ */
  async getBoardById(id: string): Promise<Board> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readonly');
      const formStore = trans.objectStore('boards');
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
  => [POST] Insert New Board
  ------------------------------------ */
  async saveBoard(boardData: Board): Promise<void> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readwrite');
      const store = trans.objectStore('boards');
      store.put(boardData);
      trans.oncomplete = () => {
        resolve();
      };
      trans.onerror = () => {
        reject('Menambahkan board gagal, mohon periksa kembali!');
      };
    });
  },
  /* ------------------------------------
  => [DELETE] Delete Board
  ------------------------------------ */
  async deleteBoard(board: any): Promise<void> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['boards'], 'readwrite');
      const store = trans.objectStore('boards');
      store.delete(board.uuid);
      trans.oncomplete = () => {
        resolve();
      };
    });
  }
};
