import Store, { BoardState, Board, CardGroup, Card } from '@/@types';
import { BOARD_ENDPOINT } from '@/@api';

/* ------------------------------------------------
  => State
  ----------------------------------------------- */
const state = (): BoardState => ({
  isLoading: false,
  boards: [],
  selectedBoard: {
    id: '',
    ownerUuid: '',
    title: '',
    description: '',
    cardGroup: []
  }
});

/* ------------------------------------------------
  => Mutations
  ----------------------------------------------- */
const mutations = {
  setLoading(state: BoardState, param: boolean): void {
    state.isLoading = param;
  },
  setBoardList(state: BoardState, params: Board[]): void {
    state.boards = params;
  },
  setSelectedBoard(state: BoardState, param: Board): void {
    state.selectedBoard = param;
  },
  setCurrentCardGroup(state: BoardState, params: CardGroup[]): void {
    state.selectedBoard.cardGroup = params;
  }
};

/* ------------------------------------------------
  => Actions
  ----------------------------------------------- */
const actions: any = {
  async getBoards(store: Store<BoardState> | any): Promise<void> {
    await store.commit('setLoading', true);
    const boards = await BOARD_ENDPOINT.getBoards(store.rootState.user.currentUser.uuid);
    await store.commit('setBoardList', boards);
    await store.commit('setLoading', false);
  },
  async getBoardById(store: Store<BoardState> | any, id: string): Promise<void> {
    await store.commit('setLoading', true);
    const board = await BOARD_ENDPOINT.getBoardById(store.rootState.user.currentUser.uuid, id);
    await store.commit('setSelectedBoard', board);
    await store.commit('setLoading', false);
  },
  async addBoard(store: Store<BoardState> | any, params: Board): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.saveBoard(params)
      .then((res: any) => {
        store.dispatch('getBoards');
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Menambahkan Board',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Menambahkan Board',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async addCardGroup(store: Store<BoardState> | any, params: CardGroup): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.addCardGroup(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Menambahkan List',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Menambahkan List',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async editCardGroup(store: Store<BoardState> | any, params: CardGroup): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.editCardGroup(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Mengubah List',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Mengubah List',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async deleteCardGroup(store: Store<BoardState> | any, params: CardGroup): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.deleteCardGroup(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Menghapus List',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Menghapus List',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async addCard(store: Store<BoardState> | any, params: Card): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.addCard(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Menambahkan Kartu',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Menambahkan Kartu',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async editCard(store: Store<BoardState> | any, params: Card): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.editCard(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Mengubah Kartu',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Mengubah Kartu',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async deleteCard(store: Store<BoardState> | any, params: Card): Promise<void> {
    await store.commit('setLoading', true);
    return BOARD_ENDPOINT.deleteCard(params)
      .then((res: any) => {
        store.dispatch('getBoardById', params.boardId);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil Menghapus Kartu',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal Menghapus Kartu',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async updateCurrentCardGroup(store: Store<BoardState> | any, params: CardGroup[]): Promise<void> {
    await store.commit('setLoading', true);
    await store.commit('setCurrentCardGroup', params);
    // updateBoard;
    return BOARD_ENDPOINT.updateBoard(store.state.selectedBoard)
      .then((res: any) => {
        // store.dispatch('getBoardById', store.state.selectedBoard.id);
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal mengubah Board, mohon muat ulang halaman.',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  },
  async updateBoard(store: Store<BoardState> | any, params: Board[]): Promise<void> {
    await store.commit('setLoading', true);
    // updateBoard;
    return BOARD_ENDPOINT.updateBoard(params)
      .then((res: any) => {
        store.dispatch('getBoardById', store.state.selectedBoard.id);
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Berhasil mengubah Board.',
            color: 'green',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        return res;
      })
      .catch((err: any) => {
        store.commit(
          'ui/setSnackbar',
          {
            open: true,
            message: 'Gagal mengubah Board, mohon muat ulang halaman.',
            color: 'red',
            timeout: 4000
          },
          { root: true }
        );
        store.commit('setLoading', false);
        throw err;
      });
  }
};

export default {
  state,
  mutations,
  actions
};
