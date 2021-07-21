import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import '@/assets/css/base.css'

import VueScrollTo from 'vue-scrollto'
import infiniteScroll from 'vue-infinite-scroll'

import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Loading,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Avatar,
  Link,
  Row,
  Col,
  Tag,
  Popover
} from 'element-ui'

Vue.use(VueScrollTo)
Vue.use(infiniteScroll)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Avatar)
Vue.use(Link)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Popover)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service

Vue.config.productionTip = false

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
