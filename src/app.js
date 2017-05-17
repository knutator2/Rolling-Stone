import Vue from 'vue'

if (module.hot) {
  module.hot.accept()
}

Vue.component('hello', require('./components/Hello.vue'));

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
