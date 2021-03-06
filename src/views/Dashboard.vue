<template>
  <v-layout>
    <v-navigation-drawer clipped permanent>
      <v-list>
        <div v-for="(item, index) in menuItems" :key="index">
          <v-list-item :to="item.to" router exact>
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
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '@/@types';
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
  menuItems: any = [
    {
      icon: 'mdi-view-dashboard',
      title: 'Beranda',
      to: '/'
    },
    {
      icon: 'mdi-format-list-bulleted-type',
      title: 'Produk',
      to: '/product'
    },
    {
      icon: 'mdi-credit-card-clock-outline',
      title: 'Riwayat Deposit',
      to: '/deposit'
    },
    {
      icon: 'mdi-swap-vertical-bold',
      title: 'Transaksi',
      to: '/transaction'
    },
    {
      icon: 'mdi-clipboard-text-multiple',
      title: 'Laporan',
      items: [{ title: 'Penjualan', to: '/report/DownloadReportPage' }]
    },
    {
      icon: 'mdi-account-key',
      title: 'Pengaturan Akses',
      to: '/ops'
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
    await this.getUserList();
    await console.warn('Check userList', this.userList);
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
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
