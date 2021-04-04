const DB_NAME = 'boarddb';
const DB_VERSION = 1;
let DB: any;

import { Board, CardGroup, Card } from '@/@types';

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
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['boards'], 'readonly');
      const store = trans.objectStore('boards');
      const boards: any = [];
      store.openCursor().onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
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
  async getBoardById(userUuid: string, id: string): Promise<Board> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readonly');
      const boardStore = trans.objectStore('boards');
      const getBoardRequest = boardStore.openCursor();
      getBoardRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.id === id) {
            if (result.value.ownerUuid === userUuid) {
              resolve(result.value);
            }
          }
          result.continue();
        } else {
          reject('Board tidak dapat ditemukan');
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
  async deleteBoard(board: Board): Promise<void> {
    const db: any = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction(['boards'], 'readwrite');
      const store = trans.objectStore('boards');
      store.delete(board.id);
      trans.oncomplete = () => {
        resolve();
      };
    });
  },
  /* ------------------------------------
  => [POST] Insert New CardGroup
  ------------------------------------ */
  async addCardGroup(cardGroup: CardGroup): Promise<Board> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readwrite');
      const boardStore = trans.objectStore('boards');
      const getBoardRequest = boardStore.openCursor();
      getBoardRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.id === cardGroup.boardId) {
            const editedBoard = { ...result.value };
            editedBoard.cardGroup.push(cardGroup);
            boardStore.put(editedBoard);
            console.warn('[API] Edited Board:', editedBoard);
            resolve(editedBoard);
          }
          result.continue();
        } else {
          reject('Board tidak dapat ditemukan');
        }
      };
    });
  },
  /* ------------------------------------
  => [POST] Insert New Card
  ------------------------------------ */
  async addCard(card: Card): Promise<Board> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readwrite');
      const boardStore = trans.objectStore('boards');
      const getBoardRequest = boardStore.openCursor();
      getBoardRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.id === card.boardId) {
            const editedBoard = result.value;
            editedBoard.cardGroup = result.value.cardGroup.map((cardGroup: CardGroup) => {
              if (cardGroup.id === card.cardGroupId) {
                const newCardGroup = cardGroup;
                newCardGroup.cards.push(card);
                return newCardGroup;
              } else {
                return cardGroup;
              }
            });
            boardStore.put(editedBoard);
            resolve(editedBoard);
          }
          result.continue();
        } else {
          reject('Board tidak dapat ditemukan');
        }
      };
    });
  },
  /* ------------------------------------
  => [PUT] Edit Card
  ------------------------------------ */
  async editCard(card: Card): Promise<Board> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readwrite');
      const boardStore = trans.objectStore('boards');
      const getBoardRequest = boardStore.openCursor();
      getBoardRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.id === card.boardId) {
            const editedBoard = result.value;
            editedBoard.cardGroup = result.value.cardGroup.map((cardGroup: CardGroup) => {
              if (cardGroup.id === card.cardGroupId) {
                const newCardGroup = cardGroup;
                newCardGroup.cards = cardGroup.cards.map((currentCard: Card) => {
                  if (currentCard.id === card.id) {
                    return card;
                  } else {
                    return currentCard;
                  }
                });
                return newCardGroup;
              } else {
                return cardGroup;
              }
            });
            boardStore.put(editedBoard);
            resolve(editedBoard);
          }
          result.continue();
        } else {
          reject('Board tidak dapat ditemukan');
        }
      };
    });
  },
  /* ------------------------------------
  => [DELETE] Delete Card
  ------------------------------------ */
  async deleteCard(card: Card): Promise<void> {
    const db: any = await this.getDb();
    return new Promise((resolve, reject) => {
      const trans = db.transaction(['boards'], 'readwrite');
      const boardStore = trans.objectStore('boards');
      const getBoardRequest = boardStore.openCursor();
      getBoardRequest.onsuccess = (e: any) => {
        const result = e.target.result;
        if (result) {
          if (result.value.id === card.boardId) {
            const editedBoard = result.value;
            editedBoard.cardGroup = result.value.cardGroup.map((cardGroup: CardGroup) => {
              if (cardGroup.id === card.cardGroupId) {
                const newCardGroup = cardGroup;
                newCardGroup.cards = cardGroup.cards.reduce(function(result: Card[], currentCard: Card) {
                  if (currentCard.id !== card.id) {
                    result.push(currentCard);
                  }
                  return result;
                }, []);
                return newCardGroup;
              } else {
                return cardGroup;
              }
            });
            boardStore.put(editedBoard);
            resolve(editedBoard);
          }
          result.continue();
        } else {
          reject('Board tidak dapat ditemukan');
        }
      };
    });
  }
};
