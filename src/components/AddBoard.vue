<template>
  <v-dialog persistent v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Tambahkan Board</v-toolbar>
        <v-card-text>
          <div class="mt-4">
            <v-card-text>
              <v-form ref="addBoardForm" v-model="valid" lazy-validation class="pa-0">
                <v-layout row>
                  <v-flex xs12>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentBoard.title"
                        outlined
                        clearable
                        label="Judul Board"
                        type="text"
                        autocomplete="off"
                        class="required"
                        :rules="notEmpty('Judul Board')"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentBoard.description"
                        outlined
                        clearable
                        label="Deskripsi Board"
                        type="text"
                        autocomplete="off"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end py-4 px-6">
          <v-spacer />
          <v-btn text @click="close" class="error--text" :disabled="isLoading" :loading="isLoading">Batal</v-btn>
          <v-btn v-if="isEdit" text @click="editBoard" :disabled="isLoading" :loading="isLoading">Edit</v-btn>
          <v-btn v-else text @click="addBoard" :disabled="isLoading" :loading="isLoading">Tambahkan</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import { VForm, Board } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class DialogCard extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;
  @Prop({ required: true, type: Boolean })
  readonly isEdit!: boolean;
  @Prop({ required: true, type: Object })
  readonly selectedBoard!: Board;
  @Emit('add')
  add(item: Board): Board {
    return item;
  }
  @Emit('edit')
  edit(item: Board): Board {
    return item;
  }

  @Prop({
    required: false,
    type: Function,
    default() {
      return true;
    }
  })
  readonly closeDialog!: FunctionConstructor;

  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  descriptionProvided: boolean = false;
  imageProvided: boolean = false;
  currentBoard: Board = {
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

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  close(): void {
    const addBoardForm = this.$refs.addBoardForm as VForm;
    this.closeDialog();
    addBoardForm.reset();
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  addBoard(): void {
    const newBoardId = uuid.v1();
    const data = {
      ...this.currentBoard
    };
    data.id = newBoardId;
    data.ownerUuid = this.$store.state.user.currentUser.uuid;
    this.add(data);
  }

  editBoard(): void {
    this.edit(this.currentBoard);
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  // async mounted(): Promise<void> {
  //   await console.warn('questionTypeList', this.questionTypeList);
  // }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('dialog')
  async handleOnLoad(newValue: boolean): Promise<void> {
    if (newValue) {
      if (this.isEdit) {
        this.currentBoard = { ...this.selectedBoard };
      } else {
        const addBoardForm = this.$refs.addBoardForm as VForm;
        addBoardForm.reset();
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
// Put red colored asterisk on required class
.required >>> label::after {
  content: ' *';
  color: red;
}
</style>
