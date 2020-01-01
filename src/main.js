import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './registerServiceWorker'
import VueRouter from 'vue-router'
import {routes} from './routes'
import App from './App.vue'
import firebase from 'firebase'

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueRouter)

var app = '';
firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      router: new VueRouter({routes: routes}),
      render: h => h(App)
    }).$mount('#app')
  }
});