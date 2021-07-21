// This file exist only to make Vue works with Typescript
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vuetify/lib/framework' {
  import Vuetify from 'vuetify';
  export default Vuetify;
}

declare module 'vue-json-to-csv' {
  import VueJsonToCsv from 'vue-json-to-csv';
  export default VueJsonToCsv;
}

declare module 'vue-xlsx' {
  import * as VueXlsx from 'vue-xlsx/dist/vue-xlsx.es.js';
  export const { ...VueXlsx };
}
