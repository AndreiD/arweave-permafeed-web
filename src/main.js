import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueFlashMessage from 'vue-flash-message';
import axios from "axios";

Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 6000,
    important: false
  }
});

window.Event = new Vue(); // global event

// axios config
axios.defaults.baseURL = 'http://localhost:5555/api';
axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem("token");
axios.defaults.headers.common['Accept'] = 'application/json';


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = "Sqoodle Admin Dashboard"
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
