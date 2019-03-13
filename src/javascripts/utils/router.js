import Vue from 'vue';
import VueRouter from 'vue-router';
import Joinlist from '../components/Joinlist.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/Joinlist', component: Joinlist },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
