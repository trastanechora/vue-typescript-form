<template>
  <v-layout column>
    <!-- REGISTER FORM -->
    <v-card v-if="isRegister" class="mx-auto py-5 mt-10" max-width="600">
      <v-card-title class="primary--text px-7">
        Register
      </v-card-title>
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
        <v-btn
          color="primary"
          class="full-width transform-none"
          :disabled="isLoading || !validRegister"
          :loading="isLoading"
          @click="doRegister"
        >
          Daftar
        </v-btn>
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
      <v-card-title class="primary--text px-7">
        Login
      </v-card-title>
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
        <v-btn
          color="primary"
          class="full-width transform-none"
          :disabled="isLoading || !validLogin"
          :loading="isLoading"
          @click="doLogin"
        >
          Masuk
        </v-btn>
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
import { uuid } from 'vue-uuid';
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

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.auth.isLoading;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  // async mounted(): Promise<void> {
  //   await console.warn('this.isLoading', this.isLoading);
  //   await console.warn('this.$store.state.auth.isLoading', this.$store.state.auth);
  // }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
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

  doLogin(): void {
    const form = this.$refs.loginForm as VForm;
    if (form.validate()) {
      console.warn(uuid.v1());
      // this.$store
      //   .dispatch('auth/login', {
      //     username: this.loginUsername,
      //     password: this.loginPassword
      //   })
      //   .then(async () => {
      //     // await this.$router.push('/profile');
      //     form.reset();
      //   })
      //   .catch(err => {
      //     console.warn('failed to login:', err);
      //   });
    }
  }

  doRegister(): void {
    const form = this.$refs.registerForm as VForm;
    if (form.validate()) {
      this.$store
        .dispatch('auth/register', {
          username: this.registerUsername,
          password: this.registerPassword
        })
        .then(async () => {
          this.isRegister = false;
          form.reset();
        })
        .catch(err => {
          console.warn('failed to register:', err);
        });
    }
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }
}
</script>

<style lang="stylus" scoped>
.full-width {
  width: 100%;
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
.transform-none {
  text-transform: none;
  letter-spacing: normal;
}
</style>
