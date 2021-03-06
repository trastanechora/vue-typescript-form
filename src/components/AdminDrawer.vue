<template>
  <v-navigation-drawer clipped permanent class="admin-drawer">
    <v-list>
      <div v-for="(item, index) in menuItems" :key="index">
        <v-list-item @click="changeView(item.to)">
          <template>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </template>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppBar extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  menuItems: any = [
    {
      icon: 'mdi-view-dashboard',
      title: 'Beranda',
      to: 'data'
    },
    {
      icon: 'mdi-account-key',
      title: 'Pengaturan Akses',
      to: 'user'
    }
  ];

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  changeView(param: string): void {
    if (this.$route.query.show !== param) {
      this.$router.push(`/dashboard?show=${param}`);
    }
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
