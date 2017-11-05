import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import axios from 'axios'
import VueElectronStorage from 'vue-electron-storage'
import vueMoment from 'vue-moment'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
Vue.use(VueLodash, lodash)

Vue.use(vueMoment)
Vue.use(Buefy)
Vue.use(VueElectronStorage)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
