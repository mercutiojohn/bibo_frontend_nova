import './registerServiceWorker'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(ElementUI)
    // Axios
import axios from 'axios'
Vue.prototype.$axios = axios;

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 50000,
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
});
Vue.prototype.$api = instance;

// qs
import qs from 'qs'
Vue.prototype.qs = qs;

// vue-router
import router from './router'

// Vuex
import store from './store'

// vue-lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    loading: require('./assets/images/video/bili-loading.png'), //加载中图片，一定要有，不然会一直重复加载占位图
    error: require('./assets/images/video/bili-fail.png') //加载失败图片
});

// Bus
Vue.prototype.$bus = new Vue();

// NativeShare
import NativeShare from 'nativeshare'
Vue.prototype.$share = new NativeShare();


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

Vue.config.productionTip = false