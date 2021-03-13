<template>
  <v-layout class="my-6">
    <v-layout wrap class="full-width">
      <v-flex xs10 class="mb-4 mx-auto">
        <v-form ref="questionnaireForm" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="mb-3">
              {{ formData }}
            </v-flex>
            <v-flex xs12 class="mb-3">
              <v-card class="mx-auto" width="100%">
                <v-card-text>
                  <p class="display-1">
                    {{ formData.label }}
                  </p>
                  <p>{{ formData.description }}</p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 class="mb-3 question-item required">
              <v-card class="mx-auto" width="100%">
                <v-card-text>
                  <div><small>Jawaban Singkat</small></div>
                  <p class="headline">
                    Test Buat Form Baru
                  </p>
                  <p class="text--disabled mb-2">Ini adalah sebuah uji coba form karya anak bangsa!</p>
                  <v-layout>
                    <v-text-field
                      clearable
                      type="text"
                      autocomplete="off"
                      :rules="notEmpty('Jawaban ini')"
                      :disabled="isLoading"
                      :loading="isLoading"
                    ></v-text-field>
                  </v-layout>
                </v-card-text>
              </v-card>
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
export default class QuestionnairePage extends Vue {
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
    questions: [
      {
        title: 'Bagian ',
        questionList: []
      }
    ],
    respondents: []
  };

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.form.isLoading;
  }

  /* ------------------------------------
  => Createe (Lifecycle)
  ------------------------------------ */
  async created(): Promise<void> {
    await console.warn(this.$route.params.id);
    this.formData = this.$store.state.form.selectedForm;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    // await this.getFormData();
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
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
// Put red colored asterisk on required class
.required >>> .headline::after {
  content: ' *';
  color: red;
}
.question-item {
  p {
    margin-bottom: 0;
  }
}
</style>
