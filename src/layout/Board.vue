<template>
  <v-main class="overflow-hidden">
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BoardLayout extends Vue {}
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}
</style>
