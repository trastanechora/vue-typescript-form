<template>
  <v-dialog persistent v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Tambahkan Pertanyaan</v-toolbar>
        <v-card-text>
          <div class="mt-4">
            <v-card-text>
              <v-form ref="addQuestionForm" v-model="valid" lazy-validation class="pa-0">
                <v-layout row>
                  <v-flex xs12 class="mb-2 text-end">
                    <v-btn
                      v-if="!descriptionProvided"
                      text
                      small
                      color="secondary"
                      @click="addDescription"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2"
                      ><v-icon small>mdi-plus</v-icon>Beri Deskripsi</v-btn
                    >
                    <v-btn
                      v-else
                      text
                      small
                      color="secondary"
                      @click="removeDescription"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2"
                      ><v-icon small>mdi-minus</v-icon>Hapus Deskripsi</v-btn
                    >
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      v-model="currentQuestion.type"
                      outlined
                      clearable
                      :items="questionTypeList"
                      item-text="label"
                      item-value="value"
                      label="Tipe Pertanyaan"
                      class="required"
                      :rules="notEmpty('Tipe Pertanyaan')"
                      :disabled="isLoading"
                      return-object
                      :loading="isLoading"
                    ></v-select>
                    <v-flex xs12>
                      <v-text-field
                        v-model="currentQuestion.text"
                        outlined
                        clearable
                        label="Pertanyaan"
                        type="text"
                        autocomplete="off"
                        class="required"
                        :rules="notEmpty('Pertanyaan')"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                    <v-flex v-if="descriptionProvided" xs12>
                      <v-text-field
                        v-model="currentQuestion.description"
                        filled
                        clearable
                        label="Deskripsi"
                        type="text"
                        autocomplete="off"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-form>
              <v-form
                v-if="currentQuestion.type.value === 'radio' || currentQuestion.type.value === 'checkbox'"
                ref="radioForm"
                v-model="valid"
                lazy-validation
                class="pa-0"
              >
                <v-layout row>
                  <v-flex xs12>
                    <hr class="my-6" />
                    <v-layout wrap>
                      <v-flex v-for="(option, index) in currentQuestion.options" :key="index" xs12>
                        <v-row no-gutters>
                          <v-col cols="10">
                            <v-text-field
                              v-model="option.text"
                              filled
                              clearable
                              :label="`Pilihan ${index + 1}`"
                              type="text"
                              autocomplete="off"
                              class="required"
                              :rules="notEmpty(`Pilihan ${index + 1}`)"
                              :disabled="isLoading"
                              :loading="isLoading"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2" class="my-2 px-1"
                            ><v-btn color="primary" text @click="deleteOption(option)">
                              <v-icon left>mdi-delete</v-icon> Hapus
                            </v-btn></v-col
                          >
                        </v-row>
                      </v-flex>
                      <v-flex xs12>
                        <v-btn
                          text
                          small
                          color="secondary"
                          @click="addOption"
                          :disabled="isLoading"
                          :loading="isLoading"
                          class="ml-2"
                          ><v-icon small>mdi-plus</v-icon>Tambah Pilihan</v-btn
                        >
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end py-4 px-6">
          <v-switch v-model="currentQuestion.required" label="Harus diisi" />
          <v-spacer />
          <v-btn text @click="close" class="error--text" :disabled="isLoading" :loading="isLoading">Batal</v-btn>
          <v-btn v-if="isEdit" text @click="editQuestion" :disabled="isLoading" :loading="isLoading">Edit</v-btn>
          <v-btn v-else text @click="addQuestion" :disabled="isLoading" :loading="isLoading">Tambahkan</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { VForm, Question, QuestionType, QuestionTypeObject, Option } from '@/@types';
import { notEmptyRules } from '@/@utils';
@Component
export default class DialogQuestion extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;
  @Prop({ required: true, type: Boolean })
  readonly isEdit!: boolean;
  @Prop({ required: true, type: String })
  readonly questionKey!: string;
  @Prop({ required: true, type: Object })
  readonly selectedQuestion!: Question;
  @Emit('add')
  add(item: Question): Question {
    return item;
  }
  @Emit('edit')
  edit(item: Question): Question {
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
  currentQuestion: Question = {
    key: '',
    type: {
      label: '',
      value: QuestionType.EMPTY
    },
    required: false,
    text: '',
    description: '',
    options: [
      {
        text: '',
        value: ''
      }
    ]
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  get questionTypeList(): QuestionTypeObject[] {
    return this.$store.state.form.questionTypeList;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  close(): void {
    const addQuestionForm = this.$refs.addQuestionForm as VForm;
    this.closeDialog();
    addQuestionForm.reset();
  }
  addQuestion(): void {
    const addQuestionForm = this.$refs.addQuestionForm as VForm;
    if (addQuestionForm.validate()) {
      const data: Question = {
        key: this.questionKey,
        required: this.currentQuestion.required,
        type: this.currentQuestion.type,
        text: this.currentQuestion.text,
        options: this.currentQuestion.options
      };
      if (this.descriptionProvided) {
        data.description = this.currentQuestion.description;
      }
      this.add(data);
      this.closeDialog();
      addQuestionForm.reset();
    }
  }
  editQuestion(): void {
    const addQuestionForm = this.$refs.addQuestionForm as VForm;
    if (addQuestionForm.validate()) {
      const data: Question = {
        key: this.currentQuestion.key,
        required: this.currentQuestion.required,
        type: this.currentQuestion.type,
        text: this.currentQuestion.text,
        options: this.currentQuestion.options
      };
      if (this.descriptionProvided) {
        data.description = this.currentQuestion.description;
      }
      this.edit(data);
      this.closeDialog();
      addQuestionForm.reset();
    }
  }
  addDescription() {
    this.descriptionProvided = true;
  }
  removeDescription() {
    this.descriptionProvided = false;
  }
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
  addOption(): void {
    this.currentQuestion.options!.push({
      text: '',
      value: ''
    });
  }
  deleteOption(selectedOption: Option): void {
    const newOptionList = this.currentQuestion.options!.reduce(function(result: Option[], option: Option) {
      if (selectedOption.text !== option.text) {
        result.push(option);
      }
      return result;
    }, []);
    this.currentQuestion.options = newOptionList;
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
        this.currentQuestion = { ...this.selectedQuestion };
      } else {
        this.currentQuestion.required = false;
      }
    } else {
      this.currentQuestion.type = {
        label: '',
        value: QuestionType.EMPTY
      };
      this.currentQuestion.options = [
        {
          text: '',
          value: ''
        }
      ];
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
