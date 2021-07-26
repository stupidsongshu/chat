import Vue from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import { getTokenKey, getUrlParams } from '../utils'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    component: Login
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next) => {
  const params = getUrlParams(window.location.href)
  const user = params.user || to.query.user

  const token = window.localStorage.getItem(getTokenKey(user as string))
  // console.log('router.beforeEach params:', params)
  // console.log('router.beforeEach:', to, from)
  // console.log('router.beforeEach user:', user)
  // console.log('router.beforeEach token:', token)
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
