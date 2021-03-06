<template>
  <v-app>
    <AppBar />
    <Snackbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Snackbar from '@/components/Snackbar.vue';
import AppBar from '@/components/AppBar.vue';

export default Vue.extend({
  name: 'App',

  components: {
    Snackbar,
    AppBar
  }
});
</script>
