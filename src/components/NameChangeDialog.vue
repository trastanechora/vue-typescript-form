<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Ubah Nama</v-toolbar>
        <v-card-text>
          <v-flex xs12>
            <v-text-field
              v-model="name"
              outlined
              clearable
              label="Nama Bagian"
              type="text"
              autocomplete="off"
              class="required mt-4"
              :rules="notEmpty('Nama Bagian')"
              :disabled="isLoading || auto"
              :loading="isLoading"
              hide-details
            ></v-text-field>
          </v-flex>
          <v-checkbox v-model="auto" label="Gunakan Penamaan Otomatis"></v-checkbox>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Batal</v-btn>
          <v-btn text @click="saveName">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { notEmptyRules } from '@/@utils';
import { QuestionSection } from '@/@types';

@Component
export default class ImagePreview extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;
  @Prop({ required: true, type: Object })
  readonly selectedSection!: QuestionSection;
  @Prop({
    required: false,
    type: Function,
    default() {
      return true;
    }
  })
  readonly closeDialog!: FunctionConstructor;
  @Emit('save')
  save(section: QuestionSection): QuestionSection {
    return section;
  }

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  name: string = '';
  auto: boolean = true;

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  saveName(): void {
    const editedSection = { ...this.selectedSection };
    editedSection.title = this.name;
    if (this.auto) {
      editedSection.customTitle = false;
    } else {
      editedSection.customTitle = true;
    }
    this.save(editedSection);
  }
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('dialog')
  async handleOnLoad(newValue: boolean): Promise<void> {
    if (newValue) {
      this.name = this.selectedSection.title;
      if (this.selectedSection.customTitle) {
        this.auto = false;
      } else {
        this.auto = true;
      }
    } else {
      this.name = '';
      this.auto = true;
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
