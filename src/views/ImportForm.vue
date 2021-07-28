<template>
  <v-layout wrap class="pa-10">
    <v-flex xs12>
      <div>
        <v-layout>
          <v-flex>
            <h2 class="primary--text mb-2">Import XLSX</h2>
          </v-flex>
        </v-layout>
        <v-file-input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Import File Excel"
          hint="Pastikan data .xlxs yang anda import sudah terproses dengan benar pada tabel di bawah ini, jika sudah silakan lanjut"
          persistent-hint
          @change="onChange"
        ></v-file-input>
        <v-layout v-if="headers.length > 0" wrap class="px-8 my-4">
          <v-flex xs12>
            <v-btn rounded color="primary" @click="dialog = true">Lanjut</v-btn>
          </v-flex>
        </v-layout>
        <v-data-table
          v-if="headers.length > 0"
          :headers="headers"
          :items="data"
          :items-per-page="10"
          class="elevation-1"
        ></v-data-table>
        <div v-else class="mt-4">
          <v-card>
            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">
                Kriteria file Excel yang diterima:
              </div>

              <v-timeline align-top dense>
                <v-timeline-item v-for="message in messages" :key="message.time" :color="message.color" small>
                  <div>
                    <div class="font-weight-normal">
                      <strong>#{{ message.from }}</strong> | {{ message.time }}
                    </div>
                    <div>{{ message.message }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-flex>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Pengaturan Form
        </v-card-title>

        <v-card-text class="my-2">
          <div>
            <v-text-field
              v-model="formLabel"
              clearable
              type="text"
              autocomplete="off"
              persistent-hint
              label="Label form"
              hint="Label form akan tampil sebagai nama form"
              :rules="textfieldRules('Label form')"
              class="my-4"
            ></v-text-field>
          </div>
          <div>
            Atur pertanyaan untuk setiap kolom atau Anda bisa langsung dengan pertanyaan seperti judul kolom dari tabel
            pratinjau
          </div>
          <div>
            <v-form ref="importForm" v-model="valid" lazy-validation>
              <div v-for="(questionItem, index) in questions" :key="`${index + 1}-column`">
                <!-- {{ questionItem }} -->
                <v-layout>
                  <v-flex xs9>
                    <v-text-field
                      v-model="questions[index].text"
                      clearable
                      type="text"
                      autocomplete="off"
                      persistent-hint
                      :hint="`Kolom nomor ${index + 1}.`"
                      :rules="textfieldRules(index + 1)"
                      class="mx-2 required"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                    <v-select
                      v-model="questions[index].validation"
                      :items="textfieldType"
                      item-text="text"
                      item-value="value"
                      label="Tipe Data"
                      return-object
                    ></v-select>
                  </v-flex>
                </v-layout>
              </div>
            </v-form>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">
            Batal
          </v-btn>
          <v-btn color="primary" @click="doImport">
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isImportLoading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="py-6">
          <v-progress-linear v-model="importPercentage" height="25" color="white">
            <strong :class="importPercentage > 50 ? 'primary--text' : 'white--text'"
              >{{ Math.ceil(importPercentage) }}%</strong
            >
          </v-progress-linear>
          <div class="text-center">{{ importProgression }} / {{ dataLength }}</div>
          <p class="text-caption text-center mt-2 mb-0">
            Mohon untuk tidak memuat ulang halaman sebelum proses import selesai, atau data tidak akan tersimpan secara
            penuh
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { dateFormatter } from '@/@utils';
import { VForm, Question, QuestionType, FormStatus, TextfieldType, Respondent, Option } from '@/@types';
import { notEmptyRules } from '@/@utils';
import { uuid } from 'vue-uuid';
import XLSX from 'xlsx';

@Component({
  components: {}
})
export default class FormPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  dialog: boolean = false;
  valid: boolean = true;
  file: any = null;
  excelFile: any = null;
  data: any = [];
  dataLength: number = 0;
  headers: any = [];
  questions: Question[] = [];
  items: any = [];
  isImportLoading: boolean = false;
  formLabel: string = '';
  importProgression: number = 0;
  importPercentage: number = 0;
  textfieldType: Option[] = [
    {
      text: 'Bebas',
      value: TextfieldType.FREETEXT
    },
    {
      text: 'Numerik',
      value: TextfieldType.NUMERIC
    }
  ];
  messages: any = [
    {
      from: '1',
      message: `Memiliki ekstensi .xlsx`,
      time: 'Jenis File',
      color: 'primary'
    },
    {
      from: '2',
      message: 'Memiliki satu baris header',
      time: 'Format',
      color: 'primary'
    },
    {
      from: '3',
      message: 'Tidak ada header yang bernilai sama',
      time: 'Bebas Duplikat',
      color: 'primary'
    },
    {
      from: '4',
      message: 'Setiap cell hanya memiliki tipe text atau angka',
      time: 'Tipe Data',
      color: 'primary'
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
  => Mounted (Lifecycle)
  ------------------------------------ */
  // mounted(): void {
  //   console.warn('Ready to rock!');
  // }

  doEmptyTable() {
    this.file = null;
    this.excelFile = null;
    this.data = [];
    this.headers = [];
    this.items = [];
  }

  onChange(event: any) {
    if (event) {
      const file = event;
      this.file = file;
      this.formLabel = file.name;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        });

        const parsedXlsx: any = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { header: 1 });
        const parsedXlsxLength = parsedXlsx.length;
        const headerRow: any = parsedXlsx[0];
        const dataRows = parsedXlsx.slice(1, parsedXlsxLength);
        const duplicateChecker: any = {};
        const duplicateKeys: string[] = [];

        headerRow.forEach((currentHeader: string) => {
          const modifiedKey = currentHeader.toLowerCase().replace(/\s/g, '');
          if (duplicateChecker[`${modifiedKey}`]) {
            duplicateKeys.push(currentHeader);
          }

          duplicateChecker[`${modifiedKey}`] = modifiedKey;
          this.headers.push({ text: currentHeader, value: modifiedKey });
          this.questions.push({
            key: modifiedKey,
            text: currentHeader,
            tableHeader: currentHeader,
            type: {
              icon: 'mdi-format-text',
              label: 'Jawaban Singkat',
              value: QuestionType.TEXT_FIELD
            },
            validation: {
              text: 'Bebas',
              value: TextfieldType.FREETEXT
            },
            options: [
              {
                text: '',
                value: ''
              }
            ],
            required: false,
            isImport: true
          });
        });

        this.dataLength = dataRows.length;
        this.data = dataRows.map((row: any) => {
          const result: any = {};
          row.forEach((value: any, index: number) => {
            result[this.headers[index].value] = value;
          });
          return result;
        });

        if (duplicateKeys.length > 0) {
          this.doEmptyTable();
          this.$store.dispatch('ui/showSnackbar', {
            message: `Gagal. Terdapat duplikasi nama kolom: ${duplicateKeys}`,
            color: 'error',
            timeout: 0
          });
        }
      };

      reader.readAsBinaryString(file);
    } else {
      this.doEmptyTable();
    }
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }

  async doImport(): Promise<void> {
    const importForm = this.$refs.importForm as VForm;
    if (importForm.validate()) {
      const formId = uuid.v1();
      const importId = uuid.v1();
      const newDate = new Date();
      const updatedAt = newDate.toISOString();
      const form = {
        uuid: formId,
        authorUuid: this.$store.state.user.currentUser.uuid,
        label: this.formLabel,
        description: '',
        imageBanner: undefined,
        createdAt: updatedAt,
        updatedAt: '',
        questionCount: this.headers.length,
        status: FormStatus.OPEN,
        link: `${process.env.VUE_APP_URL}/questionnaire/${formId}`,
        questions: [
          {
            title: 'Halaman ',
            sectionList: [
              {
                title: 'Bagian ',
                questionList: this.questions
              }
            ]
          }
        ],
        respondentCount: this.data.length,
        isImport: true,
        importId: importId
      };

      const listOfAnswers = this.data.map((data: any) => {
        return {
          uuid: uuid.v1(),
          formId: form.uuid,
          answers: data,
          submitDate: updatedAt,
          isImport: true,
          importId: importId
        };
      });

      this.dialog = false;
      this.isImportLoading = true;
      await this.$store.dispatch('form/updatePostponeNotification', true);
      await this.importAnswer(listOfAnswers);
      this.isImportLoading = false;

      this.$store.dispatch('form/saveForm', form).then(() => {
        this.$router.push('/dashboard/form');
      });
    } else {
      console.warn('Data is invalid!');
    }
  }

  async importAnswer(listOfAnswers: Respondent[]): Promise<void> {
    for (const answer of listOfAnswers) {
      if (this.importPercentage > 99) {
        await this.$store.dispatch('form/updatePostponeNotification', false);
      }
      await this.$store.dispatch('form/submitResponse', answer);
      this.importProgression++;
      this.importPercentage = (this.importProgression / this.dataLength) * 100;
    }
  }

  textfieldRules(questionNumber: number): any {
    return notEmptyRules(`Pertanyaan ${questionNumber}`);
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
.required >>> .v-messages__message::after {
  content: ' *';
  color: red;
}
</style>
