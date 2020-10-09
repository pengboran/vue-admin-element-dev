import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control 权限控制 
import './plugins/element.js'

// 引入阿里图标库
import './assets/iconfont/iconfont.css'

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

// 所有组件继承vue的原型  在vue原型上加上$echarts 所有组件都可用
import echarts from 'echarts'
Vue.prototype.$echarts = echarts 

import moment from 'moment'
Vue.prototype.$moment = moment;//赋值使用

import components from './components/' //加载公共组件
Object.keys(components).forEach((key)=>{
  var name = key.toString()
  Vue.component(name,components[key]) // 全局注册
})

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),  
})
