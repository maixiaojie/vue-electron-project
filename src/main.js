import Vue from 'vue'
import {
  Button, Tabs, Radio, Col,
  Row, Table, Tag, Icon, Divider, message,
  Modal, Popconfirm, Popover,
  Dropdown, Menu,
} from 'ant-design-vue'
import { is_app } from '@/utils/env.js'
import storage from '@/plugin/storage.js'
import { getElectron, getRemote, getIpcRenderer } from '@/plugin/remote'
import App from './App.vue'
import router from './router'
import store from './store'

if (is_app) {
  const electron = getElectron()
  const ipcRenderer = getIpcRenderer()
  Vue.prototype.$remote = getRemote();
  Vue.prototype.$ipcRenderer = ipcRenderer
  Vue.prototype.$storage = storage;
  Vue.prototype.$electron = electron;

  // fix for electron-better-ipc
  // from https://github.com/sindresorhus/electron-better-ipc/issues/35
  if (ipcRenderer !== undefined) {
    ipcRenderer.addListener(
      'fix-event-79558e00-29ef-5c7f-84bd-0bcd9a0c5cf3',
      () => { }
    );
  }
}
Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;
Vue.use(Button);
Vue.use(Tabs);
Vue.use(Radio);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Popconfirm);
Vue.use(Divider);
Vue.use(Popover);
Vue.use(Dropdown);
Vue.use(Menu);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
