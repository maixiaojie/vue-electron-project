import Vue from 'vue'
import { Button, Tabs, Radio, Col, Row, Table, Tag, Icon, Divider, message } from 'ant-design-vue'
import { is_app } from '@/utils/env.js'
import Storage from '@/plugin/storage.js'
import { getRemote, getIpcRenderer } from '@/plugin/remote'
import App from './App.vue'
import router from './router'
import store from './store'

if (is_app) {
  Vue.prototype.$remote = getRemote();
  Vue.prototype.$ipcRenderer = getIpcRenderer();
  Vue.prototype.$storage = new Storage();
}
Vue.prototype.$message = message;
Vue.use(Button);
Vue.use(Tabs);
Vue.use(Radio);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Divider);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
