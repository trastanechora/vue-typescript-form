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
  <v-layout v-else-if="isFound" wrap class="my-6 full-width">
    <v-flex xs10 class="mb-4 mx-auto">
      <v-form ref="questionnaireForm" v-model="valid" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 class="mb-3">
            <v-card class="mx-auto" width="100%">
              <v-card-text>
                <p class="display-1 primary--text">
                  {{ formData.label }}
                </p>
                <p>{{ formData.description }}</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-for="(questionSection, index) in formData.questions" :key="index" class="mb-4 question-item">
            <h4 v-if="formData.questions.length > 1" class="primary--text">
              {{ questionSection.title + (index + 1) }}
            </h4>
            <v-card
              v-for="item in questionSection.questionList"
              :key="item.key"
              :class="item.required ? 'required mx-auto mb-2' : 'mx-auto mb-2'"
              width="100%"
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
                    <v-date-picker
                      v-model="answerSkeleton[`${item.key}`]"
                      :first-day-of-week="1"
                      :rules="item.required ? notEmpty('Jawaban ini') : []"
                      :disabled="isLoading"
                      locale="id-id"
                    >
                      <v-text-field
                        v-model="answerSkeleton[`${item.key}`]"
                        :rules="item.required ? notEmpty('Jawaban ini') : []"
                        :disabled="isLoading"
                        :loading="isLoading"
                      ></v-text-field
                    ></v-date-picker>
                  </v-container>
                </v-layout>
                <v-layout v-else-if="item.type.value === 'time'">
                  <v-container fluid>
                    <v-time-picker v-model="answerSkeleton[`${item.key}`]" class="mt-4" format="24hr">
                      <v-text-field
                        v-model="answerSkeleton[`${item.key}`]"
                        :rules="item.required ? notEmpty('Jawaban ini') : []"
                        :loading="isLoading"
                      ></v-text-field>
                    </v-time-picker>
                  </v-container>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 class="mb-3">
            <v-layout row>
              <v-flex xs12 class="mb-2 text-end">
                <v-btn
                  color="primary"
                  @click="submit"
                  :disabled="isLoading || !valid"
                  :loading="isLoading"
                  class="ml-2"
                  width="200px"
                  >Kirim</v-btn
                >
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-form>
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
import { Component, Vue } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';

import { VForm, Form, FormStatus, Respondent, Question, QuestionType, QuestionSection, Option } from '@/@types';
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
  // answerSkeleton: Answer[] = [];
  answerSkeleton: any = {};

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
    const questionnaireForm = this.$refs.questionnaireForm as VForm;
    if (questionnaireForm.validate()) {
      this.respondentData.uuid = uuid.v1();
      const newDate = new Date();
      this.respondentData.submitDate = newDate.toISOString();
      this.respondentData.answers = this.answerSkeleton;
      console.warn('result respondent data:', this.respondentData);
      this.$store.dispatch('form/submitResponse', this.respondentData).then(() => {
        this.$router.push('/thank-you');
      });
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
</style>
