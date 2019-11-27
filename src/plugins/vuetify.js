import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#03A9F4',
    secondary: '#2196F3',
    accent: '#ffc107',
    error: '#f44336',
    warning: '#ff5722',
    info: "#3f51b5",
    success: "#8bc34a"
  },
  options: {
    customProperties: true
  },
  iconfont: 'fa',
})
