<template>
  <v-layout class="admin-container">
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
    <v-layout v-if="show === 'data'" class="admin-view full-width">
      Chart!
    </v-layout>
    <v-layout v-else class="admin-view">
      <v-data-table :headers="headers" :items="userList" :items-per-page="10" class="elevation-1 full-width">
        <template v-slot:[`item.userAction`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon :loading="isLoading" :disabled="isLoading" v-bind="attrs" v-on="on" @click="showDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon :loading="isLoading" :disabled="isLoading" v-bind="attrs" v-on="on" @click="showDialog(item)">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template></v-data-table
      >
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User, TableHeader } from '@/@types';
import ChartPie from '@/components/ChartPie.vue';

@Component({
  components: {
    ChartPie
  }
})
export default class LoginPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  show: any = 'data';
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

  headers: TableHeader[] = [
    { text: 'UUID', align: 'start', value: 'uuid', sortable: false },
    { text: 'Display Name', value: 'displayName' },
    { text: 'Username', value: 'username' },
    { text: 'role', value: 'role' },
    { text: 'voteGiven', value: 'voteGiven' },
    {
      text: 'Tindakan',
      value: 'userAction',
      sortable: false
    }
  ];

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.user.isLoading;
  }

  get userList(): User[] {
    return this.$store.state.user.userList;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  async mounted(): Promise<void> {
    this.show = this.$route.query.show;
    await this.getUserList();
    console.warn('test', this.$route.query.show);
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  changeView(param: string): void {
    if (this.show !== param) {
      this.show = param;
      this.$router.push(`/dashboard?show=${param}`);
    }
  }

  getUserList(): void {
    this.$store
      .dispatch('user/getUsers')
      .then(async () => {
        console.warn('User list is ready!');
      })
      .catch(err => {
        console.warn('failed to login:', err);
      });
  }
}
</script>
<style>
.full-width {
  width: 100%;
}
.admin-container {
  height: 100vh;
  padding-left: 256px;
}
.admin-drawer {
  position: fixed;
  padding-top: 56px;
}
.admin-view {
  padding: 40px 20px;
}
</style>
