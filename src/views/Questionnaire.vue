<template>
  <v-layout>
    <v-layout wrap>test</v-layout>
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
.required >>> label::after {
  content: ' *';
  color: red;
}
.section-title {
  justify-content: left;
}
.form-actions {
  position: sticky;
  bottom: 40px;
  z-index: 10;
}
</style>
