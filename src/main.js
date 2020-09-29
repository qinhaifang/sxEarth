// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

import "../static/jquery-3d-circle-image-slider/js/jquery-1.7.1.min.js";

import Bus from "./bus/bus";
window.Bus = Bus;

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import axios from "axios";
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

// router.beforeEach((to, from, next) => {
//   // 判断是否有token
//   if(sessionStorage.getItem("token")){
//     next({ path: '/index' });
//   } else {
//     next({ path: '/' });
//   }
// });

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
