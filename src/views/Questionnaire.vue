<template>
  <v-layout v-if="formData.status === 'closed'" wrap class="my-6 full-width">
    <v-flex xs10 class="mt-10 mx-auto">
      <v-card class="mx-auto py-5" width="100%">
        <v-card-text>
          <h1 class="text-center error--text">Form telah ditutup</h1>
          <h4 class="text-center">Hubungi pemilik form untuk pertanyaan lebih lanjut</h4>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="my-2 mx-auto text-end">
      <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
        ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
      >
    </v-flex>
  </v-layout>
  <v-layout v-else-if="checkStartDate()" wrap class="my-6 full-width">
    <v-flex xs10 class="mt-10 mx-auto">
      <v-card class="mx-auto py-5" width="100%">
        <v-card-text>
          <h1 class="text-center info--text mb-2">Form ini belum dibuka</h1>
          <h4 class="text-center">Hubungi penyedia form ini untuk informasi lebih detil</h4>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="my-2 mx-auto text-end">
      <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
        ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
      >
    </v-flex>
  </v-layout>
  <v-layout v-else-if="checkDueDate()" wrap class="my-6 full-width">
    <v-flex xs10 class="mt-10 mx-auto">
      <v-card class="mx-auto py-5" width="100%">
        <v-card-text>
          <h1 class="text-center warning--text mb-2">Form ini telah melewati batas waktu penerimaan jawaban</h1>
          <h4 class="text-center">Hubungi penyedia form ini untuk informasi lebih detil</h4>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="my-2 mx-auto text-end">
      <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
        ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
      >
    </v-flex>
  </v-layout>
  <v-layout v-else-if="isFound" wrap class="my-6 full-width form-container">
    <v-flex xs10 class="mb-3 mx-auto">
      <v-card width="100%">
        <v-img v-if="formData.imageBanner" :src="formData.imageBanner"></v-img>
        <v-card-text>
          <p class="display-1 primary--text">
            {{ formData.label }}
          </p>
          <p>{{ formData.description }}</p>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="mb-4 mx-auto">
      <v-layout wrap>
        <v-flex xs12>
          <v-window v-model="currentStep">
            <!-- {{ Page List }} -->
            <v-window-item v-for="(questionPage, index) in formData.questions" :key="`${index + 1}-content`">
              <v-form :ref="`questionnaireForm-${index}`" v-model="valid" lazy-validation>
                <div v-for="(questionList, index) in questionPage.sectionList" :key="index"></div>
                <!-- {{ Section List }} -->
                <v-card
                  v-for="(sectionItem, sectionIndex) in questionPage.sectionList"
                  :key="sectionItem.key"
                  class="ma-1 mb-3"
                  outlined
                >
                  <v-card-text>
                    <!-- {{ question List }} -->
                    <div>
                      <v-chip v-if="sectionItem && sectionItem.customTitle" color="primary" class="mb-2">{{
                        sectionItem.title
                      }}</v-chip>
                      <v-chip v-else-if="questionPage.sectionList.length > 1" color="primary" class="mb-2"
                        >Bagian {{ sectionIndex + 1 }}</v-chip
                      >
                      <v-card v-for="item in sectionItem.questionList" :key="item.key" class="ma-1 mb-3">
                        <v-card-text :class="item.required ? 'required' : ''">
                          <v-img v-if="item.image" :src="item.image"></v-img>
                          <div>
                            <v-icon x-small left>{{ item.type.icon }}</v-icon>
                            <small>{{ item.type.label }}</small>
                          </div>
                          <p class="headline">
                            {{ item.text }}
                          </p>
                          <p class="text--disabled mb-2">{{ item.description }}</p>
                          <v-layout v-if="item.type.value === 'text_field'">
                            <v-text-field
                              v-model="answerSkeleton[`${item.key}`]"
                              clearable
                              type="text"
                              autocomplete="off"
                              :placeholder="item.validation.value === 'telephone' ? 'Mulai dengan angka 0' : ''"
                              :rules="textfieldRules(item.validation.value, item.required)"
                              :disabled="isLoading"
                              :loading="isLoading"
                            ></v-text-field>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'text_area'">
                            <v-textarea
                              v-model="answerSkeleton[`${item.key}`]"
                              clearable
                              type="text"
                              autocomplete="off"
                              auto-grow
                              rows="4"
                              row-height="30"
                              :rules="item.required ? notEmpty('Jawaban ini') : []"
                              :disabled="isLoading"
                              :loading="isLoading"
                            ></v-textarea>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'radio'">
                            <v-radio-group
                              v-model="answerSkeleton[`${item.key}`]"
                              :rules="item.required ? notEmptyOptionRules(false) : []"
                            >
                              <v-radio
                                v-for="(option, optionIndex) in item.options"
                                :key="optionIndex"
                                :label="option.text"
                                :value="option.text"
                              ></v-radio>
                            </v-radio-group>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'checkbox'">
                            <v-container fluid>
                              <v-checkbox
                                v-model="answerSkeleton[`${item.key}`]"
                                v-for="(option, optionIndex) in item.options"
                                :key="optionIndex"
                                :label="option.text"
                                :value="option.text"
                                :rules="item.required ? notEmptyOptionRules(true) : []"
                                :hide-details="optionIndex !== item.options.length - 1"
                              ></v-checkbox>
                            </v-container>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'date'">
                            <v-container fluid>
                              <v-menu
                                v-model="dialogSkeleton[`${item.key}`]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="answerSkeleton[`${item.key}`]"
                                    prepend-icon="mdi-calendar"
                                    :rules="item.required ? notEmpty('Jawaban ini') : []"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :disabled="isLoading"
                                    :loading="isLoading"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="answerSkeleton[`${item.key}`]"
                                  :first-day-of-week="1"
                                  locale="id-id"
                                  @input="dialogSkeleton[`${item.key}`] = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-container>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'time'">
                            <v-container fluid>
                              <v-menu
                                v-model="dialogSkeleton[`${item.key}`]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="answerSkeleton[`${item.key}`]"
                                    prepend-icon="mdi-clock"
                                    :rules="item.required ? notEmpty('Jawaban ini') : []"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :disabled="isLoading"
                                    :loading="isLoading"
                                  ></v-text-field>
                                </template>
                                <v-time-picker
                                  v-model="answerSkeleton[`${item.key}`]"
                                  format="24hr"
                                  @input="dialogSkeleton[`${item.key}`] = false"
                                ></v-time-picker>
                              </v-menu>
                            </v-container>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'file'">
                            <v-container fluid>
                              <v-file-input
                                chips
                                show-size
                                truncate-length="50"
                                :accept="
                                  item.validation.value === 'image'
                                    ? 'image/*'
                                    : item.validation.value === 'document'
                                    ? '.doc,.docx,.xml,.pdf'
                                    : ''
                                "
                                :rules="fileInputRulesHandler(item.text, item.validation.value, 2000, item.required)"
                                @change="
                                  event => {
                                    saveFile(event, item.key);
                                  }
                                "
                              ></v-file-input>
                            </v-container>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'select'">
                            <v-container fluid>
                              <v-autocomplete
                                v-model="answerSkeleton[`${item.key}`]"
                                :items="item.options"
                                item-text="text"
                                item-value="text"
                                :rules="item.required ? notEmptyOptionRules(false) : []"
                              ></v-autocomplete>
                            </v-container>
                          </v-layout>
                          <v-layout v-else-if="item.type.value === 'scale'" class="ma-auto">
                            <v-flex xs2 class="ma-auto text-center">{{ item.options[1].text }}</v-flex>
                            <v-flex xs8
                              ><v-radio-group v-model="answerSkeleton[`${item.key}`]" row>
                                <v-radio
                                  v-for="n in item.options[0].value"
                                  :key="n"
                                  :value="n"
                                ></v-radio> </v-radio-group
                            ></v-flex>
                            <v-flex xs2 class="ma-auto text-center">{{ item.options[2].text }}</v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-card-text>
                </v-card>
                <v-layout row class="px-4 py-3">
                  <v-flex xs12 class="mb-2 text-end">
                    <span v-if="formData.questions.length > 1" class="pagination-label primary--text"
                      >Halaman {{ currentStep + 1 }} dari {{ formData.questions.length }}</span
                    >
                    <v-btn v-if="currentStep > 0" text class="mr-2" :disabled="isLoading" @click="previousStep(index)">
                      Kembali
                    </v-btn>
                    <v-btn color="primary" :disabled="isLoading || !valid" @click="nextStep(index)">
                      {{ currentStep === formData.questions.length - 1 ? 'Kirim' : 'Lanjutkan' }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-window-item>
          </v-window>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap class="my-6 full-width">
    <v-flex xs10 class="mt-10 mx-auto">
      <v-card class="mx-auto py-5" width="100%">
        <v-card-text>
          <h1 class="text-center error--text">Form tidak dapat ditemukan</h1>
          <h4 class="text-center">Periksa kembali kod form yang anda masukkan</h4>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="my-2 mx-auto text-end">
      <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
        ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';

import { Form, FormStatus, Respondent, Question, QuestionType, QuestionSection, Option, QuestionPage } from '@/@types';
import {
  notEmptyRules,
  notEmptyOptionRules,
  phoneNumberRules,
  emailRules,
  numericRules,
  alphabetRules,
  alphanumericRules,
  fileInputRules
} from '@/@utils';

@Component
export default class QuestionnairePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  isFound: boolean = true;
  parsedImage: any = '';
  formData: Form = {
    uuid: '',
    authorUuid: '',
    label: '',
    description: '',
    imageBanner: undefined,
    createdAt: '',
    updatedAt: '',
    startDate: '',
    dueDate: '',
    respondentCount: 0,
    questionCount: 0,
    status: FormStatus.OPEN,
    link: '',
    questions: [
      {
        title: 'Halaman ',
        sectionList: [
          {
            title: 'Bagian ',
            questionList: []
          }
        ]
      }
    ],
    respondents: []
  };
  respondentData: Respondent = {
    uuid: '',
    formId: '',
    answers: {},
    submitDate: ''
  };
  answerSkeleton: any = {};
  dialogSkeleton: any = {};
  currentStep: number = 1;
  arrayBuffer: any;

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  /* ------------------------------------
  => Createe (Lifecycle)
  ------------------------------------ */
  async created(): Promise<void> {
    await this.$store
      .dispatch('form/getFormById', this.$route.params.id)
      .then(() => {
        this.isFound = true;
      })
      .catch(() => {
        this.isFound = false;
      });
    this.formData = this.$store.state.form.selectedForm;
    await this.createAnswerSkeleton();
    await this.createDialogSkeleton();
    console.warn('this.answerSkeleton', this.answerSkeleton);
    console.warn('this.dialogSkeleton', this.dialogSkeleton);
    console.warn('question', this.formData.questions);
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  phoneRules(fieldIdentifier: string, isRequired: boolean): any[] {
    return phoneNumberRules(fieldIdentifier, isRequired);
  }

  textfieldRules(type: any, isRequired: boolean): any {
    switch (type) {
      case 'telephone':
        return phoneNumberRules('Jawaban ini (nomor telepon)', isRequired);
      case 'email':
        return emailRules('Jawaban ini (email)', isRequired);
      case 'numeric':
        return numericRules('Jawaban ini (numerik)', isRequired);
      case 'alphabet':
        return alphabetRules('Jawaban ini (alfabet)', isRequired);
      case 'alphanumeric':
        return alphanumericRules('Jawaban ini (alfanumerik)', isRequired);
      case 'freetext':
        return isRequired ? notEmptyRules('Jawaban ini') : [];
      default:
        return [];
    }
  }

  notEmptyOptionRules(isMultiple: boolean): any[] {
    return notEmptyOptionRules(isMultiple);
  }

  createAnswerSkeleton(): void {
    const newAnswerSkeleton: any = {};
    this.formData.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((questionSection: QuestionSection) => {
        questionSection.questionList.forEach((question: Question) => {
          newAnswerSkeleton[`${question.key}`] = this.getValueType(question.type.value);
        });
      });
    });
    this.answerSkeleton = newAnswerSkeleton;
  }

  createDialogSkeleton(): void {
    const newDialogSkeleton: any = {};
    this.formData.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((questionSection: QuestionSection) => {
        questionSection.questionList.forEach((question: Question) => {
          if (question.type.value === 'date' || question.type.value === 'time') {
            newDialogSkeleton[`${question.key}`] = false;
          }
        });
      });
    });
    this.dialogSkeleton = newDialogSkeleton;
  }

  getValueType(type: QuestionType): string | string[] | number | number[] | boolean | boolean[] | Option {
    switch (type) {
      case QuestionType.TEXT_FIELD:
      case QuestionType.TEXT_AREA:
      case QuestionType.RADIO:
        return '';
      case QuestionType.CHECKBOX:
        return [];
      default:
        return '';
    }
  }

  async submit(): Promise<void> {
    this.respondentData.uuid = uuid.v1();
    const newDate = new Date();
    this.respondentData.submitDate = newDate.toISOString();
    this.respondentData.answers = await this.answerSkeleton;
    this.respondentData.formId = this.$route.params.id;
    this.$store.dispatch('form/submitResponse', this.respondentData).then(() => {
      this.$router.push('/thank-you');
    });
  }

  nextStep(index: number): void {
    const questionnaireForm = this.$refs[`questionnaireForm-${index}`] as any;
    if (questionnaireForm[0].validate()) {
      if (this.currentStep === this.formData.questions.length - 1) {
        this.submit();
      } else {
        this.currentStep = index + 1;
      }
    }
  }

  previousStep(index: number): void {
    const questionnaireForm = this.$refs[`questionnaireForm-${index}`] as any;
    questionnaireForm[0].resetValidation();
    this.currentStep = index - 1;
  }

  checkDueDate(): boolean {
    if (!this.formData.dueDate) {
      return false;
    }
    const dueDate = new Date(this.formData.dueDate);
    const today = new Date();
    return today > dueDate;
  }

  checkStartDate(): boolean {
    if (!this.formData.startDate) {
      return false;
    }
    const startDate = new Date(this.formData.startDate);
    const today = new Date();
    return today < startDate;
  }

  saveFile(blob: Blob, key: string): void {
    this.answerSkeleton[`${key}`] = blob;
  }

  fileInputRulesHandler(fieldIdentifier: string, type: string, maxSize: number, isRequired: boolean): any {
    return fileInputRules(fieldIdentifier, type, maxSize, isRequired);
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('currentStep')
  async handleOnStepChange(): Promise<void> {
    setTimeout(() => {
      // This resolve bug vuetify scroll to top not working on v-stepper nextStep
      this.$vuetify.goTo(0);
    }, 1);
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
// Put red colored asterisk on required class
.required >>> .headline::after {
  content: ' *';
  color: red;
}
.question-item {
  p {
    margin-bottom: 0;
  }
}
.v-input--checkbox {
  margin-top: 0;
}
.form-container {
  // box-shadow: none;
  align-content: flex-start;
}
.pagination-label {
  margin-bottom: 4px;
  margin-right: 16px;
  font-size: small;
  font-weight: bold;
}
.v-input >>> .v-input--radio-group__input {
  justify-content: center;
}
</style>
