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
      </div>
    </v-flex>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Pengaturan Form
        </v-card-title>

        <v-card-text class="my-2">
          <div>
            Atur pertanyaan untuk setiap kolom atau Anda bisa langsung dengan pertanyaan seperti judul kolom dari tabel
            pratinjau
          </div>
          <div>
            <v-form ref="importForm" v-model="valid" lazy-validation>
              <div v-for="(questionItem, index) in questions" :key="`${index + 1}-column`">
                <!-- {{ questionItem }} -->
                <v-text-field
                  v-model="questions[index].text"
                  clearable
                  type="text"
                  autocomplete="off"
                  persistent-hint
                  :hint="`Kolom nomor ${index + 1}.`"
                  :rules="textfieldRules()"
                  :disabled="isLoading"
                  :loading="isLoading"
                ></v-text-field>
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
          <v-btn color="primary" @click="doImport()">
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { dateFormatter } from '@/@utils';
import { VForm, Question, QuestionType, FormStatus, TextfieldType } from '@/@types';
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
  headers: any = [];
  questions: Question[] = [];
  items: any = [];

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
  mounted(): void {
    console.warn('Ready to rock!');
  }

  onChange(event: any) {
    if (event) {
      console.warn('event', event);
      const file = event;
      this.file = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        });

        const parsedXlsx = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { header: 1 });
        const parsedXlsxLength = parsedXlsx.length;
        const headerRows: any[] = parsedXlsx.slice(0, 2);
        const dataRows = parsedXlsx.slice(2, parsedXlsxLength);

        let currentHeader = '';
        let totalLength = 0;

        if (headerRows[0].length > headerRows[1].length) {
          totalLength = headerRows[0].length;
        } else {
          totalLength = headerRows[1].length;
        }

        for (let index = 0; index < totalLength; index++) {
          if (headerRows[0][index]) {
            currentHeader = headerRows[0][index];
            if (headerRows[1][index]) {
              const modifiedHeader = `[${currentHeader}] ${headerRows[1][index]}`;
              const modifiedKey = modifiedHeader.toLowerCase().replace(/\s/g, '');
              this.headers.push({ text: modifiedHeader, value: modifiedKey });
              this.questions.push({
                key: modifiedKey,
                text: modifiedHeader,
                tableHeader: modifiedHeader,
                type: {
                  icon: 'mdi-format-text',
                  label: 'Jawaban Singkat',
                  value: QuestionType.TEXT_FIELD
                },
                validation: {
                  text: 'Bebas',
                  value: TextfieldType.FREETEXT
                },
                required: false,
                isImport: true
              });
            } else {
              const modifiedKey = currentHeader.toLowerCase().replace(/\s/g, '');
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
                required: false,
                isImport: true
              });
            }
          } else {
            const modifiedHeader = `[${currentHeader}] ${headerRows[1][index]}`;
            const modifiedKey = modifiedHeader.toLowerCase().replace(/\s/g, '');
            this.headers.push({ text: modifiedHeader, value: modifiedKey });
            this.questions.push({
              key: modifiedKey,
              text: modifiedHeader,
              tableHeader: modifiedHeader,
              type: {
                icon: 'mdi-format-text',
                label: 'Jawaban Singkat',
                value: QuestionType.TEXT_FIELD
              },
              validation: {
                text: 'Bebas',
                value: TextfieldType.FREETEXT
              },
              required: false,
              isImport: true
            });
          }
        }

        this.data = dataRows.map((row: any) => {
          const result: any = {};
          row.forEach((value: any, index: number) => {
            result[this.headers[index].value] = value;
          });
          return result;
        });

        console.warn('this.headers', this.headers);
        console.warn('this.data', this.data);
        console.warn('dataRows', dataRows);

        workbook.SheetNames.forEach(function(sheetName) {
          console.warn('sheetName', sheetName);
        });
      };

      reader.readAsBinaryString(file);
    } else {
      this.file = null;
      this.excelFile = null;
      this.data = [];
      this.headers = [];
      this.items = [];
    }
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }

  doImport(): void {
    const importForm = this.$refs.importForm as VForm;
    if (importForm.validate()) {
      const formId = uuid.v1();
      const importId = uuid.v1();
      const newDate = new Date();
      const updatedAt = newDate.toISOString();
      const form = {
        uuid: formId,
        authorUuid: this.$store.state.user.currentUser.uuid,
        label: this.file.name,
        description: '',
        imageBanner: undefined,
        createdAt: updatedAt,
        updatedAt: '',
        questionCount: this.headers.length,
        status: FormStatus.OPEN,
        link: `${process.env.VUE_APP_URL}/questionnaire/${formId}`,
        questions: [
          {
            title: '',
            sectionList: [
              {
                title: '',
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

      listOfAnswers.forEach((answer: any) => {
        this.$store.dispatch('form/submitResponse', answer);
      });

      this.$store.dispatch('form/saveForm', form).then(() => {
        this.$router.push('/dashboard/form');
      });

      console.warn('listOfAnswers', listOfAnswers);
    } else {
      console.warn('Data is invalid!');
    }
  }

  textfieldRules(): any {
    notEmptyRules('Pertanyaan ini');
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
