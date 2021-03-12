<template>
  <v-layout class="admin-container">
    <v-layout wrap class="admin-view full-width">
      <v-flex xs10 class="mb-4 mx-auto">
        <v-form ref="addForm" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="mb-3">
              <h1 class="primary--text">Buat Form Baru</h1>
              <hr />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="formData.label"
                label="Label Form"
                outlined
                clearable
                type="text"
                class="required"
                :rules="notEmpty('Label Form')"
                :disabled="isLoading"
                :loading="isLoading"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="formData.description"
                label="Deskripsi Form"
                outlined
                clearable
                auto-grow
                rows="4"
                row-height="30"
                type="text"
                :disabled="isLoading"
                :loading="isLoading"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 class="mb-3">
              <h2 class="primary--text">List Pertanyaan</h2>
              <hr />
            </v-flex>
            <!-- QUESTION LIST -->
            <v-expansion-panels
              class="full-width mb-4 section-title"
              v-for="(questionSection, index) in formData.questions"
              :key="index"
            >
              <h4 v-if="formData.questions.length > 1" class="primary--text">
                {{ questionSection.title + (index + 1) }}
              </h4>
              <draggable
                v-model="questionSection.questionList"
                group="questions"
                @start="dragState = true"
                @end="dragState = false"
                tag="div"
                class="full-width"
              >
                <v-expansion-panel v-for="item in questionSection.questionList" :key="item.key" class="full-width">
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4">
                        {{ item.text }}
                      </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <v-row v-if="!open" no-gutters style="width: 100%">
                            <v-col cols="6">{{ item.type.label }}</v-col>
                            <v-col cols="6">{{ item.required ? 'Wajib Diisi' : '' }}</v-col>
                            <!-- <v-col cols="1"
                              ><v-btn icon small @click="test">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn></v-col
                            >
                            <v-col cols="1"
                              ><v-btn icon small @click="test">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn></v-col
                            > -->
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row
                      ><v-col cols="6">{{ item.description ? item.description : '' }}</v-col>
                      <v-col cols="6" class="text-right">
                        <v-chip class="ma-2"> {{ item.type.label }} </v-chip
                        ><v-chip v-if="item.required" class="ma-2" color="error" outlined>
                          Wajib Diisi
                        </v-chip></v-col
                      ></v-row
                    >
                    <v-row class="mx-2 mb-1">
                      <v-spacer /><v-btn color="primary" text @click="openEditQuestionDialog(item)">
                        <v-icon left>mdi-pencil</v-icon> Edit
                      </v-btn>
                      <v-btn color="primary" text @click="deleteQuestion(item)">
                        <v-icon left>mdi-delete</v-icon> Hapus
                      </v-btn></v-row
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </draggable>
            </v-expansion-panels>
            <v-flex xs12 class="my-6 form-actions">
              <v-card flat>
                <v-card-text>
                  <v-row justify="space-between" class="ma-0 pa-0">
                    <v-btn
                      rounded
                      color="primary"
                      outlined
                      @click="addNewQuestion"
                      :disabled="isLoading"
                      :loading="isLoading"
                    >
                      <v-icon left>mdi-plus</v-icon>Tambah Pertanyaan
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="addSection"
                      class="ml-3"
                      :disabled="isLoading"
                      :loading="isLoading"
                    >
                      <v-icon left>mdi-plus</v-icon>Tambah Bagian
                    </v-btn>
                    <v-spacer />
                    <v-btn rounded color="primary" @click="saveForm" :disabled="isLoading" :loading="isLoading"
                      >Simpan Form</v-btn
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <AddQuestion
      :dialog="dialog"
      :is-edit="isEdit"
      :selected-question="selectedQuestion"
      :question-key="newKey"
      :close-dialog="closeQuestionDialog"
      @add="addQuestion"
      @edit="editQuestion"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import draggable from 'vuedraggable';

import { Form, FormStatus, Question, QuestionSection, QuestionType } from '@/@types';
import { notEmptyRules } from '@/@utils';

import AddQuestion from '@/components/AddQuestion.vue';

@Component({
  components: {
    draggable,
    AddQuestion
  }
})
export default class AddFormPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  newKey: string = '';
  dialog: boolean = false;
  isEdit: boolean = false;
  valid: boolean = true;
  dragState: boolean = false;
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
    ],
    respondents: []
  };
  selectedQuestion: Question = {
    key: '',
    text: '',
    type: {
      label: '',
      value: QuestionType.EMPTY
    },
    required: false
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  get formList(): Form[] {
    return this.$store.state.form.formList;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    await this.getFormData();
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
  closeQuestionDialog(): void {
    this.dialog = false;
  }
  addNewQuestion(): void {
    this.newKey = uuid.v1();
    this.isEdit = false;
    this.dialog = true;
  }
  addQuestion(item: Question): void {
    this.formData.questions[this.formData.questions.length - 1].questionList.push(item);
  }
  addSection(): void {
    this.formData.questions.push({
      title: 'Bagian ',
      questionList: []
    });
  }
  saveForm(): void {
    this.$store.dispatch('form/updateSelectedForm', this.formData);
  }
  getFormData(): void {
    this.formData = this.$store.state.form.selectedForm;
  }
  test(): void {
    console.warn('TEST!');
  }
  deleteQuestion(selectedQuestion: Question): void {
    const newQuestionSection = this.formData.questions.map((quesitonSection: QuestionSection) => {
      const newQuestionList = quesitonSection.questionList.reduce(function(result: Question[], question: Question) {
        if (question.key !== selectedQuestion.key) {
          result.push(question);
        }
        return result;
      }, []);
      return {
        title: quesitonSection.title,
        questionList: newQuestionList
      };
    });
    this.formData.questions = newQuestionSection;
  }
  openEditQuestionDialog(selectedQuestion: Question): void {
    this.selectedQuestion = selectedQuestion;
    this.isEdit = true;
    this.dialog = true;
  }
  editQuestion(editedQuestion: Question): void {
    console.warn('editedQuestion', editedQuestion);
    const newQuestionSection = this.formData.questions.map((quesitonSection: QuestionSection) => {
      const newQuestionList = quesitonSection.questionList.map((question: Question) => {
        if (question.key === editedQuestion.key) {
          return editedQuestion;
        } else {
          return question;
        }
      });
      return {
        title: quesitonSection.title,
        questionList: newQuestionList
      };
    });
    console.warn('newQuestionSection', newQuestionSection);
    this.formData.questions = newQuestionSection;
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('formData.questions')
  async handleOnChange(newValue: Question | Question[] | Question[][]): Promise<void> {
    console.warn(newValue);
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
.section-title {
  justify-content: left;
}
.form-actions {
  position: sticky;
  bottom: 40px;
  z-index: 10;
}
</style>
