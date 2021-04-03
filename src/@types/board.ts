import { User } from '@/@types';

/* ------------------------------------
=> Store Board related types
------------------------------------ */
export interface Card {
  id: string;
  title: string;
  description: string;
  cardGroupId?: string;
}

export interface CardGroup {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  ownerUuid: string;
  title: string;
  description: string;
  cardGroup: CardGroup[];
  memberList?: User[];
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------
=> Vuex Board State
------------------------------------ */
export interface BoardState {
  isLoading: boolean;
  boards: Board[];
  selectedBoard: Board;
}
