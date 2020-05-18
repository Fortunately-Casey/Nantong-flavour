import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login", //登录
    name: "login",
    meta: {
      requireAuth: true
    },
    component: resolve => require(["../views/login/Login.vue"], resolve)
  },
  {
    path: "/enterpriseMap", //企业地图
    name: "enterpriseMap",
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/enterprise-map/EnterpriseMap.vue"], resolve)
  },
  {
    path: "/enterpriseList", //企业列表
    name: "enterpriseList",
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/enterprise-list/EnterpriseList.vue"], resolve)
  },
  {
    path: "/enterpriseClaim", //企业认领
    name: "enterpriseClaim",
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/enterprise-claim/EnterpriseClaim.vue"], resolve)
  },
  {
    path: "/visitorPage", //游客页面
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/visitor-page/VisitorPage.vue"], resolve),
    children: [
      {
        path: "/",
        name: "default",
        redirect: "visitorMap"
      },
      {
        path: "/visitorPage/visitorMap", //游客地图
        name: "visitorMap",
        meta: {
          requireAuth: true
        },
        component: resolve =>
          require(["../views/visitor-page/map/Map.vue"], resolve)
      },
      {
        path: "/visitorPage/factoryList", //游客地图
        name: "factoryList",
        meta: {
          requireAuth: true
        },
        component: resolve =>
          require([
            "../views/visitor-page/enterprise-list/EnterpriseList.vue"
          ], resolve)
      }
    ]
  },
  {
    path: "/enterpriseDetail", //企业认领
    name: "enterpriseDetail",
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/enterprise-detail/EnterpriseDetail.vue"], resolve)
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
