<template>
  <v-app-bar fixed app>
    <!-- <v-toolbar-title v-text="title" /> -->
    <v-btn id="home-btn" text class="transform-none ma-2" to="/">
      <v-toolbar-title v-text="title" />
    </v-btn>
    <v-spacer />
    <!-- <v-btn id="my-bookings-btn" text class="transform-none ma-2">
      {{ languageSetting.myBookings }}
    </v-btn>
    <v-btn id="services-btn" text class="transform-none ma-2">
      {{ languageSetting.services }}
    </v-btn>
    <v-btn id="about-us-btn" text class="transform-none ma-2">
      {{ languageSetting.aboutUs }}
    </v-btn>
    <v-btn id="contact-btn" text class="transform-none ma-2">
      {{ languageSetting.contact }}
    </v-btn> -->
    <v-btn id="about-us-btn" text class="transform-none ma-2" to="/vote">
      Vote
    </v-btn>
    <v-btn id="dashboard-btn" text class="transform-none ma-2" to="/dashboard">
      Dashbord
    </v-btn>
    <v-btn id="profile-btn" text class="transform-none ma-2" to="/profile">
      Profile
    </v-btn>
    <v-btn id="switch-theme" depressed small fab class="transform-none ma-2" @click="switchTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn id="language-menu" depressed small fab class="transform-none ma-2" v-bind="attrs" v-on="on">
          <v-icon>mdi-web</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-web</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ languageSetting.selectLang }}</v-list-item-title>
              <v-list-item-subtitle>{{ languageSetting.comingLang }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item id="language-en" link @click="switchLanguage('EN')">
            <v-list-item-title v-text="languageSetting.english"></v-list-item-title>
          </v-list-item>
          <v-list-item id="language-id" link @click="switchLanguage('ID')">
            <v-list-item-title v-text="languageSetting.bahasa"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-btn id="account-btn" depressed rounded color="primary" class="transform-none ma-2" to="/login">
      <v-icon left>
        mdi-account-circle
      </v-icon>
      {{ languageSetting.registerLogin }}
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
  title: string = 'Dev Survey';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get languageSetting(): boolean {
    return this.$store.state.ui.languageSetting.header;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  switchTheme(): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }

  switchLanguage(param: string): void {
    this.$store.dispatch('ui/changeLanguage', param);
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
