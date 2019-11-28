import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import Provinces from './views/Provinces.vue'
import Stats from './views/Stats.vue'
import Maps from './views/Maps.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/users',
      name: "users",
      component: Users
    },
    {
      path: '/provinces',
      name: "provinces",
      component: Provinces
    },
    {
      path: '/stats',
      name: "stats",
      component: Stats
    },
    {
      path: '/maps',
      name: "maps",
      component: Maps
    }
  ]
})
