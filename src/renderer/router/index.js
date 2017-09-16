import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main')
    },
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/credentials',
      name: 'credentials',
      component: require('@/components/Credentials')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
