<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Hapus Form</v-toolbar>
        <v-card-text>
          <div class="mt-4">Apakah Anda yakin untuk menghapus form ini?</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Batal</v-btn>
          <v-btn text @click="deleteForm">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DialogConfirmation extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;
  @Prop({
    required: false,
    type: Function,
    default() {
      return true;
    }
  })
  readonly closeDialog!: FunctionConstructor;

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  deleteForm(): void {
    this.$store.dispatch('form/deleteForm').then(() => {
      this.closeDialog();
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
