import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './registerServiceWorker'
import VueRouter from 'vue-router'
import {routes} from './routes'
import App from './App.vue'
import firebase from 'firebase'
import store from './store';

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueRouter)

var app = '';
firebase.auth().onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
  if(!app) {
    app = new Vue({
      store,
      router: new VueRouter({routes: routes}),
      render: h => h(App),
    }).$mount('#app')
  }
});