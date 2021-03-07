<template>
  <div class="profile">
    <v-card max-width="500" class="mx-auto mt-10">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="profile.imgUrl" alt="John" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ profile.displayName }}</v-list-item-title>
            <v-list-item-subtitle>{{ profile.role }} | {{ profile.username }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="$vuetify.theme.dark"></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ languageSetting.darkMode }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="changeLanguage">
          <v-list-item-action>
            <v-switch :value="lang"></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ languageSetting.enableBahasa }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User } from '@/@types';

@Component
export default class ProfilePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  fav: boolean = false;
  lang: boolean = false;

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get profile(): User {
    return this.$store.state.user.currentUser;
  }

  get languageSetting(): ProfilePage {
    return this.$store.state.i18n.languageSetting.profilePage;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    this.lang = this.$store.state.i18n.isBahasaIndonesia;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  changeLanguage(): void {
    this.$store.dispatch('i18n/changeLanguage', this.$store.state.i18n.isBahasaIndonesia ? 'EN' : 'ID');
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('$store.state.i18n.isBahasaIndonesia')
  async handleOnLanguageChange(newValue: boolean): Promise<void> {
    this.lang = newValue;
  }
}
</script>
