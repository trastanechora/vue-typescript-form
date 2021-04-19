<template>
  <v-layout justify-center row wrap>
    <v-flex :class="`.d-xs-${isLoggedIn ? '12' : '6'}`">
      <div class="banner"></div>
      <v-card class="main-box py-10">
        <v-card-text>
          <v-layout row>
            <v-flex xs10 class="mx-auto mb-5">
              <h1 class="text-center primary--text">Selamat Datang</h1>
            </v-flex>
            <v-flex xs10 class="mx-auto">
              <v-text-field
                v-model="searchString"
                label="Kod Form"
                hint="Masukkan kod form Anda di sini"
                placeholder="048df450..."
                outlined
                clearable
                type="text"
                autocomplete="off"
                class="required full-width"
                :disabled="isLoading"
                :loading="isLoading"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout row class="mt-5">
            <v-flex xs10 class="mx-auto">
              <v-btn
                color="primary"
                class="full-width transform-none"
                :disabled="isLoading || !valid"
                :loading="isLoading"
                @click="search"
              >
                Cari Form
              </v-btn>
            </v-flex>
            <v-flex v-if="isLoggedIn" xs10 class="my-2 mx-auto text-end">
              <v-btn
                text
                small
                color="secondary"
                :disabled="isLoading"
                :loading="isLoading"
                class="ml-2"
                @click="checkAuth"
                ><v-icon small>mdi-plus</v-icon>Buat Form</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex v-if="!isLoggedIn" xs6>
      <v-layout column>
        <!-- REGISTER FORM -->
        <v-card v-if="isRegister" class="mx-auto py-5 mt-10" max-width="600" flat>
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
              <v-flex xs11 class="mx-auto mb-4">
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
        <v-card v-else class="mx-auto mt-16 py-5" max-width="600" flat>
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
              <v-flex xs11 class="mx-auto mb-4">
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
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { notEmptyRules } from '@/@utils';
import { VForm } from '@/@types';

@Component
export default class HomePage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  // Left
  valid: boolean = true;
  searchString: string = '';
  // Right
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

  get isLoggedIn(): boolean {
    return this.$store.state.auth.isLogin;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
  search(): void {
    if (this.searchString) {
      this.$router.push(`/questionnaire/${this.searchString}`);
    }
  }
  checkAuth(): void {
    if (this.$store.state.auth.isLogin) {
      this.$router.push('/dashboard/form');
    } else {
      this.$router.push('/login');
    }
  }
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
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
// Put red colored asterisk on required class
.required >>> label::after {
  content: ' *';
  color: red;
}
.main-box {
  margin: -600px auto 0 auto;
  width: 70%;
  padding: 10px;
  opacity: 0.82;
  .v-card__text {
    padding-bottom: 0;
  }
}
.banner {
  background-image: url(https://picsum.photos/1920/1080?random)
  background-size: cover;
  width: 100%
  height: 100vh;
  opacity: 0.6;
}
</style>
