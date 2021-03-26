<template>
  <v-app>
    <Snackbar />
    <v-main>
      <router-view />
    </v-main>
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
.admin-drawer {
  position: fixed;
  padding-top: 56px;
}
.admin-view {
  padding: 0 20px;
}
</style>
