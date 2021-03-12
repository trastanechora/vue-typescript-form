<template>
  <v-layout class="admin-container">
    <v-layout wrap class="admin-view full-width">
      <v-flex xs12 class="mb-4">
        <v-btn rounded color="primary" outlined to="/dashboard/add"> <v-icon left>mdi-plus</v-icon>Tambah Form </v-btn>
      </v-flex>
      <v-flex xs12> </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TableHeader, Form } from '@/@types';

@Component
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
    return this.$store.state.user.isLoading;
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
