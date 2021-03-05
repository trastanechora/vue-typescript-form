<template>
  <v-layout class="px-10 mt-10">
    <v-flex v-for="(item, index) in voteList" :key="index" class="px-2">
      <v-hover v-slot="{ hover }">
        <v-card class="mx-auto" color="grey lighten-4" max-width="600">
          <v-img :aspect-ratio="16 / 9" src="https://cdn.vuetifyjs.com/images/cards/kitchen.png">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                style="height: 100%;"
              >
                Vote!
              </div>
            </v-expand-transition>
          </v-img>
          <v-card-text class="pt-6" style="position: relative;">
            <v-btn absolute color="orange" class="white--text" fab large right top>
              Vote!
            </v-btn>
            <div class="font-weight-light grey--text title mb-2">
              For the perfect meal
            </div>
            <h3 class="display-1 font-weight-light orange--text mb-2">
              QW cooking utensils
            </h3>
            <div class="font-weight-light title mb-2">
              Our Vintage kitchen utensils delight any chef.<br />
              Made of bamboo by hand
            </div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MobileAppBar extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  voteList: string[] = ['Angular', 'React', 'Vue', 'Svelte'];
}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
}
</style>
