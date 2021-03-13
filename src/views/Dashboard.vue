<template>
  <v-layout wrap class="admin-view full-width">
    <v-flex xs12 class="mb-4">
      <v-btn rounded color="primary" outlined to="/dashboard/add"> <v-icon left>mdi-plus</v-icon>Tambah Form </v-btn>
    </v-flex>
    <v-flex xs12>
      <v-data-table :headers="formHeaders" :items="formList" :items-per-page="10" class="elevation-1 full-width">
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
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TableHeader, Form } from '@/@types';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar }
})
export default class DashboardPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  formHeaders: TableHeader[] = [
    { text: 'Label', value: 'label' },
    { text: 'Jumlah Pertanyaan', value: 'questionCount' },
    { text: 'Jumlah Responden', value: 'respondentCount' },
    { text: 'Status', value: 'status' },
    { text: 'Batas Waktu', value: 'dueDate' },
    { text: 'Tanggal Dibuat', value: 'createdDate' },
    { text: 'Diedit Terakhir', value: 'updatedDate' },
    { text: 'Link', value: 'link' },
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
    return this.$store.state.form.isLoading;
  }

  get formList(): Form[] {
    return this.$store.state.form.formList;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  mounted(): void {
    // await this.getUserList();
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  getUserList(): void {
    this.$store.dispatch('user/getUsers');
  }
}
</script>
