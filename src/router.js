import Vue from 'vue'
import Router from 'vue-router'
import Home from '../src/views/Home'
import Add from '../src/views/Add.vue'
import Details from '../src/views/Details.vue'
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
  {
    path: '/details',
    name: 'details',
    component: Details
  },
  // otherwise redirect to home
  {
    path: '*',
    component: NotFound
  }
  ]
})



export default router
