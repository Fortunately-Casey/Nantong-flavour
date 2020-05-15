<template>
  <div class="enterprise-map">
    <div class="top">
      <div class="search-icon"></div>
      <input type="text" placeholder="输入企业名称搜索" />
      <div class="enterprise-button" @click="goToEnterpriseList">企业列表</div>
    </div>
    <div id="map">
      <div id="LocateButton" style="display:block" @click="locationTo"></div>
    </div>
    <van-action-sheet v-model="isShowEnterprise" :title="enterpriseName">
      <div class="content">
        <div class="box"></div>
        <div class="text">该企业尚未有人认领</div>
        <div class="entry-button" @click="goToClaim"></div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
import { Indicator } from "mint-ui";
import LocationSdk from "@/common/location-sdk";
import { Notify } from "vant";
export default {
  data() {
    return {
      isShowEnterprise: false,
      enterpriseName: "一楼食品有限公司",
      location: {},
      map: {}
    };
  },
  created() {},
  mounted() {
    // Indicator.open();
    // setTimeout(() => {
    // this.getLocation();
    // }, 2000);
    // setTimeout(() => {
    //   this.createMap();
    // });
    // this.$nextTick(function() {
    this.createMap1();
    // });
  },
  methods: {
    createMap() {
      let vm = this;
      esriLoader
        .loadModules([
          "esri/map",
          "esri/layers/WebTiledLayer",
          "esri/layers/TileInfo",
          "esri/geometry/Point",
          "esri/dijit/OverviewMap",
          "dojo/domReady!"
        ])
        .then(function([Map, WebTiledLayer, TileInfo, Point, OverviewMap]) {
          var map = new Map("map", {
            center: [0, 0],
            zoom: 0,
            slider: false,
            logo: false
          });
          var tileInfo = new TileInfo({
            dpi: 90.71428571427429,
            rows: 256,
            cols: 256,
            compressionQuality: 0,
            origin: {
              x: -180,
              y: 90
            },
            spatialReference: {
              wkid: 4326
            },
            lods: [
              {
                level: 2,
                levelValue: 2,
                resolution: 0.3515625,
                scale: 147748796.52937502
              },
              {
                level: 3,
                levelValue: 3,
                resolution: 0.17578125,
                scale: 73874398.264687508
              },
              {
                level: 4,
                levelValue: 4,
                resolution: 0.087890625,
                scale: 36937199.132343754
              },
              {
                level: 5,
                levelValue: 5,
                resolution: 0.0439453125,
                scale: 18468599.566171877
              },
              {
                level: 6,
                levelValue: 6,
                resolution: 0.02197265625,
                scale: 9234299.7830859385
              },
              {
                level: 7,
                levelValue: 7,
                resolution: 0.010986328125,
                scale: 4617149.8915429693
              },
              {
                level: 8,
                levelValue: 8,
                resolution: 0.0054931640625,
                scale: 2308574.9457714846
              },
              {
                level: 9,
                levelValue: 9,
                resolution: 0.00274658203125,
                scale: 1154287.4728857423
              },
              {
                level: 10,
                levelValue: 10,
                resolution: 0.001373291015625,
                scale: 577143.73644287116
              },
              {
                level: 11,
                levelValue: 11,
                resolution: 0.0006866455078125,
                scale: 288571.86822143558
              },
              {
                level: 12,
                levelValue: 12,
                resolution: 0.00034332275390625,
                scale: 144285.93411071779
              },
              {
                level: 13,
                levelValue: 13,
                resolution: 0.000171661376953125,
                scale: 72142.967055358895
              },
              {
                level: 14,
                levelValue: 14,
                resolution: 8.58306884765625e-5,
                scale: 36071.483527679447
              },
              {
                level: 15,
                levelValue: 15,
                resolution: 4.291534423828125e-5,
                scale: 18035.741763839724
              },
              {
                level: 16,
                levelValue: 16,
                resolution: 2.1457672119140625e-5,
                scale: 9017.8708819198619
              },
              {
                level: 17,
                levelValue: 17,
                resolution: 1.0728836059570313e-5,
                scale: 4508.9354409599309
              },
              {
                level: 18,
                levelValue: 18,
                resolution: 5.3644180297851563e-6,
                scale: 2254.4677204799655
              },
              {
                level: 19,
                levelValue: 19,
                resolution: 2.68220901489257815e-6,
                scale: 1127.23386023998275
              },
              {
                level: 20,
                levelValue: 2,
                resolution: 1.341104507446289075e-6,
                scale: 563.616930119991375
              }
            ]
          });
          var vecLayer = WebTiledLayer(
            "http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}&tk=0517bd14ad10fe5e9b6302c6e811f4a7",
            {
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              tileInfo: tileInfo
            }
          );
          //
          var labelLayer = WebTiledLayer(
            "http://{subDomain}.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}&tk=0517bd14ad10fe5e9b6302c6e811f4a7",
            {
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              tileInfo: tileInfo
            }
          );
          //
          map.addLayers([vecLayer, labelLayer]);
          map.centerAndZoom(
            new Point({
              x: 120.86448335647579,
              y: 32.00571294529357,
              spatialReference: {
                wkid: 4326
              }
            }),
            13
          );

          Indicator.close();
          map.on("click", function(result) {
            // console.log(result);
            vm.getLocation();
          });

          // vm.getLocation();
          // var geoLocate = new LocateButton(
          //   {
          //     map: map
          //   },
          //   "LocateButton"
          // );
          // geoLocate.startup();
          // var overviewMapDijit = new OverviewMap({
          //   map: map,
          //   // visible: true
          // });
          // overviewMapDijit.startup(); //
        });
    },
    createMap1() {
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
          esriConfig,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          TextSymbol,
          ClassBreaksRenderer,
          SimpleFillSymbol,
          SimpleLineSymbol
          // ClusterLayer
        ]) {
          // var initialExtent = new Extent(
          //   120.893798,
          //   31.793207,
          //   121.084289,
          //   31.987909,
          //   new esri.SpatialReference({ wkid: 4490 })
          // );
          vm.map = new Map("map", {
            // extent: initialExtent,
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
          // let point = new Point({
          //   x: vm.location.longitude,
          //   y: vm.location.latitude,
          //   spatialReference: {
          //     wkid: 4490
          //   }
          // });
          let point = new Point({
            x: 120.86448335647579,
            y: 32.00571294529357,
            spatialReference: {
              wkid: 4490
            }
          });
          vm.map.centerAndZoom(point, 16);
          var startPointSymbol = new SimpleMarkerSymbol();
          startPointSymbol.style = SimpleMarkerSymbol.STYLE_CIRCLE;
          startPointSymbol.setSize(10);
          startPointSymbol.setColor(new Colors("red"));
          var startPointGraphic = new Graphic(point, startPointSymbol);
          let graphiclayer = new GraphicsLayer({
            id: "location"
          });
          graphiclayer.add(startPointGraphic);
          vm.map.addLayer(graphiclayer);

          // vm.map.add(startPointGraphic);
        });
    },
    goToClaim() {
      this.$router.push({
        path: "/enterpriseClaim"
      });
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
          Notify({
            type: "primary",
            message: `${vm.location.longitude};${vm.location.latitude}`
          });
          // alert(vm.location.longitude);
          vm.createMap1();
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
          Notify({
            type: "primary",
            message: `${vm.location.longitude};${vm.location.latitude}`
          });
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
                x: vm.location.longitude,
                y: vm.location.latitude,
                spatialReference: {
                  wkid: 4490
                }
              });
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
    }
  }
};
</script>

<style lang="less" scoped>
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
