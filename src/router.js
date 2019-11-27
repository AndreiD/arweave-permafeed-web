import Vue from 'vue'
import Router from 'vue-router'
import Home from '../src/views/Home'
import Add from '../src/views/Add.vue'
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
    path: '/add',
    name: 'add',
    component: Add
  },
  // otherwise redirect to home
  {
    path: '*',
    component: NotFound
  }
  ]
})



export default router
