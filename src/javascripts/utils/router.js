import Vue from 'vue';
import VueRouter from 'vue-router';
import joinlist from '../components/Joinlist.vue';
import Top from '../components/Top.vue';
import MyComponent from '../components/MyComponent';
import secret from '../components/SecretChat.vue';

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Top },
  { path: '/my', component: MyComponent },
  { path: '/Joinlist', component: joinlist },
  { path: '/secretchat', component: secret },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
