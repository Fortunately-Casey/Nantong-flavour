<template>
  <div class="enterprise-map">
    <div class="top">
      <div class="search-icon"></div>
      <input type="text" placeholder="输入企业名称搜索" />
      <div class="enterprise-button">企业列表</div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
export default {
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(function() {
      this.createMap();
    });
  },
  methods: {
    createMap() {
      esriLoader
        .loadModules([
          "esri/map",
          "esri/layers/WMTSLayer",
          "esri/layers/WMTSLayerInfo",
          "esri/geometry/Extent",
          "esri/layers/TileInfo",
          "esri/SpatialReference",
          "dojo/parser",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojo/domReady!"
        ])
        .then(function([
          Map,
          WMTSLayer,
          WMTSLayerInfo,
          Extent,
          TileInfo,
          SpatialReference,
          parser
        ]) {
          parser.parse();

          var bounds = new Extent({
            xmin: -128.816,
            ymin: 25.076,
            xmax: -72.855,
            ymax: 51.385,
            spatialReference: { wkid: 4326 }
          });
          var map = new Map("map", {
            extent: bounds
          });

          var tileInfo1 = new TileInfo({
            dpi: 96,
            format: "tiles",
            compressionQuality: 0,
            spatialReference: new SpatialReference({
              wkid: 4326
            }),
            rows: 256,
            cols: 256,
            origin: {
              x: -180,
              y: 90
            },
            lods: [
              {
                level: "1",
                scale: 295829355.455,
                resolution: 0.703914402554
              },
              {
                level: "2",
                scale: 147914677.727,
                resolution: 0.351957201277
              },
              {
                level: "3",
                scale: 73957338.8636,
                resolution: 0.175978600638
              },
              {
                level: "4",
                scale: 36978669.4318,
                resolution: 0.0879893003192
              },
              {
                level: "5",
                scale: 18489334.7159,
                resolution: 0.0439946501596
              },
              {
                level: "6",
                scale: 9244667.35796,
                resolution: 0.0219973250798
              },
              {
                level: "7",
                scale: 4622333.67898,
                resolution: 0.0109986625399
              },
              {
                level: "8",
                scale: 2311166.83949,
                resolution: 0.00549933126995
              },
              {
                level: "9",
                scale: 1155583.41974,
                resolution: 0.00274966563497
              },
              {
                level: "10",
                scale: 577791.709872,
                resolution: 0.00137483281749
              }
            ]
          });
          var tileExtent1 = new Extent(
            -179.99999,
            -89.99999,
            179.99999,
            89.99999,
            new SpatialReference({
              wkid: 4326
            })
          );
          var layerInfo1 = new WMTSLayerInfo({
            tileInfo: tileInfo1,
            fullExtent: tileExtent1,
            initialExtent: tileExtent1,
            identifier: "vec",
            tileMatrixSet: "c",
            format: "png",
            style: "default"
          });

          var resourceInfo = {
            version: "1.0.0",
            layerInfos: [layerInfo1],
            copyright: "天地图"
          };

          var options = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo,
            layerInfo: layerInfo1
          };

          var wmtsLayer = new WMTSLayer(
            "http://t0.tianditu.gov.cn/vec_c/wmts?tk=51ea14290efda31924a23f1a2c74c291&SERVICE=WMTS&REQUEST=GetCapabilities",
            options
          );
          map.addLayer(wmtsLayer);
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
  }
}
</style>