import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store.js'

// HOT MODULE RELOADING
if (module.hot) {
    module.hot.accept()
}

// COMPONENTS
Vue.component('hello', require('./components/Hello.vue')) // TODO: Remove dummy component
Vue.component('top-menu', require('./components/Header/Header.vue'))
Vue.component('gallery-page', require('./components/Gallery/GalleryPage.vue'))
Vue.component('map-page', require('./components/Map/MapPage.vue'))

// ROUTER
Vue.use(VueRouter)

const routes = [
    { path: '/', component: require('./components/Gallery/GalleryPage.vue') },
    { path: '/gallery', component: require('./components/Gallery/GalleryPage.vue') },
    { path: '/map', component: require('./components/Map/MapPage.vue') }
]

const router = new VueRouter({
    routes
})

// VUE APP
new Vue({
    el: '#app',
    router,
    store,
    data: {
        message: 'Hello Vue!'
    }
})
