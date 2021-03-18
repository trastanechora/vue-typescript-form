<template>
  <v-layout column>
    <!-- REGISTER FORM -->
    <v-card v-if="isRegister" class="mx-auto py-5 mt-10" max-width="600">
      <!-- <v-card-title class="primary--text px-7">
        Register
      </v-card-title> -->
      <v-card-title class="primary--text center px-7 display-1">
        Register
      </v-card-title>
      <v-card-subtitle class="primary--text px-7">
        Anda perlu masuk untuk membuat form
      </v-card-subtitle>
      <v-card-text class="text--primary login-box-content px-7">
        <v-form ref="registerForm" v-model="validRegister" lazy-validation class="pa-0">
          <v-card-text>
            <v-layout row>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="registerUsername"
                  outlined
                  clearable
                  label="Username"
                  type="text"
                  autocomplete="off"
                  :rules="notEmpty('Username')"
                  :disabled="isLoading"
                  :loading="isLoading"
                ></v-text-field>
              </v-flex>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="registerDisplayName"
                  outlined
                  clearable
                  label="Display Name"
                  type="text"
                  autocomplete="off"
                  :rules="notEmpty('Display Name')"
                  :disabled="isLoading"
                  :loading="isLoading"
                ></v-text-field>
              </v-flex>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="registerPassword"
                  outlined
                  clearable
                  label="Password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  :append-icon="showRegisterPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  autocomplete="off"
                  :rules="notEmpty('Password')"
                  :disabled="isLoading"
                  :loading="isLoading"
                  @click:append="showRegisterPassword = !showRegisterPassword"
                ></v-text-field>
              </v-flex>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="confirmPassword"
                  outlined
                  clearable
                  label="Konfirmasi Password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  :append-icon="showRegisterPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  autocomplete="off"
                  :rules="notEmpty('Konfirmasi Password')"
                  :disabled="isLoading"
                  :loading="isLoading"
                  @click:append="showRegisterPassword = !showRegisterPassword"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7">
        <v-layout row class="mt-5">
          <v-flex xs11 class="mx-auto">
            <v-btn
              color="primary"
              class="full-width transform-none"
              :disabled="isLoading || !validRegister"
              :loading="isLoading"
              @click="doRegister"
            >
              Daftar
            </v-btn>
          </v-flex>
          <v-flex xs12 class="my-5 mx-auto text-start">
            <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
              ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
            >
          </v-flex>
        </v-layout>
      </v-card-actions>

      <v-card-actions class="px-7">
        <v-layout>
          <v-flex xs5 class="mt-3"><hr /></v-flex>
          <v-flex xs2><p class="mb-0 text-center">Atau</p></v-flex>
          <v-flex xs5 class="mt-3"><hr /></v-flex>
        </v-layout>
      </v-card-actions>

      <v-card-actions class="px-7">
        <v-btn
          text
          color="primary"
          class="transform-none mx-auto px-12"
          @click="changeFormType('login')"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Masuk ke Akun yang Sudah Ada
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- LOGIN FORM -->
    <v-card v-else class="mx-auto mt-10 py-5" max-width="600">
      <v-card-title class="primary--text center px-7 display-1">
        Masuk
      </v-card-title>
      <v-card-subtitle class="primary--text px-7">
        Anda perlu masuk untuk membuat form
      </v-card-subtitle>
      <v-card-text class="text--primary login-box-content px-7">
        <v-form ref="loginForm" v-model="validLogin" lazy-validation class="pa-0">
          <v-card-text>
            <v-layout row>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="loginUsername"
                  outlined
                  clearable
                  label="Username"
                  type="text"
                  autocomplete="off"
                  :rules="notEmpty('Username')"
                  :disabled="isLoading"
                  :loading="isLoading"
                ></v-text-field>
              </v-flex>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  v-model="loginPassword"
                  outlined
                  clearable
                  label="Password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  :append-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  autocomplete="off"
                  :rules="notEmpty('Password')"
                  :disabled="isLoading"
                  :loading="isLoading"
                  @click:append="showLoginPassword = !showLoginPassword"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7">
        <v-layout row class="mt-5">
          <v-flex xs11 class="mx-auto">
            <v-btn
              color="primary"
              class="full-width"
              :disabled="isLoading || !validLogin"
              :loading="isLoading"
              @click="doLogin"
            >
              Masuk
            </v-btn>
          </v-flex>
          <v-flex xs12 class="my-5 mx-auto text-start">
            <v-btn text small color="secondary" :disabled="isLoading" :loading="isLoading" class="ml-2" to="/"
              ><v-icon small>mdi-chevron-left</v-icon>Kembali ke Halaman Utama</v-btn
            >
          </v-flex>
        </v-layout>
      </v-card-actions>

      <v-card-actions class="px-7">
        <v-layout>
          <v-flex xs5 class="mt-3"><hr /></v-flex>
          <v-flex xs2><p class="mb-0 text-center">Atau</p></v-flex>
          <v-flex xs5 class="mt-3"><hr /></v-flex>
        </v-layout>
      </v-card-actions>

      <v-card-actions class="px-7">
        <v-btn
          text
          color="primary"
          class="transform-none mx-auto px-12"
          @click="changeFormType('register')"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Daftar Akun Baru
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VForm } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class LoginPage extends Vue {
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
  registerDisplayName: string = '';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.auth.isLoading;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  doLogin(): void {
    const form = this.$refs.loginForm as VForm;
    if (form.validate()) {
      this.$store
        .dispatch('auth/login', {
          username: this.loginUsername,
          password: this.loginPassword
        })
        .then(async () => {
          await this.$router.push('/dashboard');
          form.reset();
        });
    }
  }

  doRegister(): void {
    const form = this.$refs.registerForm as VForm;
    if (form.validate()) {
      this.$store
        .dispatch('auth/register', {
          username: this.registerUsername,
          displayName: this.registerDisplayName,
          password: this.registerPassword
        })
        .then(async () => {
          this.isRegister = false;
          form.reset();
        });
    }
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  changeFormType(type: string): void {
    const loginForm = this.$refs.loginForm as VForm;
    const registerForm = this.$refs.registerForm as VForm;
    if (type === 'login') {
      registerForm.reset();
      this.isRegister = false;
    } else {
      loginForm.reset();
      this.isRegister = true;
    }
  }
}
</script>

<style lang="stylus" scoped>
.full-width {
  width: 100%;
}
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
.v-image >>> .v-image__image--cover {
  background-size: contain;
}
.login-box-content {
  padding-bottom: 0;
  >>> .v-card__text {
    padding-bottom: 0;
  }
}
</style>
