<template>
  <v-layout>
    <v-card class="full-width">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Hasil Survey</v-toolbar-title>
      </v-toolbar>
      <v-tabs>
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          Pie Chart
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-lock
          </v-icon>
          Bar Chart
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-access-point
          </v-icon>
          Area Chart
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-flash
          </v-icon>
          Line Chart
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ChartPie />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ChartBar />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ChartArea />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ChartLine />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '@/@types';
import ChartPie from '@/components/ChartPie.vue';
import ChartBar from '@/components/ChartBar.vue';
import ChartArea from '@/components/ChartArea.vue';
import ChartLine from '@/components/ChartLine.vue';

@Component({
  components: {
    ChartPie,
    ChartBar,
    ChartArea,
    ChartLine
  }
})
export default class HomePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  isRegister: boolean = false;
  validLogin: boolean = true;
  showLoginPassword: boolean = false;
  validRegister: boolean = true;
  showRegisterPassword: boolean = false;
  // Login data
  loginUsername: string = '';
  loginPassword: string = '';
  // Register data
  registerUsername: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';

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
}
</script>

<style>
.full-width {
  width: 100%;
}
</style>
