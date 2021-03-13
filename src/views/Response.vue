<template>
  <v-layout wrap class="admin-view full-width">
    <v-flex xs12 class="mb-4 mx-2">
      <v-layout>
        <v-flex xs8>
          <div>
            <small>Daftar Responden</small>
          </div>
          <p class="display-1 primary--text">
            {{ selectedForm.label }}
          </p>
        </v-flex>
        <v-flex xs4 class="text-right">
          <div>
            <small>Jumlah Tanggapan</small>
          </div>
          <p class="display-1 primary--text">
            {{ selectedForm.respondentCount }}
          </p>
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
    await this.createBody();
    console.warn('header', this.respondentHeader);
    console.warn('body', this.respondentBody);
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
  createBody(): void {
    const newBody: any = [];
    this.selectedForm.respondents.forEach((respondent: any) => {
      newBody.push(respondent.answers);
    });
    this.respondentBody = newBody;
  }
  test(item: any): void {
    console.warn(item);
  }
}
</script>
