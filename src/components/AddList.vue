<template>
  <v-dialog persistent v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Tambahkan List</v-toolbar>
        <v-card-text>
          <div class="mt-4">
            <v-card-text>
              <v-form ref="addCardGroupForm" v-model="valid" lazy-validation class="pa-0">
                <v-layout row>
                  <v-flex xs12>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentCardGroup.title"
                        outlined
                        clearable
                        label="Judul List"
                        type="text"
                        autocomplete="off"
                        class="required"
                        :rules="notEmpty('Judul List')"
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
          <v-btn v-if="isEdit" text @click="editCardGroup" :disabled="isLoading" :loading="isLoading">Edit</v-btn>
          <v-btn v-else text @click="addCardGroup" :disabled="isLoading" :loading="isLoading">Tambahkan</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import { VForm, CardGroup } from '@/@types';
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
  readonly selectedCardGroup!: CardGroup;
  @Emit('add')
  add(item: CardGroup): CardGroup {
    return item;
  }
  @Emit('edit')
  edit(item: CardGroup): CardGroup {
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
  currentCardGroup: CardGroup = {
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

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  close(): void {
    const addCardGroupForm = this.$refs.addCardGroupForm as VForm;
    this.closeDialog();
    addCardGroupForm.reset();
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  addCardGroup(): void {
    const newCardGroupId = uuid.v1();
    const data = {
      ...this.currentCardGroup
    };
    data.id = newCardGroupId;
    this.add(data);
  }

  editCardGroup(): void {
    console.warn('edit board');
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
        this.currentCardGroup = { ...this.selectedCardGroup };
      } else {
        const addCardGroupForm = this.$refs.addCardGroupForm as VForm;
        addCardGroupForm.reset();
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
