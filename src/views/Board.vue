<template>
  <v-layout id="board" wrap>
    <v-flex xs12>
      <v-card flat>
        <v-toolbar class="elevation-0" dense>
          <v-toolbar-title>{{ boardTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-star</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-flex>
    <v-flex xs12 class="board-container mt-2">
      <draggable
        v-model="cardGroup"
        group="cardGroup"
        tag="div"
        class="full-height no-wrap"
        draggable=".item"
        ghost-class="ghost"
      >
        <div v-for="list in cardGroup" :key="list.id" class="list-container item pb-16">
          <v-card class="ma-0 px-2 py-3" color="tone" flat>
            <v-flex xs12 class="px-1 mb-2">
              <v-menu top left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item @click="openEditCardGroupDialog(list)">
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Ubah</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="deleteCardGroup(list)">
                    <v-list-item-icon>
                      <v-icon>mdi-trash-can</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Hapus</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              <strong>{{ list.title }}</strong>
            </v-flex>
            <v-flex xs12>
              <draggable v-model="list.cards" group="cards" tag="div" draggable=".cardItem" ghost-class="ghost">
                <v-card v-for="card in list.cards" :key="card.id" class="mb-2 cardItem">
                  <v-card-title class="pb-2 custom-card-tittle">
                    {{ card.title }}
                    <v-spacer />
                    <v-menu bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list dense>
                        <v-list-item @click="openEditCardDialog(card, list.id)">
                          <v-list-item-icon>
                            <v-icon>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Ubah</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="deleteCard(card, list.id)">
                          <v-list-item-icon>
                            <v-icon>mdi-trash-can</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Hapus</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-title>
                  <!-- <v-card-actions class="pt-0">
                    <v-btn text>
                      Edit
                    </v-btn>
                  </v-card-actions> -->
                </v-card>
              </draggable>
            </v-flex>
            <v-flex xs12 class="mt-1"
              ><v-btn block depressed text @click="openAddCardDialog(list.id)"
                ><v-icon small>mdi-plus</v-icon>Tambahkan Kartu</v-btn
              ></v-flex
            >
          </v-card>
        </div>
        <div class="list-container">
          <v-btn block depressed @click="openAddCardGroupDialog()"><v-icon small>mdi-plus</v-icon>Tambahkan List</v-btn>
        </div>
      </draggable>
    </v-flex>
    <AddCard
      :dialog="cardDialog"
      :is-edit="cardEditState"
      :close-dialog="closeAddCardDialog"
      :selected-card="selectedCard"
      @add="addCard"
      @edit="editCard"
    />
    <AddList
      :dialog="cardGroupDialog"
      :is-edit="cardGroupEditState"
      :close-dialog="closeAddCardGroupDialog"
      :selected-card-group="selectedCardGroup"
      @add="addCardGroup"
      @edit="editCardGroup"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CardGroup, Card } from '@/@types';
import draggable from 'vuedraggable';
import AddCard from '@/components/AddCard.vue';
import AddList from '@/components/AddList.vue';

@Component({
  components: {
    draggable,
    AddCard,
    AddList
  }
})
export default class ProjectPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  cardDialog: boolean = false;
  cardEditState: boolean = false;
  cardGroupTarget: string = '';
  cardGroupDialog: boolean = false;
  cardGroupEditState: boolean = false;
  selectedCard: Card = {
    id: '',
    title: '',
    description: ''
  };
  selectedCardGroup: CardGroup = {
    id: '',
    title: '',
    cards: []
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.board.isLoading;
  }

  get boardTitle(): string {
    return this.$store.state.board.selectedBoard.title;
  }

  get cardGroup(): CardGroup {
    return this.$store.state.board.selectedBoard.cardGroup;
  }

  set cardGroup(newCardGroup: CardGroup) {
    this.$store.dispatch('board/updateCurrentCardGroup', newCardGroup);
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  mounted(): void {
    this.$store.dispatch('board/getBoardById', this.$route.params.id);
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  openAddCardDialog(cardGroupId: string): void {
    this.cardEditState = false;
    this.cardDialog = true;
    this.cardGroupTarget = cardGroupId;
  }

  addCard(card: Card): void {
    this.$store
      .dispatch('board/addCard', {
        ...card,
        cardGroupId: this.cardGroupTarget,
        boardId: this.$route.params.id
      })
      .then(() => {
        this.closeAddCardDialog();
      });
  }

  openEditCardDialog(card: Card, cardGroupId: string): void {
    this.selectedCard = card;
    this.cardEditState = true;
    this.cardDialog = true;
    this.cardGroupTarget = cardGroupId;
  }

  editCard(card: Card): void {
    this.$store
      .dispatch('board/editCard', {
        ...card,
        cardGroupId: this.cardGroupTarget,
        boardId: this.$route.params.id
      })
      .then(() => {
        this.closeAddCardDialog();
      });
  }

  deleteCard(card: Card, cardGroupTarget: string): void {
    this.$store.dispatch('board/deleteCard', {
      ...card,
      cardGroupId: cardGroupTarget,
      boardId: this.$route.params.id
    });
  }

  closeAddCardDialog(): void {
    this.cardDialog = false;
  }

  openAddCardGroupDialog(): void {
    this.cardGroupEditState = false;
    this.cardGroupDialog = true;
  }

  addCardGroup(cardGroup: CardGroup): void {
    this.$store
      .dispatch('board/addCardGroup', { ...cardGroup, boardId: this.$store.state.board.selectedBoard.id })
      .then(() => {
        this.closeAddCardGroupDialog();
      });
  }

  openEditCardGroupDialog(cardGroup: CardGroup): void {
    this.selectedCardGroup = cardGroup;
    this.cardGroupEditState = true;
    this.cardGroupDialog = true;
  }

  editCardGroup(cardGroup: CardGroup): void {
    console.warn('edited cardGroup', cardGroup);
    this.$store
      .dispatch('board/editCardGroup', { ...cardGroup, boardId: this.$store.state.board.selectedBoard.id })
      .then(() => {
        this.closeAddCardGroupDialog();
      });
  }

  deleteCardGroup(cardGroup: CardGroup): void {
    this.$store
      .dispatch('board/deleteCardGroup', { ...cardGroup, boardId: this.$store.state.board.selectedBoard.id })
      .then(() => {
        this.closeAddCardGroupDialog();
      });
  }

  closeAddCardGroupDialog(): void {
    this.cardGroupDialog = false;
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('cardGroup', { deep: true })
  handleCardGroup(newValue: CardGroup): void {
    this.$store.dispatch('board/updateCurrentCardGroup', newValue);
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
  font-weight: 400;
}
.full-height {
  height: 100%;
}
.no-wrap {
  white-space: nowrap;
  overflow-x: scroll;
}
#board {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
}
.board-container {
  height: 100%;
}
.list-container:first-child {
  margin-left: 8px;
}
.list-container {
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  overflow-y: auto;
}
.list {
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
}
.headline {
  font-size: 1rem!important;
}
.ghost {
  opacity: 0.2;
  background: var(--v-primary-base);
}
.list-background {
  background-color: var(--v-primary-base);
}
.custom-card-tittle {
  font-size: 16px;
  border-top: inset;
  border-width: thick;
  border-color: currentColor;
}
</style>
