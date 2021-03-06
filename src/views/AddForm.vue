<template>
  <v-layout>
    <v-layout wrap class="full-width pa-10">
      <v-flex xs10 class="mb-4 mx-auto">
        <v-form ref="addForm" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="mb-3">
              <h1 v-if="formStateType === 'edit'" class="primary--text">Edit Form</h1>
              <h1 v-else class="primary--text">Buat Form Baru</h1>
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
                hide-details
                :disabled="isLoading"
                :loading="isLoading"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 class="mt-3 text-center">
              <v-btn
                v-if="!startDateProvided"
                text
                small
                color="secondary"
                @click="startDateProvided = true"
                :disabled="isLoading"
                :loading="isLoading"
                class="ml-2"
                ><v-icon small>mdi-plus</v-icon>Waktu Mulai Pengumpulan</v-btn
              >
              <v-btn
                v-if="!dueDateProvided"
                text
                small
                color="secondary"
                @click="dueDateProvided = true"
                :disabled="isLoading"
                :loading="isLoading"
                class="ml-2"
                ><v-icon small>mdi-plus</v-icon>Batas Waktu Pengumpulan</v-btn
              >
              <v-btn
                v-if="!posterProvided"
                text
                small
                color="secondary"
                @click="posterProvided = true"
                :disabled="isLoading"
                :loading="isLoading"
                class="ml-2"
                ><v-icon small>mdi-plus</v-icon>Poster</v-btn
              >
            </v-flex>
            <v-flex xs12 class="mt-3">
              <v-row v-if="startDateProvided" justify="space-between" class="w-100 ma-0 pa-0 mt-5">
                <v-menu
                  v-model="startDatePickerMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  top
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Waktu Mulai"
                      hint="Form akan terbuka otomatis jika sudah melewati batas waktu yang telah ditentukan"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate" no-title @input="startDatePickerMenu = false"></v-date-picker>
                </v-menu>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      small
                      color="secondary"
                      @click="startDateProvided = false"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2 mt-5"
                      v-on="on"
                      ><v-icon small left>mdi-close-circle</v-icon>Hapus</v-btn
                    >
                  </template>
                  <span>Hapus Waktu Mulai</span>
                </v-tooltip>
              </v-row>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <v-row v-if="dueDateProvided" justify="space-between" class="w-100 ma-0 pa-0 mt-5">
                <v-menu
                  v-model="dueDatePickerMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  top
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dueDate"
                      label="Batas Waktu"
                      hint="Form akan tertutup otomatis jika sudah melewati batas waktu yang telah ditentukan"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dueDate" no-title @input="dueDatePickerMenu = false"></v-date-picker>
                </v-menu>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      small
                      color="secondary"
                      @click="dueDateProvided = false"
                      :disabled="isLoading"
                      :loading="isLoading"
                      class="ml-2 mt-5"
                      v-on="on"
                      ><v-icon small left>mdi-close-circle</v-icon>Hapus</v-btn
                    >
                  </template>
                  <span>Hapus Batas Waktu</span>
                </v-tooltip>
              </v-row>
            </v-flex>
            <v-row v-if="posterProvided" justify="space-between" class="ma-0 pa-0 mt-5">
              <v-file-input
                v-if="!formData.imageBanner"
                accept="image/*"
                label="Gambar Poster"
                @change="saveImageBanner"
              ></v-file-input>
              <div v-else>
                <v-btn text small color="secondary" disabled>Pratinjau poster:</v-btn>
                <v-img :src="formData.imageBanner" max-width="400" max-height="200" class="ml-3"></v-img>
              </div>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    small
                    @click="deletePoster"
                    :disabled="isLoading"
                    :loading="isLoading"
                    class="ml-2 mt-5"
                    v-on="on"
                    ><v-icon small left>mdi-close-circle</v-icon>Hapus</v-btn
                  >
                </template>
                <span>Hapus Poster</span>
              </v-tooltip>
            </v-row>
            <v-layout v-if="isHideQuestions">
              <v-flex class="text-center">
                <v-btn
                  rounded
                  color="primary"
                  outlined
                  @click="openAddQuestionDialog"
                  :disabled="isLoading"
                  :loading="isLoading"
                  class="mx-2"
                >
                  <v-icon left>mdi-plus</v-icon>Tambah Pertanyaan
                </v-btn>
                <v-btn
                  rounded
                  color="primary"
                  outlined
                  @click="loadFromTemplate"
                  :disabled="isLoading"
                  :loading="isLoading"
                  class="mx-2"
                >
                  <v-icon left small>mdi-cloud-upload-outline</v-icon>Unggah .json Template
                </v-btn>
                <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  accept="application/JSON"
                  @change="onJSONFileChanged"
                />
              </v-flex>
            </v-layout>
            <v-layout v-else wrap>
              <v-flex xs12 class="mb-3 mt-6">
                <h2 class="primary--text">List Pertanyaan</h2>
                <hr />
              </v-flex>
              <!-- QUESTION LIST -->
              <div
                v-for="(questionPage, pageIndex) in formData.questions"
                :key="pageIndex"
                class="full-width mb-6 position-relative"
              >
                <h3 v-if="formData.questions.length > 1" class="primary--text mb-2 text-center">
                  {{ questionPage.title + (pageIndex + 1) }}
                  <v-btn
                    v-if="pageIndex > 0"
                    color="primary"
                    class="ml-2 absolute-right"
                    outlined
                    rounded
                    @click="removePage(questionPage, pageIndex)"
                    small
                  >
                    <v-icon left small>mdi-trash-can</v-icon> Hapus Halaman
                  </v-btn>
                </h3>
                <v-expansion-panels
                  class="full-width mb-4 section-title"
                  v-for="(questionSection, sectionIndex) in questionPage.sectionList"
                  :key="sectionIndex"
                >
                  <h4 v-if="questionPage.sectionList.length > 1" class="primary--text mb-2">
                    <span v-if="questionSection && questionSection.customTitle">{{ questionSection.title }}</span>
                    <span v-else>{{ 'Bagian ' + (sectionIndex + 1) }}</span>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="ml-2"
                          @click="openEditSectionDialog(questionSection, pageIndex, sectionIndex)"
                          v-on="on"
                        >
                          <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Ubah Nama Bagian Ini</span>
                    </v-tooltip>
                    <v-btn
                      v-if="sectionIndex > 0"
                      color="primary"
                      class="ml-2 absolute-right"
                      outlined
                      rounded
                      @click="removeSection(questionSection, sectionIndex, pageIndex)"
                      small
                    >
                      <v-icon left small>mdi-close-circle</v-icon> Hapus Bagian
                    </v-btn>
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
                                <v-col cols="6"
                                  ><v-icon left small>{{ item.type.icon }}</v-icon
                                  >{{ item.type.label }}</v-col
                                >
                                <v-col cols="6" class="error--text">{{ item.required ? 'Wajib Diisi' : '' }}</v-col>
                              </v-row>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row
                          ><v-col cols="6" class="text--secondary px-6">
                            <v-row v-if="item.image">
                              <v-img :src="item.image" max-width="300" max-height="150"></v-img>
                            </v-row>
                            <v-row>{{ item.description ? item.description : '' }}</v-row>
                            <v-row v-if="item.type.value === 'radio' || item.type.value === 'checkbox'"
                              ><v-list dense>
                                <v-subheader>Pilihan Jawaban:</v-subheader>
                                <v-list-item-group color="primary">
                                  <v-list-item
                                    v-for="(option, optionIndex) in item.options"
                                    :key="optionIndex"
                                    disabled
                                  >
                                    <v-list-item-icon>
                                      {{ optionIndex + 1 }}
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title v-text="option.text"></v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group> </v-list
                            ></v-row>
                          </v-col>
                          <v-col cols="6" class="text-right">
                            <v-chip class="ma-2"
                              ><v-icon left small>{{ item.type.icon }}</v-icon> {{ item.type.label }} </v-chip
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
                <v-btn
                  color="primary"
                  small
                  text
                  @click="addSection(pageIndex)"
                  :disabled="isLoading"
                  :loading="isLoading"
                  class="mb-2"
                >
                  <v-icon left small>mdi-plus</v-icon>Tambah Bagian
                </v-btn>
                <hr class="primary--text" />
              </div>
              <v-flex xs12 class="my-6 form-actions">
                <v-card outlined>
                  <v-card-text>
                    <v-row justify="space-between" class="ma-0 pa-0">
                      <v-layout wrap>
                        <v-btn
                          rounded
                          color="primary"
                          outlined
                          @click="openAddQuestionDialog"
                          :disabled="isLoading"
                          :loading="isLoading"
                        >
                          <v-icon left>mdi-plus</v-icon>Tambah Pertanyaan
                        </v-btn>
                        <v-btn
                          color="primary"
                          small
                          text
                          @click="addPage"
                          :disabled="isLoading"
                          :loading="isLoading"
                          class="ml-2 mt-1"
                        >
                          <v-icon left small>mdi-plus</v-icon>Tambah Halaman
                        </v-btn>
                      </v-layout>
                      <v-spacer />
                      <v-layout>
                        <v-flex xs6 class="ma-auto">
                          <v-switch
                            v-if="formStateType === 'edit'"
                            v-model="status"
                            label="Status"
                            class="mt-1 mb-2"
                            hide-details
                          />
                        </v-flex>
                        <v-flex xs6 class="ma-auto">
                          <v-btn
                            v-if="formStateType === 'edit'"
                            rounded
                            color="primary"
                            @click="editForm"
                            :disabled="isLoading"
                            :loading="isLoading"
                            >Perbarui Form</v-btn
                          >
                          <v-btn
                            v-else
                            rounded
                            color="primary"
                            @click="saveForm"
                            :disabled="isLoading"
                            :loading="isLoading"
                            >Simpan Form</v-btn
                          >
                        </v-flex>
                      </v-layout>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <AddQuestion
      :dialog="dialog"
      :is-edit="isEditQuestion"
      :selected-question="selectedQuestion"
      :question-key="newKey"
      :close-dialog="closeQuestionDialog"
      @add="addQuestion"
      @edit="editQuestion"
    />
    <NameChangeDialog
      :dialog="nameEditDialog"
      :selected-section="selectedSection"
      :close-dialog="closeEditSectionDialog"
      @save="saveSectionName"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import draggable from 'vuedraggable';

import {
  VForm,
  Form,
  FormStatus,
  Question,
  QuestionSection,
  QuestionType,
  QuestionPage,
  FormStateType
} from '@/@types';
import { notEmptyRules } from '@/@utils';

import AddQuestion from '@/components/AddQuestion.vue';
import NameChangeDialog from '@/components/NameChangeDialog.vue';

@Component({
  components: {
    draggable,
    AddQuestion,
    NameChangeDialog
  }
})
export default class AddFormPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  newKey: string = '';
  dialog: boolean = false;
  nameEditDialog: boolean = false;
  isEditQuestion: boolean = false;
  isSelecting: boolean = false;
  valid: boolean = true;
  dragState: boolean = false;
  status: boolean = true;
  startDatePickerMenu: boolean = false;
  dueDatePickerMenu: boolean = false;
  startDateProvided: boolean = false;
  dueDateProvided: boolean = false;
  posterProvided: boolean = false;
  selectedFile: any = null;
  targetPage: number = 0;
  targetSection: number = 0;
  startDate: string = '';
  dueDate: string = '';
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
  selectedQuestion: Question = {
    key: '',
    text: '',
    type: {
      label: '',
      value: QuestionType.EMPTY
    },
    required: false
  };
  selectedSection: QuestionSection = {
    title: '',
    questionList: []
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  get formStateType(): FormStateType {
    return this.$store.state.form.stateType;
  }

  get formList(): Form[] {
    return this.$store.state.form.formList;
  }

  get isHideQuestions(): boolean {
    return this.getQuestionCount() === 0;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    if (this.formStateType === FormStateType.EDIT || this.formStateType === FormStateType.DUPLICATE) {
      await this.getFormData();
    }
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
  openAddQuestionDialog(): void {
    this.newKey = uuid.v1();
    this.isEditQuestion = false;
    this.dialog = true;
  }
  addQuestion(item: Question): void {
    this.formData.questions[this.formData.questions.length - 1].sectionList[
      this.formData.questions[this.formData.questions.length - 1].sectionList.length - 1
    ].questionList.push(item);
  }
  addPage(): void {
    this.formData.questions.push({
      title: 'Halaman ',
      sectionList: [
        {
          title: 'Bagian ',
          questionList: []
        }
      ]
    });
  }
  removePage(questionPage: QuestionPage, pageIndex: number): void {
    questionPage.sectionList.forEach(section => {
      this.formData.questions[pageIndex - 1].sectionList.push(section);
    });
    this.formData.questions.splice(pageIndex, 1);
  }
  addSection(pageIndex: number): void {
    this.formData.questions[pageIndex].sectionList.push({
      title: 'Bagian ',
      questionList: []
    });
  }
  openEditSectionDialog(section: QuestionSection, pageIndex: number, sectionIndex: number): void {
    this.selectedSection = section;
    this.targetPage = pageIndex;
    this.targetSection = sectionIndex;
    this.nameEditDialog = true;
  }
  closeEditSectionDialog() {
    this.nameEditDialog = false;
  }
  saveSectionName(section: QuestionSection) {
    this.formData.questions[this.targetPage].sectionList[this.targetSection] = section;
    this.nameEditDialog = false;
  }
  removeSection(section: QuestionSection, sectionIndex: number, pageIndex: number): void {
    section.questionList.forEach(question => {
      this.formData.questions[pageIndex].sectionList[sectionIndex - 1].questionList.push(question);
    });
    this.formData.questions[pageIndex].sectionList.splice(sectionIndex, 1);
  }
  saveForm(): void {
    if (this.checkAnyEmptySection()) {
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Mohon hapus "Bagian" atau "Halaman" yang kosong terlebih dahulu',
        color: 'error',
        timeout: 4000
      });
      return;
    }
    const addForm = this.$refs.addForm as VForm;
    if (addForm.validate()) {
      const data = { ...this.formData };
      const newDate = new Date();
      const formId = uuid.v1();
      data.uuid = formId;
      data.createdAt = newDate.toISOString();
      data.questionCount = this.getQuestionCount();
      data.authorUuid = this.$store.state.user.currentUser.uuid;
      data.link = `${process.env.VUE_APP_URL}/questionnaire/${formId}`;
      if (this.startDateProvided) {
        try {
          const startDate = new Date(this.startDate);
          data.startDate = startDate.toISOString();
        } catch {
          console.warn('Batas Waktu tidak valid');
        }
      }
      if (this.dueDateProvided) {
        try {
          const dueDate = new Date(this.dueDate);
          data.dueDate = dueDate.toISOString();
        } catch {
          console.warn('Batas Waktu tidak valid');
        }
      }
      this.$store.dispatch('form/saveForm', data).then(() => {
        this.$router.push('/dashboard/form');
      });
    }
  }
  editForm(): void {
    if (this.checkAnyEmptySection()) {
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Mohon hapus "Bagian" atau "Halaman" yang kosong terlebih dahulu',
        color: 'error',
        timeout: 4000
      });
      return;
    }
    const addForm = this.$refs.addForm as VForm;
    if (addForm.validate()) {
      const data = { ...this.formData };
      const newDate = new Date();
      data.updatedAt = newDate.toISOString();
      data.questionCount = this.getQuestionCount();
      if (this.status) {
        data.status = FormStatus.OPEN;
      } else {
        data.status = FormStatus.CLOSED;
      }
      if (this.startDateProvided) {
        try {
          const startDate = new Date(this.startDate);
          data.startDate = startDate.toISOString();
        } finally {
          console.warn('Waktu Mulai tidak valid');
        }
      } else {
        delete data.startDate;
      }
      if (this.dueDateProvided) {
        try {
          const dueDate = new Date(this.dueDate);
          data.dueDate = dueDate.toISOString();
        } finally {
          console.warn('Batas Waktu tidak valid');
        }
      } else {
        delete data.dueDate;
      }
      this.$store.dispatch('form/editForm', data).then(() => {
        this.$router.push('/dashboard/form');
      });
    }
  }
  getFormData(): void {
    this.formData = this.$store.state.form.selectedForm;
    if (this.formData.status === FormStatus.OPEN) {
      this.status = true;
    } else {
      this.status = false;
    }
    if (this.formData.startDate) {
      this.startDateProvided = true;
      this.startDate = this.formData.startDate.slice(0, 10);
    }
    if (this.formData.dueDate) {
      this.dueDateProvided = true;
      this.dueDate = this.formData.dueDate.slice(0, 10);
    }
    if (this.formData.imageBanner) {
      this.posterProvided = true;
    }
  }
  getQuestionCount(): number {
    let newQuestionCount: number = 0;
    this.formData.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((questionSection: QuestionSection) => {
        questionSection.questionList.forEach(() => {
          newQuestionCount++;
        });
      });
    });
    return newQuestionCount;
  }
  checkAnyEmptySection(): boolean {
    let isEmpty = false;
    this.formData.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((questionSection: QuestionSection) => {
        if (questionSection.questionList.length === 0) {
          isEmpty = true;
        }
      });
    });
    return isEmpty;
  }
  deleteQuestion(selectedQuestion: Question): void {
    const newQuestionPage = this.formData.questions.map((questionPage: QuestionPage) => {
      const newQuestionSection = questionPage.sectionList.map((quesitonSection: QuestionSection) => {
        const newQuestionList = quesitonSection.questionList.reduce((result: Question[], question: Question) => {
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
      return {
        title: questionPage.title,
        sectionList: newQuestionSection
      };
    });
    this.formData.questions = newQuestionPage;
  }
  openEditQuestionDialog(selectedQuestion: Question): void {
    this.selectedQuestion = selectedQuestion;
    this.isEditQuestion = true;
    this.dialog = true;
  }
  editQuestion(editedQuestion: Question): void {
    const newQuestionPage = this.formData.questions.map((questionPage: QuestionPage) => {
      const newQuestionSection = questionPage.sectionList.map((quesitonSection: QuestionSection) => {
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
      return {
        title: questionPage.title,
        sectionList: newQuestionSection
      };
    });
    this.formData.questions = newQuestionPage;
  }
  async saveImageBanner(file: any): Promise<void> {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.imageBanner = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.formData.imageBanner = undefined;
    }
  }
  deletePoster(): void {
    this.posterProvided = false;
    this.formData.imageBanner = undefined;
  }
  loadFromTemplate(): void {
    this.isSelecting = true;
    window.addEventListener(
      'focus',
      () => {
        this.isSelecting = false;
      },
      { once: true }
    );

    const uploaderInput: any = this.$refs.uploader;
    uploaderInput.click();
  }
  onJSONFileChanged(e: any): void {
    this.selectedFile = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      const parsedData = JSON.parse(data);
      this.formData.label = parsedData.label;
      this.formData.description = parsedData.description;
      this.formData.questions = parsedData.questions;
    };

    reader.readAsBinaryString(this.selectedFile);
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
.absolute-right {
  position: absolute;
  right: 0;
}
.position-relative {
  position: relative;
}
</style>
