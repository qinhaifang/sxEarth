import Vue from "vue";
import Router from "vue-router";
const importFile = file => () => import(`../components/${file}.vue`);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "TransitionPage",
      component: importFile("TransitionPage")
    },
    {
      path: "/LoginView",
      name: "LoginView",
      component: importFile("LoginView")
    },
    {
      path: "/index",
      name: "IndexView",
      component: importFile("IndexView")
    },
    {
      path: "/index1",
      name: "IndexView1",
      component: importFile("IndexView1")
    }
  ]
});
