import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  theme: {
    primary: colors.orange.darken2,
    secondary: colors.grey.darken3,
    accent: colors.orange.darken2,
    error: colors.red.darken1,
    warning: colors.yellow.darken2,
    info: colors.grey.darken3,
    success: colors.green.darken1,
  },
  options: {
    customProperties: true
  },
  iconfont: 'fa',
})
