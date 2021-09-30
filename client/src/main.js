import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
Vue.use(BootstrapVue)

Vue.config.productionTip = false
firebase.initializeApp({ apiKey: 'AIzaSyCyyuISTGS8m-6WWsi-m_o2bPSNFa8C-MY',
authDomain: 'sharedcalendar-f9ae0.firebaseapp.com',
projectId: 'sharedcalendar-f9ae0',
storageBucket: 'sharedcalendar-f9ae0.appspot.com',
messagingSenderId: '326352711813',
appId: '1:326352711813:web:0c0b5018c488b28ccc39ec',
measurementId: 'G-Y3CZHN6500'
})


new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
