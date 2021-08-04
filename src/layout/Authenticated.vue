<template>
  <v-app>
    <AppBar />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar }
})
export default class AuthenticatedLayout extends Vue {
  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    if (this.$store.state.user.currentUser.role !== 'admin') {
      this.$router.push('/forbidden');
    }
  }
}
</script>
