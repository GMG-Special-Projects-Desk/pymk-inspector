import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'People You May Know Inspector',
      component: require('@/components/Main')
    },
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/summary',
      name: 'summary',
      component: require('@/components/Summary')
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: require('@/components/Sessions')
    },
    {
      path: '/sessions-people',
      name: 'sessions people',
      component: require('@/components/Sessions/SessionPeopleTable')
    },
    {
      path: '/people',
      name: 'people',
      component: require('@/components/People')
    },
    {
      path: '/credentials',
      name: 'credentials',
      component: require('@/components/Credentials')
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
