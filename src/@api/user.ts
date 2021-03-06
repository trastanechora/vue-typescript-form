const DB_NAME = 'userdb';
const DB_VERSION = 1;
let DB: any;

export const USER_ENDPOINT: any = {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      console.log('OPENING DB', DB);
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = e => {
        console.log('Error opening db', e);
        reject('Error');
      };

      request.onsuccess = (e: any) => {
        DB = e.target.result;
        resolve(DB);
      };

      request.onupgradeneeded = (e: any) => {
        console.log('onupgradeneeded');
        const db: any = e.target.result;
        db.createObjectStore('users', { autoIncrement: true, keyPath: 'id' });
      };
    });
  },
  async deleteUser(user: any): Promise<void> {
    const db: any = await this.getDb();

    return new Promise(resolve => {
      const trans = db.transaction(['users'], 'readwrite');
      trans.oncomplete = () => {
        resolve();
      };

      const store = trans.objectStore('users');
      store.delete(user.id);
    });
  },
  async getUsers(): Promise<void> {
    const db: any = await this.getDb();

    return new Promise(resolve => {
      const trans = db.transaction(['users'], 'readonly');

      const store = trans.objectStore('users');
      console.warn('USER_ENDPOINT | store', store);
      const users: any = [];

      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          users.push(cursor.value);
          cursor.continue();
        }
      };

      console.warn('USER_ENDPOINT | users', users);
      trans.oncomplete = () => {
        resolve(users);
      };
    });
  },

  async saveUser(user: any): Promise<void> {
    const db: any = await this.getDb();

    return new Promise(resolve => {
      const trans = db.transaction(['users'], 'readwrite');
      trans.oncomplete = () => {
        resolve();
      };

      const store = trans.objectStore('users');
      store.put(user);
    });
  }
};
