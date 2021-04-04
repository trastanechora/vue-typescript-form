<template>
  <v-dialog persistent v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Tambahkan Kartu</v-toolbar>
        <v-card-text>
          <div class="mt-4">
            <v-card-text>
              <v-form ref="addCardForm" v-model="valid" lazy-validation class="pa-0">
                <v-layout row>
                  <v-flex xs12>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentCard.title"
                        outlined
                        clearable
                        label="Judul Kartu"
                        type="text"
                        autocomplete="off"
                        class="required"
                        :rules="notEmpty('Judul Kartu')"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentCard.description"
                        outlined
                        clearable
                        label="Deskripsi Kartu"
                        type="text"
                        autocomplete="off"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                    <!-- <v-select
                      v-model="currentCard.type"
                      outlined
                      clearable
                      :items="cardTypeList"
                      item-text="label"
                      item-value="value"
                      label="Tipe Pertanyaan"
                      class="required"
                      :rules="notEmpty('Tipe Pertanyaan')"
                      :disabled="isLoading"
                      return-object
                      :loading="isLoading"
                    ></v-select> -->
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end py-4 px-6">
          <v-spacer />
          <v-btn text @click="close" class="error--text" :disabled="isLoading" :loading="isLoading">Batal</v-btn>
          <v-btn v-if="isEdit" text @click="editCard" :disabled="isLoading" :loading="isLoading">Edit</v-btn>
          <v-btn v-else text @click="addCard" :disabled="isLoading" :loading="isLoading">Tambahkan</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import { VForm, Card } from '@/@types';
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
  readonly selectedCard!: Card;
  @Emit('add')
  add(item: Card): Card {
    return item;
  }
  @Emit('edit')
  edit(item: Card): Card {
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
  currentCard: Card = {
    id: '',
    title: '',
    description: ''
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
    const addCardForm = this.$refs.addCardForm as VForm;
    this.closeDialog();
    addCardForm.reset();
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  addCard(): void {
    const newCardId = uuid.v1();
    const data = {
      ...this.currentCard
    };
    data.id = newCardId;
    this.add(data);
  }

  editCard(): void {
    console.warn('edit card');
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
        this.currentCard = { ...this.selectedCard };
      }
    } else {
      const addCardForm = this.$refs.addCardForm as VForm;
      addCardForm.reset();
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
