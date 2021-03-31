<template>
  <v-app>
    <Snackbar />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Snackbar from '@/components/Snackbar.vue';
import VueJsonToCsv from 'vue-json-to-csv';

Vue.component('vueJsonToCsv', VueJsonToCsv);

export default Vue.extend({
  name: 'App',

  components: {
    Snackbar
  }
});
</script>

<style lang="stylus">
.full-width {
  width: 100%;
}
</style>
