import Vue from 'vue'
import Router from 'vue-router'
import Home from '../src/views/Home'
import Faq from '../src/views/Faq.vue'
import NotFound from '../src/views/NotFound.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/faq',
    name: 'faq',
    component: Faq
  },
  // otherwise redirect to home
  {
    path: '*',
    component: NotFound
  }
  ]
})



export default router
