<template>
  <v-layout wrap class="full-width pa-10">
    <v-flex xs12 class="mb-4 mx-2">
      <v-layout class="mb-2">
        <v-flex xs8>
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
        <v-flex xs4 class="text-right mt-5">
          <v-layout wrap>
            <v-flex xs12>
              <v-btn v-if="!isFilter" rounded small color="primary" outlined class="ml-2" @click="isFilter = true">
                <v-icon small left>mdi-filter</v-icon>Filter
              </v-btn>
              <v-btn v-else rounded small color="primary" outlined class="ml-2" @click="clearFilter">
                <v-icon small left>mdi-close</v-icon>Kosongkan Filter
              </v-btn>
              <vue-json-to-csv
                :json-data="respondentBody"
                :labels="respondentCSVHeader"
                :csv-title="`Daftar Responden ${selectedForm.label}`"
              >
                <v-btn rounded small color="primary" outlined class="ml-2">
                  <v-icon small left>mdi-download</v-icon>Export CSV</v-btn
                >
              </vue-json-to-csv>
            </v-flex>
            <v-flex xs12 v-if="isFilter" class="mt-6">
              <v-select
                v-model="activeFilterColumn"
                dense
                :items="respondentHeader"
                item-text="text"
                item-value="value"
                label="Filter berdasarkan"
                :disabled="isLoading"
                return-object
                :loading="isLoading"
              />
              <v-text-field
                v-model="filterString"
                dense
                clearable
                label="Teks filter"
                type="text"
                autocomplete="off"
                append-icon="mdi-magnify"
                :disabled="isLoading"
                :loading="isLoading"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-data-table
        :headers="respondentHeader"
        :items="respondentBody"
        :items-per-page="10"
        :loading="isLoading"
        :search="filterString"
        @click:row="onRowClick"
        class="elevation-1 full-width"
      >
      </v-data-table>
    </v-flex>
    <v-flex xs12 class="mt-6">
      <v-select
        v-model="currentColumnChart"
        :items="respondentHeader"
        item-text="text"
        item-value="value"
        label="Pilih Kolom"
        :disabled="isLoading"
        return-object
        :loading="isLoading"
      />
      <v-select
        v-model="selectedChart"
        :items="chartOptions"
        item-text="text"
        item-value="value"
        label="Pilih Model Chart"
        :disabled="isLoading"
        return-object
        :loading="isLoading"
      />
    </v-flex>
    <v-flex xs12 class="mt-2">
      <v-btn small rounded color="primary" outlined @click="generateChart" class="ml-2">
        <v-icon left small>mdi-plus</v-icon>Generate Chart
      </v-btn>
    </v-flex>
    <v-flex xs12>
      <ChartPie v-if="selectedChart && selectedChart.value === 'pie-chart'" />
      <ChartBar v-if="selectedChart && selectedChart.value === 'bar-chart'" />
      <ChartLine v-if="selectedChart && selectedChart.value === 'line-chart'" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { TableHeader, Form, Question, QuestionSection, QuestionPage } from '@/@types';
import { dateFormatter } from '@/@utils';
import AppBar from '@/components/AppBar.vue';
import ChartPie from '@/components/charts/ChartPie.vue';
import ChartBar from '@/components/charts/ChartBar.vue';
import ChartLine from '@/components/charts/ChartLine.vue';

@Component({
  components: { AppBar, ChartPie, ChartBar, ChartLine }
})
export default class ResponsePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  isFilter: boolean = false;
  respondentHeader: TableHeader[] = [];
  respondentBody: any = [];
  respondentCSVHeader: any = {};
  activeFilterColumn: any = null;
  filterString: string = '';
  currentColumnChart: any = null;
  selectedChart: any = null;
  chartOptions: any = [
    {
      text: 'Bar Chart',
      value: 'bar-chart'
    },
    {
      text: 'Line Chart',
      value: 'line-chart'
    },
    {
      text: 'Pie Chart',
      value: 'pie-chart'
    }
  ];

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
    this.activeFilterColumn = this.respondentHeader[0];
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
    this.selectedForm.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((questionSection: QuestionSection) => {
        questionSection.questionList.forEach((question: Question) => {
          newHeader.push({
            text: question.text,
            value: question.key,
            width: 250,
            align: 'center',
            filterable: false
          });
        });
      });
    });
    this.respondentHeader = newHeader;
  }
  createCSVHeader(): void {
    this.selectedForm.questions.forEach((questionPage: QuestionPage) => {
      questionPage.sectionList.forEach((quesitonSection: QuestionSection) => {
        quesitonSection.questionList.forEach((question: Question) => {
          this.respondentCSVHeader[`${question.key}`] = {
            title: question.text
          };
        });
      });
    });
  }
  createBody(): void {
    const newBody: any = [];
    this.selectedForm.respondents?.forEach((respondent: any) => {
      const parsedBody: any = {};
      Object.keys(this.respondentCSVHeader).forEach((key: string) => {
        if (respondent.answers[`${key}`]) {
          if (typeof respondent.answers[`${key}`] === 'object' && !respondent.answers[`${key}`].length) {
            parsedBody[`${key}`] = respondent.answers[`${key}`].name;
          } else {
            parsedBody[`${key}`] = respondent.answers[`${key}`];
          }
        } else {
          parsedBody[`${key}`] = '-';
        }
      });
      parsedBody.formId = this.selectedForm.uuid;
      parsedBody.respondentId = respondent.uuid;
      newBody.push(parsedBody);
    });
    this.respondentBody = newBody;
  }
  onRowClick(response: any): void {
    this.$router.push(`/dashboard/form/${response.formId}/${response.respondentId}`);
  }
  getSlotName(headerItem: any): string {
    return headerItem.value;
  }
  clearFilter(): void {
    this.isFilter = false;
    this.filterString = '';
  }
  generateChart(): void {
    const result: any = {};
    const columnName: string = this.currentColumnChart.value;
    const chartKeys = this.respondentBody.map((row: any) => {
      return row[`${columnName}`];
    });
    const uniqueChartKeys: (string | number)[] = [...new Set(chartKeys)] as (string | number)[];
    const sortedUniqueChartKeys: (string | number)[] = uniqueChartKeys.sort();
    console.warn('chartKeys', chartKeys);
    console.warn('sortedUniqueChartKeys', sortedUniqueChartKeys);
    const chartData: any = sortedUniqueChartKeys.map((key: string | number) => {
      result[`${key}`] = 0;
      chartKeys.forEach((item: string | number) => {
        if (key === item) {
          result[`${key}`]++;
        }
      });
      return {
        label: `${key}`,
        value: result[`${key}`]
      };
    });
    console.warn('chartData', chartData);
    this.$store.dispatch('chart/updateChartData', chartData);
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('activeFilterColumn')
  async handleFilterColumnChange(newValue: any): Promise<void> {
    this.respondentHeader.forEach((header: any, index: number) => {
      if (header.value === newValue.value) {
        this.respondentHeader[index].filterable = true;
      } else {
        this.respondentHeader[index].filterable = false;
      }
    });
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
