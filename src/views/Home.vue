<template>
  <v-layout justify-center row wrap>
    <div class="banner"></div>
    <v-flex xs8>
      <v-card class="main-box py-10">
        <v-card-text>
          <v-layout row>
            <v-flex xs10 class="mx-auto mb-5">
              <h1 class="text-center primary--text">Selamat Datang</h1>
            </v-flex>
            <v-flex xs10 class="mx-auto">
              <v-text-field
                v-model="searchString"
                label="Kod Form"
                hint="Masukkan kod form Anda di sini"
                placeholder="048df450..."
                outlined
                clearable
                type="text"
                autocomplete="off"
                class="required full-width"
                :disabled="isLoading"
                :loading="isLoading"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout row class="mt-5">
            <v-flex xs10 class="mx-auto">
              <v-btn
                color="primary"
                class="full-width transform-none"
                :disabled="isLoading || !valid"
                :loading="isLoading"
                @click="search"
              >
                Cari Form
              </v-btn>
            </v-flex>
            <v-flex xs10 class="my-2 mx-auto text-end">
              <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/admin"
                ><v-icon small>mdi-plus</v-icon>Buat Form</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { notEmptyRules } from '@/@utils';

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
    if (this.searchString) {
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
.main-box {
  margin: -700px 0 0 0;
  padding: 10px;
  opacity: 0.82;
  .v-card__text {
    padding-bottom: 0;
  }
}
.banner {
  background-image: url(https://picsum.photos/1920/1080?random)
  background-size: cover;
  width: 100%
  height: 100vh;
  opacity: 0.6;
}
</style>
