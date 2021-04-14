<template>
  <v-layout wrap class="pa-10">
    <v-flex xs12 class="mb-4">
      <v-btn rounded color="primary" outlined @click="addForm"> <v-icon left>mdi-plus</v-icon>Tambah Form </v-btn>
    </v-flex>
    <v-flex xs12>
      <v-data-table
        :headers="formHeaders"
        :items="formList"
        :items-per-page="10"
        :loading="isLoading"
        class="elevation-1"
      >
        <template v-slot:[`item.label`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn text small color="primary" v-on="on" @click="toResponseList(item.uuid)">{{ item.label }}</v-btn>
            </template>
            <span>Lihat Responden</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            v-if="!checkDueDate(item.dueDate)"
            :color="statusColorFormatter(item.status)"
            class="ma-2"
            outlined
            small
          >
            <v-icon left x-small>
              {{ statusIconFormatter(item.status) }}
            </v-icon>
            {{ statusTextFormatter(item.status) }}
          </v-chip>
          <v-chip v-else :color="statusColorFormatter('ended')" class="ma-2" outlined small>
            <v-icon left x-small>
              {{ statusIconFormatter('ended') }}
            </v-icon>
            {{ statusTextFormatter('ended') }}
          </v-chip>
        </template>
        <template v-slot:[`item.dueDate`]="{ item }">
          {{ item.dueDate ? formatDate(item.dueDate) : '-' }}
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ item.updatedAt ? formatDate(item.updatedAt) : '-' }}
        </template>
        <template v-slot:[`item.link`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :loading="isLoading"
                :disabled="isLoading"
                v-bind="attrs"
                v-on="on"
                @click="copyToClipboard(item.link)"
              >
                <v-icon>mdi-share</v-icon>
              </v-btn>
            </template>
            <span>Salin Tautan</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.userAction`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon :loading="isLoading" :disabled="isLoading" v-bind="attrs" v-on="on" @click="editForm(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Ubah</span>
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
            <span>Hapus</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-flex>
    <DialogConfirmation :dialog="dialog" :close-dialog="closeDeleteDialog" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TableHeader, Form, FormStatus } from '@/@types';
import { dateFormatter, statusFormatter } from '@/@utils';
import DialogConfirmation from '@/components/DialogConfirmation.vue';

@Component({
  components: { DialogConfirmation }
})
export default class FormPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  dialog: boolean = false;
  formHeaders: TableHeader[] = [
    { text: 'Label', value: 'label', width: 300 },
    { text: 'Jumlah Pertanyaan', value: 'questionCount', align: 'center' },
    { text: 'Jumlah Responden', value: 'respondentCount', align: 'center' },
    { text: 'Status', value: 'status', align: 'center' },
    { text: 'Tanggal Mulai', value: 'startDate', width: 150, align: 'center' },
    { text: 'Batas Waktu', value: 'dueDate', width: 150, align: 'center' },
    { text: 'Tanggal Dibuat', value: 'createdAt', width: 150, align: 'center' },
    { text: 'Diedit Terakhir', value: 'updatedAt', width: 150, align: 'center' },
    { text: 'Link', value: 'link', align: 'center', sortable: false },
    {
      text: 'Tindakan',
      value: 'userAction',
      width: 150,
      align: 'center',
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
    this.$store.dispatch('form/getForms');
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }
  statusTextFormatter(status: FormStatus): string {
    return statusFormatter(status).text;
  }
  statusColorFormatter(status: FormStatus): string {
    return statusFormatter(status).color;
  }
  statusIconFormatter(status: FormStatus): string {
    return statusFormatter(status).icon;
  }
  checkDueDate(date: string): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    return today > dueDate;
  }
  copyToClipboard(text: string): void {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    this.$store.dispatch('ui/showSnackbar', {
      open: true,
      message: 'Link telah berhasil disalin!',
      color: 'dark',
      timeout: 4000
    });
  }
  toResponseList(uuid: string): void {
    this.$router.push(`/dashboard/form/${uuid}`);
  }
  async addForm(): Promise<void> {
    await this.$store.dispatch('form/updateEditState', false);
    this.$router.push('/dashboard/form/add-edit');
  }
  async editForm(item: Form): Promise<void> {
    await this.$store.dispatch('form/updateEditState', true);
    await this.$store.dispatch('form/updateSelectedForm', item);
    this.$router.push('/dashboard/form/add-edit');
  }
  async showDeleteDialog(item: Form): Promise<void> {
    await this.$store.dispatch('form/updateSelectedForm', item);
    this.dialog = true;
  }
  closeDeleteDialog(): void {
    this.dialog = false;
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
