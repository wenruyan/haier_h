import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import mixins from './mixins/'

import './utils/libs/fastclick-1.0.6.js';
import './utils/index'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// plugin
import './plugins/YDUI'
import './plugins/Mint'
// import './plugins/Mescroll'
// import './plugins/element'

// fa
import './assets/scss/font-awesome-4.7.0/scss/font-awesome.scss'

// customer SCSS
import './assets/scss/base.scss' // import vconsole
// Vue.use(ElementUI)
if (process.env && process.env.NODE_ENV != 'production') {
  let VConsole = require('vconsole/dist/vconsole.min.js') // vconsole
  let vConsole = new VConsole()
  console.log('vConsole:', vConsole)
}
window.FastClick.attach(document.body);

Vue.config.productionTip = false

Vue.mixin(mixins)

let userId = localStorage.getItem('userId')
let staffId = localStorage.getItem('staffId')
let userInfo = JSON.parse(localStorage.getItem('userInfo'))
let haierUserInfo = JSON.parse(localStorage.getItem('haierUserInfo'))
let fpUserInfo = JSON.parse(localStorage.getItem('fpUserInfo'))
let focusOpenId = localStorage.getItem('focusOpenId')
let token = localStorage.getItem('token')
let companyNo = localStorage.getItem('companyNo')
let haierPhone = localStorage.getItem('haierPhone')

store.commit('updateHaierUserInfo', haierUserInfo)
store.commit('updateFpUserInfo', fpUserInfo)
store.commit('updateHaierPhone', haierPhone)

if (userId) {
  store.commit('updateUserId', userId);
  store.commit('updateStaffId', staffId);
  store.commit('updateUserInfo', userInfo);
  store.commit("updateOpenId", focusOpenId);
  store.commit('updateToken', token);
  store.commit('updateCompanyNo', companyNo)
}
let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vue
