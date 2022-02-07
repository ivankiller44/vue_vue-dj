import Vue from 'vue'
import VueSweetAlert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App.vue'

import vuetify from './plugins/vuetify'
import Vuetify from 'vuetify'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import router from './router'

import store from './store'

Vue.use(Vuetify)
Vue.use(BootstrapVue)
Vue.use(VueSweetAlert2)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
