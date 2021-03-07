<template>
  <v-layout class="admin-container">
    <AdminDrawer />
    <v-layout v-if="show === 'data'" class="admin-view full-width">
      <v-data-table :headers="chartHeaders" :items="chartData" :items-per-page="10" class="elevation-1 full-width">
        <template v-slot:[`item.userAction`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :loading="isLoading"
                :disabled="isLoading"
                v-bind="attrs"
                v-on="on"
                @click="showChartEditDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout v-else class="admin-view">
      <v-data-table :headers="userHeaders" :items="userList" :items-per-page="10" class="elevation-1 full-width">
        <template v-slot:[`item.userAction`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :loading="isLoading"
                :disabled="isLoading"
                v-bind="attrs"
                v-on="on"
                @click="showEditDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :loading="isLoading"
                :disabled="isLoading"
                v-bind="attrs"
                v-on="on"
                @click="showDeleteDialog(item)"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template></v-data-table
      >
    </v-layout>
    <DialogUser :dialog="dialog" :type="dialogState" :user="selectedUser" :close-dialog="closeDialog" />
    <DialogChart :dialog="chartDialog" :chart="selectedChart" :close-dialog="closeDialog" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User, TableHeader, Chart } from '@/@types';
import ChartPie from '@/components/ChartPie.vue';
import AdminDrawer from '@/components/AdminDrawer.vue';
import DialogChart from '@/components/DialogChart.vue';
import DialogUser from '@/components/DialogUser.vue';

@Component({
  components: {
    AdminDrawer,
    DialogChart,
    DialogUser,
    ChartPie
  }
})
export default class DashboardPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  show: any = 'data';
  dialog: boolean = false;
  chartDialog: boolean = false;
  dialogState: string = '';
  selectedChart: Chart = {
    id: '',
    label: '',
    value: 0,
    color: ''
  };

  selectedUser: User = {
    uuid: '',
    username: '',
    displayName: '',
    role: '',
    voteGiven: false,
    voteValue: '',
    imgUrl: ''
  };

  chartHeaders: TableHeader[] = [
    { text: 'Framework Name', value: 'label' },
    { text: 'Popularity', value: 'value' },
    { text: 'Color', value: 'color' },
    {
      text: 'Tindakan',
      value: 'userAction',
      sortable: false
    }
  ];

  userHeaders: TableHeader[] = [
    { text: 'UUID', align: 'start', value: 'uuid', sortable: false },
    { text: 'Display Name', value: 'displayName' },
    { text: 'Username', value: 'username' },
    { text: 'role', value: 'role' },
    { text: 'voteGiven', value: 'voteGiven' },
    {
      text: 'Tindakan',
      value: 'userAction',
      sortable: false
    }
  ];

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.user.isLoading;
  }

  get userList(): User[] {
    return this.$store.state.user.userList;
  }

  get chartData(): Chart[] {
    return this.$store.state.chart.chartData;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    this.show = this.$route.query.show;
    await this.getUserList();
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  getUserList(): void {
    this.$store.dispatch('user/getUsers');
  }

  showEditDialog(user: User): void {
    this.selectedUser = user;
    this.dialog = true;
    this.dialogState = 'edit';
  }

  showDeleteDialog(user: User): void {
    this.selectedUser = user;
    this.dialog = true;
    this.dialogState = 'delete';
  }

  showChartEditDialog(chart: Chart): void {
    this.chartDialog = true;
    this.selectedChart = chart;
  }

  closeDialog(): void {
    this.dialog = false;
    this.chartDialog = false;
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('$route.query.show')
  async handleOnLoad(newValue: string): Promise<void> {
    this.show = newValue;
  }
}
</script>
<style>
.full-width {
  width: 100%;
}
.admin-container {
  height: 100vh;
  padding-left: 256px;
}
.admin-drawer {
  position: fixed;
  padding-top: 56px;
}
.admin-view {
  padding: 40px 20px;
}
</style>
