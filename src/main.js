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
// ***********************************************************************************************
// 部署时需要设置 axios.defaults.baseURL ，不使用代理。开发时代理使用这行会出现跨域问题
// axios.defaults.baseURL= process.env.SP_MANAGER_API
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
