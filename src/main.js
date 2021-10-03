import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(VueRouter)

Vue.config.productionTip = false

import ClustersList from './components/clusters/ClustersList';
import WellsList from './components/wells/WellsList';
import BillsList from './components/bills/BillsList';
import BillAdd from './components/bills/BillAdd';
import MeasurementList from './components/measurements/MeasurementList';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import Import from './components/import/Import';


const routes = [
  { path: '/clusters', component: ClustersList },
  { path: '/wells', component: WellsList },
  { path: '/bills', component: BillsList },
  { path: '/bills/add', component: BillAdd },
  { path: '/measurements', component: MeasurementList },
  { path: '/reports', component: Reports },
  { path: '/settings', component: Settings },
  { path: '/import', component: Import }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')



