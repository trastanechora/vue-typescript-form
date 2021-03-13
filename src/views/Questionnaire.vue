<template>
  <v-layout class="my-6">
    <v-layout wrap class="full-width">
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
                  <v-layout v-if="item.type.value === 'text_area'">
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
                  <v-layout v-if="item.type.value === 'radio'">
                    <v-radio-group v-model="answerSkeleton[`${item.key}`]">
                      <v-radio
                        v-for="(option, optionIndex) in item.options"
                        :key="optionIndex"
                        :label="option.text"
                        :value="option.text"
                      ></v-radio>
                    </v-radio-group>
                  </v-layout>
                  <v-layout v-if="item.type.value === 'checkbox'">
                    <v-container fluid>
                      <v-checkbox
                        v-model="answerSkeleton[`${item.key}`]"
                        v-for="(option, optionIndex) in item.options"
                        :key="optionIndex"
                        :label="option.text"
                        :value="option.text"
                      ></v-checkbox>
                    </v-container>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 class="mb-3">
              <v-layout row>
                <v-flex xs12 class="mb-2 text-end">
                  <v-btn color="primary" @click="submit" :disabled="isLoading" :loading="isLoading" class="ml-2"
                    >Kirim</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Form, FormStatus, Respondent, Question, QuestionType, QuestionSection, Option } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class QuestionnairePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  formData: Form = {
    uuid: '',
    label: '',
    description: '',
    createdDate: '',
    updatedDate: '',
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
    ]
  };
  respondentData: Respondent = {
    formKey: '',
    answers: [],
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
    await console.warn(this.$route.params.id);
    this.formData = this.$store.state.form.selectedForm;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    await console.warn(this.$store.state.form.selectedForm.questions);
    await this.createAnswerSkeleton();
    console.warn('answerSkeleton', this.answerSkeleton);
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  // createAnswerSkeleton(): void {
  //   const newAnswerSkeleton: Answer[] = [];
  //   this.formData.questions.forEach((quesitonSection: QuestionSection) => {
  //     quesitonSection.questionList.forEach((question: Question) => {
  //       newAnswerSkeleton.push({
  //         key: question.key,
  //         type: question.type,
  //         value: this.getValueType(question.type.value)
  //       });
  //     });
  //   });
  //   this.answerSkeleton = newAnswerSkeleton;
  // }

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
    console.warn('result:', this.answerSkeleton);
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
