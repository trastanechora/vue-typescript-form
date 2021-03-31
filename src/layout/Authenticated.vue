<template>
  <v-app>
    <AppBar />
    <v-main class="ma-10">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar }
})
export default class AuthenticatedLayout extends Vue {}
</script>
