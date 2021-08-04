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
                    <v-btn
                      v-if="!imageProvided"
                      text
                      small
                      color="secondary"
                      @click="addImage"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2"
                      ><v-icon small>mdi-plus</v-icon>Beri Gambar</v-btn
                    >
                    <v-btn
                      v-else
                      text
                      small
                      color="secondary"
                      @click="removeImage"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2"
                      ><v-icon small>mdi-minus</v-icon>Hapus Gambar</v-btn
                    >
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      v-model="currentQuestion.type"
                      outlined
                      :items="questionTypeList"
                      item-text="label"
                      item-value="value"
                      label="Tipe Pertanyaan"
                      class="required"
                      :rules="notEmptySelect('Tipe Pertanyaan')"
                      :disabled="isLoading"
                      return-object
                      :loading="isLoading"
                    >
                      <template v-slot:[`item`]="{ item }">
                        <v-icon small left>{{ item.icon }}</v-icon> {{ item.label }}
                      </template>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 v-if="currentQuestion.type.label === 'Jawaban Singkat'">
                    <v-select
                      v-model="currentQuestion.validation"
                      outlined
                      :items="textfieldType"
                      item-text="text"
                      item-value="value"
                      label="Validasi Pertanyaan"
                      :disabled="isLoading"
                      return-object
                      :loading="isLoading"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 v-if="currentQuestion.type.label === 'File'">
                    <v-select
                      v-model="currentQuestion.validation"
                      outlined
                      :items="fileType"
                      item-text="text"
                      item-value="value"
                      label="Jenis File"
                      :disabled="isLoading"
                      return-object
                      :loading="isLoading"
                    ></v-select>
                  </v-flex>
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
                  <v-flex v-if="imageProvided" xs12>
                    <v-file-input
                      v-if="!currentQuestion.image"
                      accept="image/*"
                      label="Gambar"
                      :disabled="isLoading"
                      :loading="isLoading"
                      @change="saveImage"
                    ></v-file-input>
                    <div v-else>
                      <v-btn text small color="secondary" disabled>Pratinjau gambar:</v-btn>
                      <v-img :src="currentQuestion.image" max-width="300" max-height="200" class="ml-3"></v-img>
                    </div>
                  </v-flex>
                </v-layout>
              </v-form>
              <v-form
                v-if="
                  currentQuestion.type.value === 'radio' ||
                    currentQuestion.type.value === 'checkbox' ||
                    currentQuestion.type.value === 'select'
                "
                ref="radioCheckboxForm"
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
              <v-form
                v-if="currentQuestion.type.value === 'scale'"
                ref="radioRowForm"
                v-model="valid"
                lazy-validation
                class="pa-0"
              >
                <v-layout row>
                  <v-flex xs12>
                    <hr class="my-6" />
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-select
                              v-model="currentQuestion.options[0]"
                              filled
                              :items="scaleOptions"
                              item-text="text"
                              item-value="value"
                              label="Jumlah skala"
                              class="required"
                              :rules="notEmpty('Jumlah skala')"
                              return-object
                              :disabled="isLoading"
                              :loading="isLoading"
                            />
                          </v-col>
                        </v-row>
                      </v-flex>
                      <v-flex xs12>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-text-field
                              v-model="currentQuestion.options[1].text"
                              filled
                              clearable
                              :label="`Label Minimum`"
                              type="text"
                              autocomplete="off"
                              class="required"
                              :rules="notEmpty(`Label Minimum`)"
                              :disabled="isLoading"
                              :loading="isLoading"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-flex>
                      <v-flex xs12>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-text-field
                              v-model="currentQuestion.options[2].text"
                              filled
                              clearable
                              :label="`Label Maksimum`"
                              type="text"
                              autocomplete="off"
                              class="required"
                              :rules="notEmpty(`Label Maksimum`)"
                              :disabled="isLoading"
                              :loading="isLoading"
                            ></v-text-field>
                          </v-col>
                        </v-row>
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
import { VForm, Question, QuestionType, QuestionTypeObject, Option, TextfieldType, FileType } from '@/@types';
import { notEmptyRules, notEmptySelectRules } from '@/@utils';
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
  imageProvided: boolean = false;
  currentQuestion: Question = {
    key: '',
    type: {
      label: '',
      value: QuestionType.EMPTY
    },
    validation: {
      text: 'Bebas',
      value: TextfieldType.FREETEXT
    },
    required: false,
    text: '',
    description: '',
    image: undefined,
    options: [
      {
        text: '',
        value: ''
      }
    ]
  };
  questionTypeList: QuestionTypeObject[] = [
    {
      label: 'Jawaban Singkat',
      value: QuestionType.TEXT_FIELD,
      icon: 'mdi-format-text'
    },
    {
      label: 'Jawaban Paragraf',
      value: QuestionType.TEXT_AREA,
      icon: 'mdi-text'
    },
    {
      label: 'Pilihan',
      value: QuestionType.SELECT,
      icon: 'mdi-arrow-down-drop-circle-outline'
    },
    {
      label: 'Pilihan Ganda',
      value: QuestionType.RADIO,
      icon: 'mdi-radiobox-marked'
    },
    {
      label: 'Kotak Centang',
      value: QuestionType.CHECKBOX,
      icon: 'mdi-checkbox-marked'
    },
    {
      label: 'Skala',
      value: QuestionType.SCALE,
      icon: 'mdi-dots-horizontal'
    },
    {
      label: 'Tanggal',
      value: QuestionType.DATE,
      icon: 'mdi-calendar-range'
    },
    {
      label: 'Waktu',
      value: QuestionType.TIME,
      icon: 'mdi-clock-outline'
    },
    {
      label: 'File',
      value: QuestionType.FILE,
      icon: 'mdi-attachment'
    }
  ];
  textfieldType: Option[] = [
    {
      text: 'Bebas',
      value: TextfieldType.FREETEXT
    },
    {
      text: 'Alfanumerik',
      value: TextfieldType.ALPHANUMERIC
    },
    {
      text: 'Numerik',
      value: TextfieldType.NUMERIC
    },
    {
      text: 'Alfabet',
      value: TextfieldType.ALPHABET
    },
    {
      text: 'No Telepon',
      value: TextfieldType.TELEPHONE
    },
    {
      text: 'Email',
      value: TextfieldType.EMAIL
    }
  ];
  fileType: Option[] = [
    {
      text: 'Gambar',
      value: FileType.IMAGE
    },
    {
      text: 'Dokumen',
      value: FileType.DOCUMENT
    },
    {
      text: 'Lain-lain',
      value: FileType.OTHER
    }
  ];
  scaleOptions: Option[] = [
    {
      text: '3',
      value: 3
    },
    {
      text: '4',
      value: 4
    },
    {
      text: '5',
      value: 5
    },
    {
      text: '6',
      value: 6
    },
    {
      text: '10',
      value: 10
    }
  ];

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
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
        validation: this.currentQuestion.validation,
        text: this.currentQuestion.text,
        options: this.currentQuestion.options
      };
      if (this.descriptionProvided) {
        data.description = this.currentQuestion.description;
      }
      if (this.imageProvided) {
        data.image = this.currentQuestion.image;
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
        validation: this.currentQuestion.validation,
        text: this.currentQuestion.text,
        options: this.currentQuestion.options
      };
      if (this.descriptionProvided) {
        data.description = this.currentQuestion.description;
      }
      if (this.imageProvided) {
        data.image = this.currentQuestion.image;
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
  addImage() {
    this.imageProvided = true;
  }
  removeImage() {
    this.imageProvided = false;
    this.currentQuestion.image = undefined;
  }
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
  notEmptySelect(identifier: string): any[] {
    return notEmptySelectRules(identifier);
  }
  saveImage(file: any): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentQuestion.image = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.currentQuestion.image = undefined;
    }
  }
  addOption(): void {
    this.currentQuestion.options!.push({
      text: '',
      value: ''
    });
  }
  deleteOption(selectedOption: Option): void {
    const newOptionList = this.currentQuestion.options!.reduce((result: Option[], option: Option) => {
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
      if (this.selectedQuestion.description) {
        this.descriptionProvided = true;
      }
      if (this.selectedQuestion.image) {
        this.imageProvided = true;
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
      this.currentQuestion.validation = {
        text: 'Bebas',
        value: TextfieldType.FREETEXT
      };
      this.imageProvided = false;
      this.currentQuestion.image = undefined;
      this.descriptionProvided = false;
      this.currentQuestion.description = '';
    }
  }
  @Watch('currentQuestion.type.value')
  async handleScaleOptions(newValue: string): Promise<void> {
    if (newValue === 'scale') {
      this.currentQuestion.options = [
        {
          text: '3',
          value: 3
        },
        {
          text: '',
          value: ''
        },
        {
          text: '',
          value: ''
        }
      ];
    } else {
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
