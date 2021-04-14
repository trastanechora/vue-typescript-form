<template>
  <v-layout wrap class="full-width pa-10">
    <v-flex xs12 class="mb-4 mx-2">
      <v-layout class="mb-2">
        <v-flex xs10>
          <div>
            <small>Daftar Responden</small>
          </div>
          <span class="display-1 primary--text">
            {{ selectedForm.label }}
          </span>
          <br />
          <small
            >Jumlah Tanggapan: <span class="primary--text">{{ selectedForm.respondentCount }} </span></small
          >
        </v-flex>
        <v-flex xs2 class="text-right mt-5">
          <vue-json-to-csv
            :json-data="respondentBody"
            :labels="respondentCSVHeader"
            :csv-title="`Daftar Responden ${selectedForm.label}`"
          >
            <v-btn rounded color="primary" outlined> <v-icon left>mdi-download</v-icon>Export CSV</v-btn>
          </vue-json-to-csv>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-data-table
        :headers="respondentHeader"
        :items="respondentBody"
        :items-per-page="10"
        :loading="isLoading"
        class="elevation-1 full-width"
      >
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TableHeader, Form, Question, QuestionSection } from '@/@types';
import { dateFormatter } from '@/@utils';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar }
})
export default class ResponsePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  respondentHeader: TableHeader[] = [];
  respondentBody: any = [];
  respondentCSVHeader: any = {};

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
    await this.$store.dispatch('form/getFormById', this.$route.params.id);
    await this.createHeader();
    await this.createCSVHeader();
    await this.createBody();
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }
  createHeader(): void {
    const newHeader: any = [];
    this.selectedForm.questions.forEach((quesitonSection: QuestionSection) => {
      quesitonSection.questionList.forEach((question: Question) => {
        newHeader.push({
          text: question.text,
          value: question.key,
          width: 250,
          align: 'center'
        });
      });
    });
    this.respondentHeader = newHeader;
  }
  createCSVHeader(): void {
    this.selectedForm.questions.forEach((quesitonSection: QuestionSection) => {
      quesitonSection.questionList.forEach((question: Question) => {
        this.respondentCSVHeader[`${question.key}`] = {
          title: question.text
        };
      });
    });
  }
  createBody(): void {
    const newBody: any = [];
    this.selectedForm.respondents.forEach((respondent: any) => {
      const parsedBody: any = {};
      Object.keys(this.respondentCSVHeader).forEach((key: string) => {
        if (respondent.answers[`${key}`]) {
          parsedBody[`${key}`] = respondent.answers[`${key}`];
        } else {
          parsedBody[`${key}`] = '-';
        }
      });
      newBody.push(parsedBody);
    });
    this.respondentBody = newBody;
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
