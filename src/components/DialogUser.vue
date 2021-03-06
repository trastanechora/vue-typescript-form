<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>{{ type === 'edit' ? 'Edit User' : 'Delete User' }}</v-toolbar>
        <v-card-text>
          <div v-if="type === 'edit'" class="mt-4">
            <v-form ref="editUserForm" v-model="valid" lazy-validation class="pa-0">
              <v-card-text>
                <v-layout row>
                  <v-flex lg12 sm12 xs12>
                    <v-text-field
                      v-model="displayName"
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
                </v-layout>
              </v-card-text>
            </v-form>
          </div>
          <div v-else class="mt-4">Are you Sure to delete the user?</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn v-if="type === 'edit'" text @click="editUser">Edit</v-btn>
          <v-btn v-else text @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { VForm, User } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class AppBar extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;

  @Prop({ required: true, type: String })
  readonly type!: string;

  @Prop({ required: true, type: Object })
  readonly user!: User;

  @Prop({
    required: false,
    type: Function,
    default() {
      return true;
    }
  })
  readonly closeDialog!: FunctionConstructor;

  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  displayName: string = '';
  valid: boolean = true;

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.user.isLoading;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  editUser(): void {
    const editUserForm = this.$refs.editUserForm as VForm;
    if (editUserForm.validate()) {
      const data: User = {
        ...this.user
      };
      data.displayName = this.displayName;
      this.$store.dispatch('user/editUser', data).then(() => {
        this.closeDialog();
      });
    }
  }

  deleteUser(): void {
    this.$store.dispatch('user/deleteUser', this.user).then(() => {
      this.closeDialog();
    });
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('dialog')
  async handleOnLoad(newValue: boolean): Promise<void> {
    if (newValue && this.type === 'edit') {
      this.displayName = this.user.displayName;
    }
  }
}
</script>
