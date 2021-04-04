import { uuid } from 'vue-uuid';
const DB_NAME = 'userdb';
const DB_VERSION = 1;
let DB: any;

import { RegisterUserData, User, AuthData } from '@/@types';

export const USER_ENDPOINT: any = {
  /* ------------------------------------
  => Check IndexedDB
  ------------------------------------ */
  async getDb() {
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
        const objectStore = db.createObjectStore('users', { keyPath: 'uuid' });
        objectStore.createIndex('username', 'username', { unique: true });
        objectStore.createIndex('password', 'password', { unique: false });
        objectStore.createIndex('role', 'role', { unique: false });
        objectStore.createIndex('displayName', 'displayName', { unique: false });
        objectStore.createIndex('imgUrl', 'imgUrl', { unique: false });
      };
    });
  },
  /* ------------------------------------
  => [DELETE] Delete User
  ------------------------------------ */
  async deleteUser(user: any): Promise<void> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['users'], 'readwrite');
      const store = trans.objectStore('users');
      store.delete(user.uuid);
      trans.oncomplete = () => {
        resolve();
      };
    });
  },
  /* ------------------------------------
  => [GET] Get List of Users
  ------------------------------------ */
  async getUsers(): Promise<void> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['users'], 'readonly');
      const store = trans.objectStore('users');
      const users: any = [];
      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          users.push(cursor.value);
          cursor.continue();
        }
      };
      trans.oncomplete = () => {
        resolve(users);
      };
    });
  },
  /* ------------------------------------
  => [POST] Register New User
  ------------------------------------ */
  async saveUser(userdata: RegisterUserData): Promise<void> {
    const db: any = await this.getDb();
    const parsedUserData = {
      ...userdata,
      uuid: uuid.v1(),
      role: userdata.username[0] === '$' ? 'admin' : 'user',
      voteGiven: false,
      voteValue: 'N/A',
      imgUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 1}/200`
    };
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['users'], 'readwrite');
      const store = trans.objectStore('users');
      store.put(parsedUserData);
      trans.oncomplete = () => {
        resolve();
      };
      trans.onerror = () => {
        reject('username already exist!');
      };
    });
  },
  /* ------------------------------------
  => [PUT] Edit User
  ------------------------------------ */
  async editUser(user: User): Promise<User> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['users'], 'readwrite');
      const userStore = trans.objectStore('users');
      const getUserRequest = userStore.openCursor();
      getUserRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.username === user.username) {
            userStore.put(user);
            resolve(user);
          }
          result.continue();
        } else {
          reject('Password atau Username salah!');
        }
      };
    });
  },
  /* ------------------------------------
  => [POST] Login User
  ------------------------------------ */
  async loginUser(params: AuthData): Promise<User> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['users'], 'readonly');
      const userStore = trans.objectStore('users');
      const getUserRequest = userStore.openCursor();
      getUserRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.username === params.username && result.value.password === params.password) {
            resolve(result.value);
          }
          result.continue();
        } else {
          reject('Password atau Username salah!');
        }
      };
    });
  }
};
