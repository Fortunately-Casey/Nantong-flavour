<template>
  <div class="enterprise-map">
    <div class="top">
      <div class="search-icon"></div>
      <input
        type="text"
        placeholder="输入店铺名称搜索"
        v-model="companyName"
        @input="companyNameSearch"
        @blur="blur"
      />
      <div class="search-list" v-if="isShowSearchList">
        <div
          class="search-item"
          v-for="(item, index) in barList"
          :key="index"
          @click="choseCompany(item)"
        >{{ item.companyName }}</div>
      </div>
    </div>
    <div id="map">
      <div id="LocateButton" style="display:block" @click="locationTo"></div>
    </div>
    <van-action-sheet v-model="isShowEnterprise" :title="enterpriseName">
      <div class="content">
        <div class="box"></div>
        <div class="entry-button" @click="goToClaim">查看店铺</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
import { Indicator } from "mint-ui";
import * as api from "@/service/apiList";
import http from "@/service/service";
import { Notify } from "vant";
import { debounce, blur } from "@/common/tool/tool";
import LocationSdk from "@/common/location-sdk";
import blueloc from "@/assets/image/blue-loc.png";
export default {
  data() {
    return {
      companyName: "",
      isShowEnterprise: false,
      enterpriseName: "",
      location: {},
      map: {},
      isShowEntry: false,
      isShowGetEntry: false,
      id: "",
      isWatchCompanyName: true,
      barList: [],
      isShowSearchList: false
      // bodyHeight: ""
    };
  },
  created() {
    let vm = this;
    vm.$watch(
      "companyName",
      debounce((newValue, oldValue) => {
        if (!vm.isWatchCompanyName) {
          return;
        }
        Indicator.open();
        http
          .get(
            api.COMPANYLIST,
            {
              companyName: vm.companyName
            },
            vm
          )
          .then(resp => {
            Indicator.close();
            let res = resp.data.data;
            // console.log(res);
            let arr = [];
            for (var k in res) {
              arr = arr.concat(res[k]);
            }
            vm.barList = arr;
          });
      })
    );
  },
  mounted() {
    // this.bodyHeight = document.documentElement.clientHeight;
    let vm = this;
    Indicator.open();
    setTimeout(() => {
      this.getLocation();
    }, 2000);
    // this.createMap();
  },
  methods: {
    blur() {
      blur();
    },
    createMap() {
      let vm = this;
      esriLoader
        .loadModules([
          "esri/Basemap",
          "esri/Map",
          "esri/layers/TileLayer",
          "esri/layers/MapImageLayer",
          "esri/geometry/Point",
          "esri/views/MapView",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/PictureMarkerSymbol",
          "esri/layers/GraphicsLayer",
          "esri/Graphic",
          "esri/tasks/IdentifyTask",
          "esri/tasks/support/IdentifyParameters",
          "esri/tasks/support/Query",
          "esri/tasks/QueryTask",
          "esri/tasks/support/BufferParameters",
          "esri/geometry/SpatialReference",
          "esri/geometry/Circle"
        ])
        .then(function([
          Basemap,
          Map,
          TileLayer,
          MapImageLayer,
          Point,
          MapView,
          SimpleMarkerSymbol,
          PictureMarkerSymbol,
          GraphicsLayer,
          Graphic,
          IdentifyTask,
          IdentifyParameters,
          Query,
          QueryTask,
          BufferParameters,
          SpatialReference,
          Circle
        ]) {
          const dynamicLayer = new TileLayer({
            url: "/gis/arcgis/rest/services/NT/DLG_1000_201900/MapServer"
          });
          const imageLayer = new MapImageLayer({
            url: "/map/arcgis/rest/services/NTWD/NTWDMapService/MapServer"
          });
          const dynamicBasemap = new Basemap({
            baseLayers: [dynamicLayer],
            id: "dynamicLayer"
          });
          const myMap = new Map({
            basemap: dynamicBasemap
          });
          vm.map = myMap;
          myMap.add(imageLayer);
          // let point = new Point({
          //   x: 120.86448335647579,
          //   y: 32.00571294529357,
          //   spatialReference: {
          //     wkid: 4490
          //   }
          // });
          let point = new Point({
            x: Number(vm.location.longitude),
            y: Number(vm.location.latitude),
            spatialReference: {
              wkid: 4490
            }
          });
          const myView = new MapView({
            container: "map",
            map: myMap,
            zoom: 13,
            logo: false,
            slider: false
          });
          vm.view = myView;

          if (vm.$route.query.companyID) {
            http
              .get(api.COMPANYINFOBYTEMP, {
                companyID: vm.$route.query.companyID
              })
              .then(resp => {
                Indicator.close();
                if (resp.data.data) {
                  vm.enterpriseName = resp.data.data.companyName;
                  vm.id = resp.data.data.companyID;
                  let point1 = new Point({
                    x: Number(resp.data.data.longitude),
                    y: Number(resp.data.data.latitude),
                    spatialReference: {
                      wkid: 4490
                    }
                  });
                  vm.view.goTo({
                    target: point1,
                    zoom: 20
                  });
                }
              });
          } else {
            vm.view.goTo({
              target: point,
              zoom: 16
            });
          }
          var bluelocSymbol = new PictureMarkerSymbol(blueloc, 24, 26);
          var startPointGraphic = new Graphic(point, bluelocSymbol);
          let graphiclayer = new GraphicsLayer({
            id: "location"
          });
          graphiclayer.add(startPointGraphic);
          vm.map.add(graphiclayer);
          Indicator.close();
          vm.view.on("click", function(result) {
            var queryTask = new QueryTask({
              url: "/map/arcgis/rest/services/NTWD/NTWDMapService/MapServer/0"
            });
            var circle = new Circle(result.mapPoint, {
              radius: 40
            });
            var query = new Query({
              returnGeometry: true,
              where: "1=1",
              outFields: ["*"]
            });
            query.geometry = circle;
            query.distance = 20;
            queryTask.execute(query).then(resp => {
              if (resp.features[0]) {
                let params = {
                  companyID: resp.features[0].attributes.ID
                };
                http.get(api.COMPANYINFOBYTEMP, params).then(resp => {
                  Indicator.close();
                  if (resp.data.data) {
                    vm.enterpriseName = resp.data.data.companyName;
                    vm.id = resp.data.data.companyID;
                    vm.$router.push({
                      path: "/enterpriseDetail",
                      query: {
                        companyID: vm.id
                      }
                    });
                  }
                  console.log(resp.data.data);
                });
              } else {
                Indicator.close();
              }
            });
          });
        });
    },
    goToClaim() {
      this.$router.push({
        path: "/enterpriseDetail",
        query: {
          companyID: this.id
        }
      });
    },
    choseCompany(item) {
      let vm = this;
      this.companyName = item.companyName;
      this.isWatchCompanyName = false;
      this.isShowSearchList = false;
      esriLoader.loadModules(["esri/geometry/Point"]).then(function([
        Point
        // ClusterLayer
      ]) {
        let pointer2 = new Point({
          x: Number(item.longitude),
          y: Number(item.latitude),
          spatialReference: {
            wkid: 4490
          }
        });
        vm.view.goTo({
          target: pointer2,
          zoom: 20
        });
      });
    },
    companyNameSearch() {
      if (!this.companyName !== "") {
        this.isWatchCompanyName = true;
      }
    },
    goToEnterpriseList() {
      this.$router.push({
        path: "/enterpriseList"
      });
    },
    getLocation() {
      let vm = this;
      LocationSdk.getLocation({
        success: res => {
          vm.location = res;
          vm.createMap();
        },
        error: res => {
          Notify({
            type: "primary",
            message: "获取定位失败" + ":" + JSON.stringify(res)
          });
          // alert(JSON.stringify(res));
          self.location = {
            longitude: "-1",
            latitude: "-1"
          };
        }
      });
    },
    locationTo() {
      let vm = this;
      LocationSdk.getLocation({
        success: res => {
          vm.location = res;
          esriLoader
            .loadModules([
              "esri/Basemap",
              "esri/Map",
              "esri/layers/TileLayer",
              "esri/layers/MapImageLayer",
              "esri/geometry/Point",
              "esri/views/MapView",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/PictureMarkerSymbol",
              "esri/layers/GraphicsLayer",
              "esri/Graphic",
              "esri/tasks/IdentifyTask",
              "esri/tasks/support/IdentifyParameters",
              "esri/tasks/support/Query",
              "esri/tasks/QueryTask",
              "esri/tasks/support/BufferParameters",
              "esri/geometry/SpatialReference",
              "esri/geometry/Circle"
            ])
            .then(function([
              Basemap,
              Map,
              TileLayer,
              MapImageLayer,
              Point,
              MapView,
              SimpleMarkerSymbol,
              PictureMarkerSymbol,
              GraphicsLayer,
              Graphic,
              IdentifyTask,
              IdentifyParameters,
              Query,
              QueryTask,
              BufferParameters,
              SpatialReference,
              Circle
            ]) {
              let point = new Point({
                x: Number(vm.location.longitude),
                y: Number(vm.location.latitude),
                spatialReference: {
                  wkid: 4490
                }
              });
              let layer = vm.map.findLayerById("location");
              vm.map.remove(layer);
              var bluelocSymbol = new PictureMarkerSymbol(blueloc, 24, 26);
              var startPointGraphic = new Graphic(point, bluelocSymbol);
              let graphiclayer = new GraphicsLayer({
                id: "location"
              });
              graphiclayer.add(startPointGraphic);
              vm.map.add(graphiclayer);
              vm.view.goTo({
                target: point,
                zoom: 16
              });
            });
        },
        error: res => {
          Notify({
            type: "primary",
            message: "获取定位失败" + ":" + JSON.stringify(res)
          });
          self.location = {
            longitude: "-1",
            latitude: "-1"
          };
        }
      });
    },
    unclaimCompany() {
      let vm = this;
      Indicator.open();
      Dialog.confirm({
        title: "取消认领",
        message: "确认要取消次商铺的认领吗？"
      })
        .then(() => {
          http
            .post(api.UNCLAIMCOMPANY, {
              companyID: vm.id
            })
            .then(resp => {
              Indicator.close();
              if (resp.data.success) {
                vm.isShowEnterprise = false;
                Notify({ type: "success", message: "取消成功" });
              } else {
                Notify({ type: "warning", message: resp.data.message });
              }
            });
        })
        .catch(() => {});
    },
    punch() {
      let vm = this;
      Dialog.confirm({
        title: "店铺打卡",
        message: "确认要进行改店铺打卡吗？"
      }).then(() => {
        Indicator.open();
        http
          .post(api.PUNCHIN, {
            companyID: vm.id
          })
          .then(resp => {
            Indicator.close();
            if (resp.data.success) {
              Notify({ type: "success", message: "打卡成功" });
            } else {
              Notify({ type: "warning", message: resp.data.message });
            }
            vm.getDetail();
          });
      });
    }
  },
  watch: {
    companyName() {
      if (this.companyName === "") {
        this.isShowSearchList = false;
        this.isWatchCompanyName = false;
      }
    },
    barList() {
      if (this.barList.length === 0) {
        this.isShowSearchList = false;
      } else {
        this.isShowSearchList = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("/static/arcgis/esri.css");
.enterprise-map {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 50px;
    background: url("../../../assets/image/top-bg.png") no-repeat;
    background-position: right bottom;
    background-size: cover;
    display: flex;
    align-items: center;
    position: relative;
    input {
      padding-left: 30px;
      width: 95%;
      height: 34px;
      border-radius: 5px;
      font-family: "FZSong";
      color: #975b16;
      margin-left: 10px;
    }
    .search-icon {
      width: 14px;
      height: 14px;
      background: url("../../../assets/image/search-icon.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .search-list {
      width: 95%;
      height: 150px;
      border: 1px solid #eee;
      position: absolute;
      left: 10px;
      top: 42px;
      z-index: 999;
      background-color: rgba(255, 255, 255, 0.8);
      .search-item {
        padding-left: 20px;
        height: 35px;
        line-height: 35px;
        color: #000;
      }
    }
    .enterprise-button {
      font-size: 14px;
      color: #fff;
      font-family: "FZSong";
      flex: 1;
      text-align: center;
    }
  }
  #map {
    flex: 1;
    position: relative;
    #LocateButton {
      width: 35px;
      height: 35px;
      background: url("../../../assets/image/location-button.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 20px;
      bottom: 30px;
      z-index: 999;
    }
  }
  .content {
    .box {
      width: 98px;
      height: 100px;
      background: url("../../../assets/image/box.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
    }
    .text {
      font-family: "FZSong" !important;
      color: #728096;
      text-align: center;
      font-size: 12px;
      margin: 10px 0;
    }
    .entry-button {
      width: 267px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      background: url("../../../assets/image/empty-entry.png") no-repeat;
      font-family: "FZSong" !important;
      color: #fff;
      background-size: 100% 100%;
      margin: 20px auto;
    }
  }
}
</style>
