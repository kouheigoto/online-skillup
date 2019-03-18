import '../css/base.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './utils/router';

new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<app />'
}).$mount('#app');
