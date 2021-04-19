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
              <td>{{ item.answer }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form, Question, QuestionSection, QuestionPage } from '@/@types';
import { dateFormatter } from '@/@utils';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar }
})
export default class ResponsePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  tableData: any = [];

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
    const filteredRespondent: any = this.selectedForm.respondents.filter(
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
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
