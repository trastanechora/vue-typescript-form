<template>
  <v-layout class="admin-container">
    <v-layout wrap class="admin-view full-width">
      <v-flex xs10 class="mb-4 mx-auto">
        <v-form ref="addForm" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="mb-3">
              <h1>Buat Form Baru</h1>
              <hr />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="formData.label"
                label="Label Form"
                outlined
                clearable
                type="text"
                class="required"
                :rules="notEmpty('Label Form')"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="formData.description"
                label="Deskripsi Form"
                outlined
                clearable
                type="text"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 class="mb-3">
              <h1>List Pertanyaan</h1>
              <hr />
            </v-flex>
            <v-flex xs12>
              <v-btn rounded color="primary" outlined> <v-icon left>mdi-plus</v-icon>Tambah Pertanyaan </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form, FormStatus } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class AddFormPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  formData: Form = {
    uuid: '',
    label: '',
    description: '',
    createdDate: '',
    updatedDate: '',
    dueDate: '',
    respondentCount: 0,
    questionCount: 0,
    status: FormStatus.OPEN,
    link: '',
    questions: [],
    respondents: []
  };

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
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
}
</script>
<style lang="stylus" scoped>
// Put red colored asterisk on required class
.required >>> label::after {
  content: ' *';
  color: red;
}
</style>
