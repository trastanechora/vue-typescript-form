<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Edit Chart</v-toolbar>
        <v-card-text>
          <div class="mt-4">
            <v-form ref="editChartForm" v-model="valid" lazy-validation class="pa-0">
              <v-card-text>
                <v-layout row>
                  <v-flex lg12 sm12 xs12>
                    <v-text-field
                      v-model="label"
                      outlined
                      clearable
                      label="Nama Framework"
                      type="text"
                      autocomplete="off"
                      :rules="notEmpty('Nama Framework')"
                      :disabled="isLoading"
                      :loading="isLoading"
                    ></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12 xs12>
                    <v-text-field
                      v-model="value"
                      outlined
                      clearable
                      label="Popularitas"
                      type="text"
                      autocomplete="off"
                      :rules="notEmpty('Popularitas')"
                      :disabled="isLoading"
                      :loading="isLoading"
                    ></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12 xs12>
                    <v-text-field
                      v-model="color"
                      outlined
                      clearable
                      label="Warna pada Chart"
                      type="text"
                      autocomplete="off"
                      :rules="notEmpty('Warna chart')"
                      :disabled="isLoading"
                      :loading="isLoading"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="editChart">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { VForm, Chart } from '@/@types';
import { notEmptyRules } from '@/@utils';

@Component
export default class DialogChart extends Vue {
  /* ------------------------------------
  => Props declaration
  ------------------------------------ */
  @Prop({ required: true, type: Boolean })
  readonly dialog!: boolean;

  @Prop({ required: true, type: Object })
  readonly chart!: Chart;

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
  valid: boolean = true;
  label: string = '';
  value: number = 0;
  color: string = '';

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.chart.isLoading;
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
  editChart(): void {
    const editChartForm = this.$refs.editChartForm as VForm;
    if (editChartForm.validate()) {
      const data: Chart = {
        id: this.chart.id,
        label: this.label,
        value: this.value,
        color: this.color
      };
      this.$store.dispatch('chart/updateChartData', data).then(() => {
        this.closeDialog();
      });
    }
  }

  notEmpty(identifier: string): any[] {
    return notEmptyRules(identifier);
  }

  /* ------------------------------------
  => Watcher
  ------------------------------------ */
  @Watch('dialog')
  async handleOnLoad(newValue: boolean): Promise<void> {
    if (newValue) {
      this.label = this.chart.label;
      this.value = this.chart.value;
      this.color = this.chart.color || 'black';
    }
  }
}
</script>
