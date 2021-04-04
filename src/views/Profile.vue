<template>
  <div class="profile pt-10">
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
          <v-list-item-title>Mode Gelap</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
}
</script>
