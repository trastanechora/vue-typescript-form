<template>
  <v-layout wrap class="full-width">
    <v-flex xs12 class="mb-4">
      <h1 class="text-center primary--text mb-2">Selamat Datang</h1>
      <h4 class="text-center">Pilih menu dari Navigasi untuk menggunakan fitur Form atau Board</h4>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DashboardPage extends Vue {}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
