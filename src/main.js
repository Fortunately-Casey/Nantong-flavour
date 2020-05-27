import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/font/font.less";
import "lib-flexible/flexible.js";
import esriLoader from "esri-loader";
import Vant from "vant";
import Mint from "mint-ui";
import "mint-ui/lib/style.css";
import "vant/lib/index.css";
import "./assets/css/base.css";

Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(Mint);

// esriLoader.loadCss("https://js.arcgis.com/3.28/dijit/themes/tundra/tundra.css");
// esriLoader.loadCss("https://js.arcgis.com/3.28/esri/css/esri.css");

// esriLoader.loadScript({
//   dojoConfig: {
//     async: true,
//     packages: [{
//       location: "/static",
//       name: "static"
//     }]
//   },
//   url: "https://js.arcgis.com/3.28/"
// });
// esriLoader.loadCss("https://js.arcgis.com/3.19/dijit/themes/tundra/tundra.css");
// esriLoader.loadCss("https://js.arcgis.com/3.19/esri/css/esri.css");
// esriLoader.loadCss("/arcgis/arcgis_js_api/library/3.19/3.19/esri/css/esri.css");

esriLoader.loadScript({
  dojoConfig: {
    async: true,
    packages: [
      {
        location: "/static",
        name: "static"
      }
    ]
  },
  // url: "https://js.arcgis.com/3.19/init.js"
  url: "/static/arcgis/init.js"
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
