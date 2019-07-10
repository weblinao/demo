// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import VueWebp from 'vue-webp'

require('@cssPath/reset.less')
require('./assets/font-awesome/less/font-awesome.less')

Vue.config.productionTip = false
// Vue.use(VueWebp)

/* eslint-disable */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

