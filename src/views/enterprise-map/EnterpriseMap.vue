<template>
  <div class="enterprise-map">
    <div class="top">
      <div class="search-icon"></div>
      <input
        type="text"
        placeholder="输店铺名称搜索"
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
        >
          {{ item.companyName }}
        </div>
      </div>
      <div class="enterprise-button" @click="goToEnterpriseList">店铺列表</div>
    </div>
    <div id="map">
      <div id="LocateButton" style="display:block" @click="locationTo"></div>
    </div>
    <van-action-sheet v-model="isShowEnterprise" :title="enterpriseName">
      <div class="content">
        <div :class="isShowEntry ? 'box' : 'claimed'"></div>
        <div class="text">
          {{ isShowEntry ? "该店铺尚未有人认领" : "该店铺已被认领" }}
        </div>
        <div class="bottom" v-if="isShowGetEntry">
          <div class="claim-cancel" @click="unclaimCompany">取消</div>
          <div class="punch-button" @click="punch">打卡</div>
          <div class="punch-button" @click="goToClaim">详情</div>
        </div>
        <div class="entry-button" @click="goToClaim" v-if="isShowEntry"></div>
        <!-- <div
          class="entry-button"
          @click="goToClaim"
          v-if="isShowGetEntry"
        ></div>-->
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
import { Indicator } from "mint-ui";
import * as api from "@/service/apiList";
import http from "@/service/service";
import { Dialog, Notify } from "vant";
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
      isShowSearchList: false,
      bodyHeight: ""
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
    this.bodyHeight = document.documentElement.clientHeight;
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
          "esri/map",
          "esri/geometry/Point",
          "dojo/colors",
          "esri/graphic",
          "esri/layers/GraphicsLayer",
          "esri/layers/ArcGISTiledMapServiceLayer",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/FeatureLayer",
          "esri/geometry/Extent",
          "esri/renderers/HeatmapRenderer",
          "esri/tasks/IdentifyParameters",
          "esri/tasks/IdentifyTask",
          "esri/config",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/TextSymbol",
          "esri/renderers/ClassBreaksRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol"
          // "custom/ClusterLayer"
        ])
        .then(function([
          Map,
          Point,
          Colors,
          Graphic,
          GraphicsLayer,
          ArcGISTiledMapServiceLayer,
          ArcGISDynamicMapServiceLayer,
          FeatureLayer,
          Extent,
          HeatmapRenderer,
          IdentifyParameters,
          IdentifyTask,
          esriConfig,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          TextSymbol,
          ClassBreaksRenderer,
          SimpleFillSymbol,
          SimpleLineSymbol
          // ClusterLayer
        ]) {
          vm.map = new Map("map", {
            center: [0, 0],
            logo: false,
            slider: false,
            zoom: 13
          });
          var dynamicLayer = new ArcGISTiledMapServiceLayer(
            "/gis/arcgis/rest/services/NT/DLG_1000_201900/MapServer"
          );
          var dynamicLayer1 = new ArcGISDynamicMapServiceLayer(
            "/map/arcgis/rest/services/NTWD/NTWDMapService/MapServer"
          );
          vm.map.addLayer(dynamicLayer);
          vm.map.addLayer(dynamicLayer1);
          let point = new Point({
            x: Number(vm.location.longitude),
            y: Number(vm.location.latitude),
            spatialReference: {
              wkid: 4490
            }
          });
          // let point = new Point({
          //   x: 120.86448335647579,
          //   y: 32.00571294529357,
          //   spatialReference: {
          //     wkid: 4490
          //   }
          // });
          if (vm.$route.query.companyID) {
            http
              .get(api.COMPANYINFO, {
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
                  vm.map.centerAndZoom(point1, 18);
                  vm.isShowEnterprise = true;
                  if (
                    !resp.data.data.claimStatus &&
                    resp.data.data.claimStatus !== 0
                  ) {
                    vm.isShowEntry = true;
                  } else {
                    vm.isShowEntry = false;
                  }
                  if (
                    resp.data.data.myClaimStatus &&
                    resp.data.data.claimStatus
                  ) {
                    vm.isShowGetEntry = true;
                  } else {
                    vm.isShowGetEntry = false;
                  }
                }
              });
          } else {
            vm.map.centerAndZoom(point, 16);
          }
          var bluelocSymbol = new PictureMarkerSymbol(blueloc, 24, 26);
          var startPointGraphic = new Graphic(point, bluelocSymbol);
          let graphiclayer = new GraphicsLayer({
            id: "location"
          });
          graphiclayer.add(startPointGraphic);
          vm.map.addLayer(graphiclayer);
          Indicator.close();
          vm.map.on("click", function(result) {
            Indicator.open();
            let identifyTask = new IdentifyTask(
              "/map/arcgis/rest/services/NTWD/NTWDMapService/MapServer"
            );
            let identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 20;
            identifyParams.returnGeometry = false;
            identifyParams.layerIds = [0];
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.width = vm.map.width;
            identifyParams.height = vm.map.height;
            identifyParams.geometry = result.mapPoint;
            identifyParams.mapExtent = vm.map.extent;
            identifyTask.execute(identifyParams).addCallback(resp => {
              if (resp[0]) {
                let params = {
                  companyID: resp[0].feature.attributes.ID
                };
                http.get(api.COMPANYINFO, params).then(resp => {
                  Indicator.close();
                  if (resp.data.data) {
                    vm.enterpriseName = resp.data.data.companyName;
                    vm.id = resp.data.data.companyID;
                    vm.isShowEnterprise = true;
                    if (!resp.data.data.claimStatus) {
                      vm.isShowEntry = true;
                    } else {
                      vm.isShowEntry = false;
                    }
                    if (
                      resp.data.data.myClaimStatus &&
                      resp.data.data.claimStatus
                    ) {
                      vm.isShowGetEntry = true;
                    } else {
                      vm.isShowGetEntry = false;
                    }
                  }
                  console.log(resp.data.data);
                });
              } else {
                Indicator.close();
              }
            });
          });
          // vm.map.add(startPointGraphic);
        });
    },
    goToClaim() {
      this.$router.push({
        path: "/enterpriseClaim",
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
      esriLoader
        .loadModules([
          "esri/map",
          "esri/geometry/Point",
          "dojo/colors",
          "esri/graphic",
          "esri/layers/ArcGISTiledMapServiceLayer",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/FeatureLayer",
          "esri/geometry/Extent",
          "esri/renderers/HeatmapRenderer",
          "esri/config",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/TextSymbol",
          "esri/renderers/ClassBreaksRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol"
          // "custom/ClusterLayer"
        ])
        .then(function([
          Map,
          Point,
          Colors,
          Graphic,
          ArcGISTiledMapServiceLayer,
          ArcGISDynamicMapServiceLayer,
          FeatureLayer,
          Extent,
          HeatmapRenderer,
          esriConfig,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          TextSymbol,
          ClassBreaksRenderer,
          SimpleFillSymbol,
          SimpleLineSymbol
          // ClusterLayer
        ]) {
          let pointer2 = new Point({
            x: Number(item.longitude),
            y: Number(item.latitude),
            spatialReference: {
              wkid: 4490
            }
          });
          console.log(pointer2);
          vm.map.centerAndZoom(pointer2, 18);
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
          // Notify({
          //   type: "primary",
          //   message: `${vm.location.longitude};${vm.location.latitude}`
          // });
          // alert(vm.location.longitude);
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
          // Notify({
          //   type: "primary",
          //   message: `${vm.location.longitude};${vm.location.latitude}`
          // });
          esriLoader
            .loadModules([
              "esri/map",
              "esri/geometry/Point",
              "dojo/colors",
              "esri/graphic",
              "esri/layers/ArcGISTiledMapServiceLayer",
              "esri/layers/ArcGISDynamicMapServiceLayer",
              "esri/layers/FeatureLayer",
              "esri/geometry/Extent",
              "esri/renderers/HeatmapRenderer",
              "esri/config",
              "esri/symbols/PictureMarkerSymbol",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/TextSymbol",
              "esri/renderers/ClassBreaksRenderer",
              "esri/symbols/SimpleFillSymbol",
              "esri/symbols/SimpleLineSymbol"
              // "custom/ClusterLayer"
            ])
            .then(function([
              Map,
              Point,
              Colors,
              Graphic,
              ArcGISTiledMapServiceLayer,
              ArcGISDynamicMapServiceLayer,
              FeatureLayer,
              Extent,
              HeatmapRenderer,
              esriConfig,
              PictureMarkerSymbol,
              SimpleMarkerSymbol,
              TextSymbol,
              ClassBreaksRenderer,
              SimpleFillSymbol,
              SimpleLineSymbol
              // ClusterLayer
            ]) {
              let point = new Point({
                x: Number(vm.location.longitude),
                y: Number(vm.location.latitude),
                spatialReference: {
                  wkid: 4490
                }
              });
              let layer = vm.map.getLayer("location");
              layer.clear();
              var bluelocSymbol = new PictureMarkerSymbol(blueloc, 24, 26);
              var startPointGraphic = new Graphic(point, bluelocSymbol);
              layer.add(startPointGraphic);
              // vm.map.addLayer(layer);
              vm.map.centerAndZoom(point, 16);
            });
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
                // this.isClaimed = false;
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
    background: url("../../assets/image/top-bg.png") no-repeat;
    background-position: right bottom;
    background-size: cover;
    display: flex;
    align-items: center;
    position: relative;
    input {
      padding-left: 30px;
      width: 75%;
      height: 34px;
      border-radius: 5px;
      font-family: "FZSong";
      color: #975b16;
      margin-left: 10px;
    }
    .search-icon {
      width: 14px;
      height: 14px;
      background: url("../../assets/image/search-icon.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .search-list {
      width: 75%;
      height: 150px;
      border: 1px solid #eee;
      border-radius: 5px;
      position: absolute;
      left: 10px;
      top: 42px;
      z-index: 999;
      background-color: rgba(255, 255, 255, 0.8);
      .search-item {
        padding-left: 20px;
        height: 35px;
        line-height: 35px;
        font-family: "FZSong";
        color: #975b16;
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
      background: url("../../assets/image/location-button.png") no-repeat;
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
      background: url("../../assets/image/box.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
    }
    .bottom {
      width: 100%;
      // height: 40px;
      padding-top: 30px;
      padding-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .claim-cancel {
        width: 102px;
        height: 42px;
        background: url("../../assets/image/cancel-button-out.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 42px;
        font-family: "FZSong";
        margin: 0 5px;
        color: #975b16;
      }
      .punch-button {
        width: 102px;
        height: 42px;
        background: url("../../assets/image/punch-icon-out.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 42px;
        font-family: "FZSong";
        margin: 0 5px;
        color: #fff;
      }
    }
    .claimed {
      width: 127px;
      height: 127px;
      background: url("../../assets/image/claimed.png") no-repeat;
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
      background: url("../../assets/image/claim-entry.png") no-repeat;
      background-size: 100% 100%;
      margin: 20px auto;
    }
  }
}
</style>
