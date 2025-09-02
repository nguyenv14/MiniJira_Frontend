import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueGoodTable', VueGoodTable);
});