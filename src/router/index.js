import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "enterpriseMap"
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
    name: "visitorPage",
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(["../views/visitor-page/VisitorPage.vue"], resolve),
    children: [
      {
        path: "/visitorPage/enterpriseMap", //企业认领
        name: "visitorMap",
        meta: {
          requireAuth: true
        },
        component: resolve =>
          require(["../views/enterprise-map/EnterpriseMap.vue"], resolve)
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
