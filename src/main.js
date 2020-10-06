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

const router = new VueRouter({routes: routes})
router.beforeEach((to, from, next)=>{
  const requiresAuth = to.matched.some(x=>x.meta.requiresAuth)
  if(requiresAuth === true && store.state.user.loggedIn === false) {
    next('/login')
  } else {
    next()
  }
})

var app = '';
firebase.auth().onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
  if(!app) {
    app = new Vue({
      store,
      router: router,
      render: h => h(App),
    }).$mount('#app')
  }
});