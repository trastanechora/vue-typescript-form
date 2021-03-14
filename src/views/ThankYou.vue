<template>
  <v-layout wrap class="my-6 full-width">
    <v-flex xs10 class="mt-10 mx-auto">
      <v-card class="mx-auto py-5" width="100%">
        <v-card-text>
          <h1 class="text-center primary--text">Terima Kasih</h1>
          <h4 class="text-center">Tanggapan Anda telah kami simpan.</h4>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs10 class="my-2 mx-auto text-end">
      <v-btn text small color="secondary" class="ml-2" to="/"
        ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ThankYouPage extends Vue {}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
