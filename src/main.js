// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router/router.js'
import axios from "axios"
import httpAxios from "./utils/httpAxios.js"
Vue.prototype.$http=axios
// axios.defaults.baseURL="http://127.0.0.1:9801/"
axios.defaults.headers['Content-Type'] = 'application/json';
Vue.use(ElementUI)
Vue.use(httpAxios)
Vue.config.productionTip = false
Vue.prototype.$messag= Message
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
