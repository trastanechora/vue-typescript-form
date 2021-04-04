<template>
  <v-layout wrap class="full-width">
    <v-flex xs3 class="mb-4">
      <v-card height="400" width="256" class="mx-auto custom-sidebar" flat>
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Board
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              @click="changeWindow(item.value)"
              :disabled="item.disabled"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-flex>
    <v-flex xs9>
      <v-window v-model="window" vertical class="pa-4 pr-10">
        <v-window-item :value="1">
          PROJECT LIST
        </v-window-item>
        <v-window-item :value="2">
          <v-card flat>
            <v-card-text>
              <v-row class="mb-4" align="center">
                <strong class="title">Daftar Board</strong>
                <v-spacer></v-spacer>
                <v-btn rounded color="primary" outlined @click="openAddBoardDialog">
                  <v-icon left>mdi-plus</v-icon>Tambah Board
                </v-btn>
              </v-row>

              <v-item-group>
                <v-container>
                  <v-row>
                    <v-col v-for="board in boardList" :key="board.id" cols="12" md="4">
                      <v-hover>
                        <template v-slot:default="{ hover }">
                          <v-card class="mx-auto" max-width="344">
                            <v-img src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"></v-img>

                            <v-card-text>
                              <h2 class="title primary--text">
                                {{ board.title }}
                              </h2>
                              <p>
                                {{ board.description }}
                              </p>
                            </v-card-text>

                            <v-fade-transition>
                              <v-overlay v-if="hover" absolute color="primary">
                                <v-btn color="primary" rounded @click="goToBoard(board.id)">Buka</v-btn>
                              </v-overlay>
                            </v-fade-transition>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item :value="3">
          SETTING
        </v-window-item>
      </v-window>
    </v-flex>
    <AddBoard
      :dialog="addBoardDialog"
      :is-edit="addBoardEditState"
      :close-dialog="closeAddBoardDialog"
      :selected-board="selecetdBoard"
      @add="addBoard"
      @edit="editBoard"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddBoard from '@/components/AddBoard.vue';
import { Board } from '@/@types';
// import { dateFormatter, statusFormatter } from '@/@utils';/

@Component({
  components: {
    AddBoard
  }
})
export default class ProjectPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  addBoardDialog: boolean = false;
  addBoardEditState: boolean = false;
  length: number = 3;
  window: number = 2;
  items: any = [
    { title: 'Projects', icon: 'mdi-sitemap', value: 1, disabled: true },
    { title: 'Boards', icon: 'mdi-view-dashboard', value: 2, disabled: false },
    { title: 'Setting', icon: 'mdi-cog', value: 3, disabled: true }
  ];
  selecetdBoard: Board = {
    id: '',
    ownerUuid: '',
    title: '',
    description: '',
    cardGroup: []
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.board.isLoading;
  }

  get boardList(): boolean {
    return this.$store.state.board.boards;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  mounted(): void {
    this.$store.dispatch('board/getBoards');
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  changeWindow(id: number): void {
    console.warn('Displaying detail');
    this.window = id;
  }
  goToBoard(id: string): void {
    this.$router.push(`/dashboard/board/${id}`);
  }
  openAddBoardDialog(): void {
    this.addBoardEditState = false;
    this.addBoardDialog = true;
  }
  addBoard(boardData: Board): void {
    this.$store.dispatch('board/addBoard', boardData).then(() => {
      this.closeAddBoardDialog();
    });
  }
  editBoard(boardData: Board): void {
    console.warn('Edit Board', boardData);
    // this.$store.dispatch('board/addBoard', boardData);
  }
  closeAddBoardDialog(): void {
    this.addBoardDialog = false;
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
.custom-sidebar {
  position: sticky;
  top: 10px;
}
</style>
