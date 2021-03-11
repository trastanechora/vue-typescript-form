<template>
  <v-layout>
    <v-card class="full-width">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Form</v-toolbar-title>
      </v-toolbar>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  isRegister: boolean = false;
  validLogin: boolean = true;
  showLoginPassword: boolean = false;
  validRegister: boolean = true;
  showRegisterPassword: boolean = false;
  // Login data
  loginUsername: string = '';
  loginPassword: string = '';
  // Register data
  registerUsername: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  // get isLoading(): boolean {
  //   return this.$store.state.user.isLoading;
  // }

  // get userList(): User[] {
  //   return this.$store.state.user.userList;
  // }
}
</script>
