<template>
  <v-layout column>
    <v-card class="mx-auto mt-10 py-10" max-width="600">
      <!-- <v-img
        class="white--text align-end login-box-logo"
        height="200px"
        :src="require(`~/assets/img/logo/alana.png`)"
      /> -->

      <v-card-text class="text--primary login-box-content px-7">
        <v-form ref="loginForm" v-model="valid" lazy-validation class="pa-0">
          <v-card-text>
            <v-layout row>
              <v-flex lg12 sm12 xs12>
                <v-text-field outlined clearable label="Username" type="text" autocomplete="off"></v-text-field>
              </v-flex>
              <v-flex lg12 sm12 xs12>
                <v-text-field
                  outlined
                  clearable
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  autocomplete="off"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7">
        <v-btn class="primary full-width transform-none">
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

      <!-- <v-card-actions class="px-7 pb-10 wrapper-action">
        <div id="my-signin2" data-onsuccess="onSignIn" @click="checkClick"></div>
      </v-card-actions> -->
      <v-card-actions class="px-7">
        <v-btn class="primary transform-none mx-auto px-12">
          Daftar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { LoginDataField, VForm } from '../../@types';
// import { notEmptyRules } from '../../@utils';
// declare const window: any;

// @Component({
//   layout: 'none'
// })
@Component
export default class LoginPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  showPassword: boolean = false;
  // valid: boolean = true;
  // clicked: boolean = false;
  // isFreeze: boolean = false;
  // loginData: LoginDataField = {
  //   username: {
  //     label: 'Username',
  //     value: null,
  //     required: true,
  //     rules: notEmptyRules('Username')
  //   },
  //   password: {
  //     label: 'Password',
  //     value: null,
  //     required: true,
  //     hide: true,
  //     rules: notEmptyRules('Password')
  //   }
  // };
  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  // async mounted(): Promise<void> {
  //   await this.insertGapiScript();
  // }
  /* ------------------------------------
  => Methods
  ------------------------------------ */
  // checkClick(): void {
  //   this.clicked = true;
  // }
  // insertGapiScript(): void {
  //   const script = document.createElement('script');
  //   script.src = 'https://apis.google.com/js/platform.js';
  //   script.onload = async () => {
  //     await this.initializeGoogleSignIn();
  //   };
  //   document.body.appendChild(script);
  // }
  // async initializeGoogleSignIn(): Promise<void> {
  //   await window.gapi.load('auth2', () => {
  //     window.gapi.auth2.init({
  //       client_id: process.env.GOOGLE_CLIENT_ID
  //     });
  //   });
  //   await window.gapi.load('signin2');
  //   this.renderButton();
  // }
  // renderButton(): void {
  //   window.gapi.signin2.render('my-signin2', {
  //     width: 260,
  //     scope: 'profile email',
  //     height: 50,
  //     longtitle: true,
  //     theme: 'dark',
  //     onsuccess: this.onSignIn
  //   });
  // }
  // doLogin(): void {
  //   this.isFreeze = true;
  //   const form = this.$refs.loginForm as VForm;
  //   if (form.validate()) {
  //     this.$store
  //       .dispatch('auth/doLogin', {
  //         username: this.loginData.username.value,
  //         password: this.loginData.password.value
  //       })
  //       .then(async () => {
  //         await this.$router.push(`${this.$route.query.route ? this.$route.query.route : '/'}`);
  //         form.reset();
  //       })
  //       .catch(err => {
  //         console.warn('failed', err);
  //       });
  //   }
  //   this.isFreeze = false;
  // }
  // onSignIn(googleUser: Unknown): void {
  //   if (this.clicked) {
  //     const idToken = googleUser.getAuthResponse().id_token;
  //     const form = this.$refs.loginForm as VForm;
  //     this.$store
  //       .dispatch('auth/doLogin', {
  //         idToken
  //       })
  //       .then(async () => {
  //         await this.$router.push(`${this.$route.query.route ? this.$route.query.route : '/'}`);
  //         form.reset();
  //       })
  //       .catch(err => {
  //         console.warn('failed >>', err);
  //       });
  //   }
  // }
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
}
#my-signin2 {
  >>> .abcRioButton {
    border-radius: 4px;
  }
  >>> .abcRioButtonIcon {
    border-radius: 4px;
  }
  margin: auto;
  >>> .abcRioButton {
    background-color: var(--v-primary-base)
  }
  >>> .abcRioButtonContentWrapper span {
    display: none;
  }
  >>> .abcRioButtonContentWrapper:after {
    content: 'Masuk dengan Google';
    padding-top: 11px;
    position: absolute;
    left: 70px;
    font-weight: 500;
  }
}
</style>
