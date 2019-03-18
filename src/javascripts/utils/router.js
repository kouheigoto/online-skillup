import Vue from 'vue';
import VueRouter from 'vue-router';
import Top from '../components/Top.vue';
import secret from '../components/SecretChat.vue';

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Top },
  { path: '/secretchat', component: secret },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
