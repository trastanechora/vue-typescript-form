<template>
  <v-app-bar fixed app>
    <v-btn id="home-btn" text class="transform-none ma-2" to="/">
      <v-toolbar-title v-text="title" />
    </v-btn>
    <v-spacer />
    <v-btn v-if="isLogin" id="dashboard-btn" text class="transform-none ma-2" to="/dashboard">
      Admin Panel
    </v-btn>
    <v-btn id="switch-theme" depressed small fab class="transform-none ma-2" @click="switchTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-btn
      v-if="isLogin"
      id="account-btn"
      depressed
      rounded
      color="primary"
      class="transform-none ma-2"
      @click="logout"
    >
      <v-icon left>
        mdi-exit-to-app
      </v-icon>
      Keluar
    </v-btn>
    <v-btn v-else id="account-btn" depressed rounded color="primary" class="transform-none ma-2" to="/admin">
      <v-icon left>
        mdi-key-chain-variant
      </v-icon>
      Login Admin
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppBar extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  menu: boolean = false;
  drawer: boolean = false;
  title: string = 'Form App';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get languageSetting(): boolean {
    return this.$store.state.i18n.languageSetting.header;
  }

  get isLogin(): boolean {
    return this.$store.state.auth.isLogin;
  }

  get profilePictureUrl(): string {
    return this.$store.state.user.currentUser.imgUrl;
  }

  get roleUser(): string {
    return this.$store.state.user.currentUser.role;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  switchTheme(): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }

  switchLanguage(param: string): void {
    this.$store.dispatch('i18n/changeLanguage', param);
  }

  logout(): void {
    this.$store.dispatch('auth/logout').then(() => {
      this.$router.push('/admin');
    });
  }
}
</script>
<style lang="stylus" scoped>
.full-width {
  max-width: none;
}
.no-padding {
  padding: 0 !important;
}
.transform-none {
  text-transform: none;
  letter-spacing: inherit;
}
</style>
