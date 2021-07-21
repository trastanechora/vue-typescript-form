<template>
  <v-layout wrap class="full-width pa-10">
    <v-flex xs12 class="mb-4 mx-2">
      <v-layout class="mb-2">
        <v-flex xs12>
          <div>
            <small>Responden Detail</small>
          </div>
          <span class="display-1 primary--text">
            {{ selectedForm.label }}
          </span>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Pertanyaan
              </th>
              <th class="text-left">
                Jawaban
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.name">
              <td>{{ item.question }}</td>
              <td v-if="typeof item.answer === 'object' && !item.answer.length">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon small class="mr-0" color="primary" v-on="on" @click="download(item.answer)">
                      <v-icon small>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Unduh</span>
                </v-tooltip>
                <v-tooltip top v-if="item.answer && item.answer.type.substring(0, 5) === 'image'">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small class="mr-2" color="primary" v-on="on" @click="showPreview(item.answer)">
                      <v-icon small>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Lihat</span>
                </v-tooltip>
                {{ item.answer.name }}
              </td>
              <td v-else>{{ item.answer }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
    <ImagePreview :dialog="imagePreviewDialog" :image="imageLink" :close-dialog="closePreview" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form, Question, QuestionSection, QuestionPage } from '@/@types';
import { dateFormatter } from '@/@utils';
import AppBar from '@/components/AppBar.vue';
import ImagePreview from '@/components/ImagePreview.vue';

@Component({
  components: { AppBar, ImagePreview }
})
export default class ResponsePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  tableData: any = [];
  imagePreviewDialog: boolean = false;
  imageLink: string = '';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }
  get selectedForm(): Form {
    return this.$store.state.form.selectedForm;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    await this.$store.dispatch('form/getFormById', this.$route.params.formId);
    await this.createTableData();
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }
  createTableData(): void {
    const tableData: any = [];
    this.selectedForm.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((quesitonSection: QuestionSection) => {
        quesitonSection.questionList.forEach((question: Question) => {
          tableData.push({
            question: question.text,
            key: question.key
          });
        });
      });
    });
    const filteredRespondent: any = this.selectedForm.respondents?.filter(
      respondent => respondent.uuid === this.$route.params.respondentId
    );
    if (filteredRespondent.length > 0) {
      const answerObject = filteredRespondent[0].answers;
      tableData.forEach((question: any, index: number) => {
        if (answerObject[`${question.key}`]) {
          tableData[index].answer = answerObject[`${question.key}`];
        } else {
          tableData[index].answer = '-';
        }
      });
    }
    this.tableData = tableData;
  }
  download(blob: any) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = blob.name || 'download';

    // Click handler that releases the object URL after the element has been clicked
    // This is required for one-off downloads of the blob content
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };

    a.addEventListener('click', clickHandler, false);
    a.click();

    return a;
  }
  showPreview(blob: any): void {
    this.imageLink = URL.createObjectURL(blob);
    this.imagePreviewDialog = true;
  }
  closePreview(): void {
    this.imagePreviewDialog = false;
    this.imageLink = '';
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
