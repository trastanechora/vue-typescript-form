<template>
  <v-layout>
    <v-card class="mx-auto mt-10 py-5" max-width="600">
      <v-card-title class="primary--text px-7">
        Masukkan Kod Form
      </v-card-title>
      <v-card-text class="text--primary login-box-content px-7">
        <v-form ref="searchForm" v-model="valid" lazy-validation class="pa-0">
          <v-card-text>
            <v-layout row>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="searchString"
                  outlined
                  clearable
                  label="Kod From"
                  type="text"
                  autocomplete="off"
                  class="required"
                  :rules="notEmpty('Kod From')"
                  :disabled="isLoading"
                  :loading="isLoading"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7">
        <v-btn
          color="primary"
          class="full-width transform-none"
          :disabled="isLoading || !valid"
          :loading="isLoading"
          @click="search"
        >
          Cari
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { notEmptyRules } from '@/@utils';
import { VForm } from '@/@types';

@Component
export default class HomePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  valid: boolean = true;
  searchString: string = '';

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
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
  search(): void {
    const form = this.$refs.searchForm as VForm;
    if (form.validate()) {
      this.$router.push(`/questionnaire/${this.searchString}`);
    }
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
</style>
