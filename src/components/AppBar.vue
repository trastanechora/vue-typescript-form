<template>
  <v-app-bar fixed app>
    <v-btn id="home-btn" text class="ma-2" to="/dashboard" active-class="no-active">
      <v-toolbar-title v-text="title" />
    </v-btn>
    <v-btn v-if="isLogin" id="dashboard-btn" text class="ma-2" to="/dashboard/form" active-class="no-active">
      Form
    </v-btn>
    <v-btn v-if="isLogin" id="dashboard-btn" text class="ma-2" to="/dashboard/board" active-class="no-active">
      Board
    </v-btn>
    <v-btn v-if="isLogin" id="dashboard-btn" text class="ma-2" to="/dashboard/profile" active-class="no-active">
      Profil
    </v-btn>
    <v-spacer />
    <v-btn id="switch-theme" depressed small fab class="ma-2" @click="switchTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-menu v-if="isLogin" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn rounded color="primary" v-bind="attrs" class="text-none" v-on="on">
          <v-avatar v-if="currentUser.imgUrl" size="25" class="inherit-spacing">
            <img :src="currentUser.imgUrl" alt="profile-pic" />
          </v-avatar>
          <v-icon v-else left size="25" class="inherit-spacing"> mdi-account-circle </v-icon>
          <span v-if="currentUser.displayName !== ''" class="normal-spacing ml-2">{{ currentUser.displayName }}</span>
          <span v-else>User</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item id="do-logout" @click="logout">
          <v-list-item-action>
            <v-icon> mdi-exit-to-app </v-icon>
          </v-list-item-action>
          <v-list-item-title> Keluar </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else id="account-btn" depressed rounded color="primary" class="ma-2" to="/login">
      <v-icon left>
        mdi-key-chain-variant
      </v-icon>
      Login
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

  get currentUser(): string {
    return this.$store.state.user.currentUser;
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
      this.$router.push('/login');
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
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
.v-btn--active.no-active::before {
  opacity: 0 !important;
}
</style>
