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
  <v-layout v-else-if="isFound" wrap class="my-6 full-width">
    <v-flex xs10 class="mb-3 mx-auto">
      <v-card width="100%">
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
          <v-stepper v-model="currentStep">
            <v-stepper-header v-if="formData.questions.length > 1">
              <template v-for="(questionSection, index) in formData.questions">
                <v-stepper-step :key="`${index + 1}-step`" :complete="currentStep > index" :step="index + 1">
                  {{ questionSection.title + (index + 1) }}
                </v-stepper-step>

                <v-divider v-if="index !== formData.questions.length - 1" :key="index"></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="(questionSection, index) in formData.questions"
                :key="`${index + 1}-content`"
                :step="index + 1"
              >
                <v-form :ref="`questionnaireForm-${index}`" v-model="valid" lazy-validation>
                  <v-card
                    v-for="item in questionSection.questionList"
                    :key="item.key"
                    :class="item.required ? 'required mx-auto mb-2' : 'mx-auto mb-2'"
                    width="100%"
                    flat
                  >
                    <v-card-text>
                      <div>
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
                          :rules="item.required ? notEmpty('Jawaban ini') : []"
                          :disabled="isLoading"
                          :loading="isLoading"
                        ></v-text-field>
                      </v-layout>
                      <v-layout v-if="item.type.value === 'numeric_field'">
                        <v-text-field
                          v-model="answerSkeleton[`${item.key}`]"
                          clearable
                          type="number"
                          autocomplete="off"
                          :rules="item.required ? notEmpty('Jawaban ini') : []"
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
                    </v-card-text>
                  </v-card>
                  <v-layout row class="px-4 py-3">
                    <v-flex xs12 class="mb-2 text-end">
                      <v-btn
                        v-if="currentStep > 1"
                        text
                        class="mr-2"
                        :disabled="isLoading"
                        @click="previousStep(index)"
                      >
                        Kembali
                      </v-btn>
                      <v-btn color="primary" :disabled="isLoading || !valid" @click="nextStep(index)">
                        {{ currentStep === formData.questions.length ? 'Kirim' : 'Lanjutkan' }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
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

import { Form, FormStatus, Respondent, Question, QuestionType, QuestionSection, Option } from '@/@types';
import { notEmptyRules, notEmptyOptionRules } from '@/@utils';

@Component
export default class QuestionnairePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  isFound: boolean = true;
  formData: Form = {
    uuid: '',
    authorUuid: '',
    label: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    dueDate: '',
    respondentCount: 0,
    questionCount: 0,
    status: FormStatus.OPEN,
    link: '',
    questions: [
      {
        title: 'Bagian ',
        questionList: []
      }
    ],
    respondents: []
  };
  respondentData: Respondent = {
    uuid: '',
    answers: {},
    submitDate: ''
  };
  answerSkeleton: any = {};
  dialogSkeleton: any = {};
  currentStep: number = 1;

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
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  notEmptyOptionRules(isMultiple: boolean): any[] {
    return notEmptyOptionRules(isMultiple);
  }

  createAnswerSkeleton(): void {
    const newAnswerSkeleton: any = {};
    this.formData.questions.forEach((quesitonSection: QuestionSection) => {
      quesitonSection.questionList.forEach((question: Question) => {
        newAnswerSkeleton[`${question.key}`] = this.getValueType(question.type.value);
      });
    });
    this.answerSkeleton = newAnswerSkeleton;
  }

  createDialogSkeleton(): void {
    const newDialogSkeleton: any = {};
    this.formData.questions.forEach((quesitonSection: QuestionSection) => {
      quesitonSection.questionList.forEach((question: Question) => {
        if (question.type.value === 'date' || question.type.value === 'time') {
          newDialogSkeleton[`${question.key}`] = false;
        }
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

  submit(): void {
    this.respondentData.uuid = uuid.v1();
    const newDate = new Date();
    this.respondentData.submitDate = newDate.toISOString();
    this.respondentData.answers = this.answerSkeleton;
    this.$store.dispatch('form/submitResponse', this.respondentData).then(() => {
      this.$router.push('/thank-you');
    });
  }

  nextStep(index: number): void {
    const questionnaireForm = this.$refs[`questionnaireForm-${index}`] as any;
    if (questionnaireForm[0].validate()) {
      if (this.currentStep === this.formData.questions.length) {
        this.submit();
      } else {
        this.currentStep = index + 2;
      }
    }
  }

  previousStep(index: number): void {
    const questionnaireForm = this.$refs[`questionnaireForm-${index}`] as any;
    questionnaireForm[0].resetValidation();
    this.currentStep = index;
  }

  checkDueDate(): boolean {
    const dueDate = new Date(this.formData.dueDate);
    const today = new Date();
    return today > dueDate;
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
.custom-stepper {
  // box-shadow: none;
}
</style>
