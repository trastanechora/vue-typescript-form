<template>
  <v-snackbar v-model="snackbar" :timeout="snackTimeout" top right :color="snackbarColor">
    {{ snackbarMessage }}
    <template v-slot:action="{ attrs }">
      <v-btn id="closeButton" color="white" text v-bind="attrs" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Snackbar extends Vue {
  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get snackbar(): boolean {
    return this.$store.state.ui.snackbar.open;
  }

  set snackbar(value: boolean) {
    this.$store.dispatch('ui/clearSnackbar');
  }

  get snackbarMessage(): string {
    return this.$store.state.ui.snackbar.message;
  }

  get snackbarColor(): string {
    return this.$store.state.ui.snackbar.color;
  }

  get snackTimeout(): number {
    return this.$store.state.ui.snackbar.timeout;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  close(): void {
    this.$store.dispatch('ui/clearSnackbar');
  }
}
</script>
