// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
window.forgeurl = 'https://developer.api.autodesk.com';
window.apiurl = 'http://172.12.23.177'

Vue.use(ElementUI);
Vue.use(VueResource);
// 在ajax请求头部增加鉴权信息
Vue.http.interceptors.push(function(request, next) {
    request.headers.set('Authorization', "Bearer " + window.token);
    next(resp => resp);
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})