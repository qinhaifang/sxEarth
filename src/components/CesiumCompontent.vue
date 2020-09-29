<template>
  <div id="earth">
    <div class="bottom-div">
      <div class="message">
        <span>{{ viewMessage }}</span
        >，
        <span>{{ fpsMessage }}</span>
      </div>
      <div class="map">
        <el-checkbox :checked="true" :disabled="true">影像</el-checkbox>
        <el-checkbox v-model="checkTerrain" @change="handleCheckedTerrain"
          >高程</el-checkbox
        >
      </div>
    </div>
    <div v-if="currentPeople" class="people-detail">
      <div class="title">家庭详情</div>
      <div class="close" @click="closePeoPle">×</div>
      <div class="top">
        <div class="name">户主：{{ currentPeople.name }}</div>
        <div class="edit">
          <span
            v-if="!showEdit"
            class="el-icon-edit"
            @click="editCurrnetPeople"
          ></span>
          <span
            v-if="showEdit"
            class="el-icon-circle-check"
            @click="saveEdit"
          ></span>
        </div>
        <div
          v-if="showContent"
          class="resettlement"
          @click="goResettlement(currentPeople)"
        >
          {{ currentPeople.resettlement }}
        </div>
        <div
          v-if="showContent"
          class="green"
          @click="goBackGreen(currentPeople)"
        >
          旧房拆除及复垦复绿
        </div>
      </div>
      <div>
        <div class="content">
          <div class="content-item">
            家庭人口：
            <span v-if="!showEdit">{{ currentPeople.number }}</span>
            <el-input
              v-model="formData.number"
              size="mini"
              v-if="showEdit"
            ></el-input
            >人
          </div>
          <div class="content-item">
            人均住房：
            <span v-if="!showEdit">{{ currentPeople.area }}</span>
            <el-input
              v-model="formData.area"
              size="mini"
              v-if="showEdit"
            ></el-input
            >㎡
          </div>
          <div class="content-item">
            致贫原因：
            <span v-if="!showEdit">{{ currentPeople.reason }}</span>
            <el-input
              v-model="formData.reason"
              size="mini"
              v-if="showEdit"
            ></el-input>
          </div>
          <div class="content-item">
            建档时间：
            <span v-if="!showEdit">{{ currentPeople.time }}</span>
            <el-input
              v-model="formData.time"
              size="mini"
              v-if="showEdit"
            ></el-input
            >年
          </div>
          <div class="content-item">
            搬迁时间：
            <span v-if="!showEdit">{{ currentPeople.movetime }}</span>
            <el-input
              v-model="formData.movetime"
              size="mini"
              v-if="showEdit"
            ></el-input
            >年
          </div>
          <div class="content-item">
            经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：
            <span v-if="!showEdit">{{ currentPeople.old_long }}</span>
            <el-input
              v-model="formData.old_long"
              size="mini"
              v-if="showEdit"
            ></el-input
            >°
          </div>
          <div class="content-item">
            纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：
            <span v-if="!showEdit">{{ currentPeople.old_lat }}</span>
            <el-input
              v-model="formData.old_lat"
              size="mini"
              v-if="showEdit"
            ></el-input
            >°
          </div>
        </div>
        <div class="image">
          <img
            :src="currentPeople.url"
            @click="showLagerImage(currentPeople.url)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="showAllMessage && resettlementData.length > 0"
      class="people-detail"
    >
      <div class="title">安置点居民信息</div>
      <div class="close" @click="showAllMessage = false">×</div>
      <div class="all-top">
        <div class="count">共计：{{ resettlementData.length }}户</div>
        <div class="xiaoguo" @click="xiaoguo">安置点建设监管</div>
        <div class="table">
          <div class="head">
            <span style="width:60px;">户主</span>
            <span style="width:65px;">家庭人口</span>
            <span style="width:60px;">帮扶人</span>
            <span style="width:65px;">致贫原因</span>
            <span style="width:65px;">建档时间</span>
            <span style="width:65px;">搬迁时间</span>
            <span style="width:60px;">原住址</span>
          </div>
          <div class="body">
            <div
              class="row"
              v-for="(item, index) in resettlementData"
              :key="index"
            >
              <span style="width:60px;height: 24px;">{{ item.name }}</span>
              <span style="width:65px;">{{ item.number }}</span>
              <span style="width:60px;">{{ item.help }}</span>
              <span style="width:65px;">{{ item.reason }}</span>
              <span style="width:65px;">{{ item.time }}</span>
              <span style="width:65px;">{{ item.movetime }}</span>
              <span
                style="width: 20px;height: 20px;background: url(../../static/images/marker.png) no-repeat;background-size: 68%;margin-left: 20px;vertical-align: top;cursor: pointer;"
                @click="goPeople(item)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreatePanel
      class="createPanel"
      :style="{ top: createPanel.top, left: createPanel.left }"
      v-show="showPanel"
    ></CreatePanel>
    <img
      v-show="showImageIcon"
      id="imgIcon"
      :style="{ top: imgPosition.top, left: imgPosition.left }"
      src="static/images/zuoyou.png"
      @drag="drapImg"
    />
  </div>
</template>

<script>
//import Cesium from 'cesium/Cesium'
//import CesiumNavigation from "cesium-navigation-es6";
import {
  upDateMessage,
  searchPoint,
  getfileMeta,
  getlayermeta
} from "../api/api";

import CreatePanel from "./CreatePanel";

/** 
const geoserverUrl = window.UrlSetting.baseUrl + "/geoserver";
const layer = //window.UrlSetting.LAYERS_URL;
  //"http://192.168.23.202:8050/sdc/tiles/mbtiles/image/{z}/{x}/{reverseY}.jpg";
  window.UrlSetting.baseUrl + "/gisserver/tiles/BaseMap/{z}/{x}/{y}.jpg";
const terrain = window.UrlSetting.DEM_URL;*/
const geoserverUrl = window.UrlSetting.baseUrl + "/geoserver";
const layer =
  "http://220.181.130.171:9090/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{reverseY}.jpg";
//window.UrlSetting.baseUrl + "/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{reverseY}.jpg";
const layer1 =
  "http://220.181.130.171:9090/gisserver/tiles/mbtiles/hanzhong/{z}/{x}/{reverseY}.jpg";

const wmtsUrl = window.UrlSetting.baseUrl + "/geoserver/gwc/service/wmts";
const terrain = window.UrlSetting.DEM_URL;

export default {
  components: {
    CreatePanel
  },
  data() {
    return {
      createPanel: {
        left: "",
        top: ""
      },
      checkTerrain: false,
      viewer: null,
      viewMessage: "经度：0°，纬度：0°，视高：0km",
      fpsMessage: "帧率：0",
      currentLayer: null,
      currentLayer1: null,
      currentPinKunLayer: null,
      iconImage: null,
      extent: null,
      currentPeople: null,
      entitiesList: [],
      entitiesList2: [],
      entitiesList3: [],
      resettlementData: [],
      imgList: null,
      showAllMessage: false,
      resettlementLayerId: null,
      moveIcon: false,
      layerNearest: null,
      handlerList: [],
      showPanel: false,
      currentPoint: null,
      currentModel: null,
      showImageIcon: false,
      imgPosition: {
        left: "",
        top: ""
      },
      showContent: false,
      pinKunTranslate: {
        "000000000000": "china",
        "610000000000": "sx",
        "610700000000": "hanzhong",
        "150000000000": "neimenggu",
        "150700000000": "hulunbeier"
      },
      showEdit: false,
      formData: {},
      currentModle: null
    };
  },
  mounted() {
    Bus.$on("edit-mark", name => {
      for (let i = 0; i < this.entitiesList3.length; i++) {
        const item = this.entitiesList3[i];
        if (item.label && item.label.text._value === name) {
          Bus.$emit("get-panel-data", name);
          this.currentModel = item;
          this.currentPoint = item.position._value;
          this.viewer.scene.postRender.addEventListener(this.cesiumMoveEvent);
          this.showPanel = true;
        }
      }
    });
    Bus.$on("delete-mark", name => {
      for (let i = 0; i < this.entitiesList3.length; i++) {
        const item = this.entitiesList3[i];
        if (item.label && item.label.text._value === name) {
          this.viewer.entities.remove(this.entitiesList3[i]);
          this.entitiesList3.splice(i, 1);
          i--;
        }
        if (item.name && item.name === name) {
          this.viewer.entities.remove(this.entitiesList3[i]);
          this.entitiesList3.splice(i, 1);
          i--;
        }
      }
    });
    Bus.$on("add-ying-xiang", (id, polygon) => {
      this.resettlementLayerId = id;
      this.xiaoguo();
    });
    Bus.$on("remove-ying-xiang", () => {
      this.showImageIcon = false;
      this.viewer.imageryLayers.remove(this.currentLayer, true);
      this.currentLayer = null;
      this.viewer.scene.postRender.removeEventListener(this.cesiumImgEvent);
    });
    Bus.$on("add-search-point", (data, type) => {
      let dataType = "居民";
      // if (type === "searchData") {
      //   dataType = "居民";
      this.showContent = false;
      // } else if (type === "searchResettlement") {
      //   dataType = "安置点1";
      // } else {
      //   dataType = "贫困村";
      // }
      this.resettlementData = data;
      data.forEach((item, index) => {
        let isn = parseFloat(item.old_long);
        let pointX = parseFloat(item.old_long);
        let pointY = parseFloat(item.old_lat);
        if (dataType === "安置点1") {
          isn = parseFloat(item.new_long);
          pointX = parseFloat(item.new_long);
          pointY = parseFloat(item.new_lat);
        }
        if (!isNaN(isn)) {
          this.addPlace2(
            this.WGS84_to_Cartesian3([pointX, pointY]),
            // type === "searchData"
            item.name,
            // : type === "searchResettlement"
            // ? item.resettlement
            // : item.village,
            item.id || item.ID,
            dataType,
            // type === "searchResettlement"
            // ? "static/images/resettlement.png"
            "static/images/f16px.png"
          );
        }
      });
      this.flyToByEntiy(this.entitiesList2);
    });
    Bus.$on("saveEdit", (name, param) => {
      for (let i = 0; i < this.entitiesList3.length; i++) {
        const item = this.entitiesList3[i];
        if (item.label && item.label.text._value === name) {
          item.label.text = param.markName;
        }
        if (item.name && item.name === name) {
          item.name = param.markName;
        }
      }
    });
    Bus.$on("import-mark", (points, src) => {
      this.billboardItem(points[0], src);
    });
    Bus.$on("import-polyline", points => {
      this.lineItem(points, Cesium.Color.CORNFLOWERBLUE, 3, true);
    });
    Bus.$on("import-polygon", points => {
      this.polyItem(points, Cesium.Color.GREEN.withAlpha(0.5));
    });
    Bus.$on("add-label", (cartesian, param) => {
      this.entitiesList3[this.entitiesList3.length - 1].name = param.text;
      this.labelItem(cartesian, param);
    });
    Bus.$on("remove-panel-event", () => {
      this.removeCesiumMove();
      this.showPanel = false;
    });
    Bus.$on("draw-mark", src => {
      this.buildBillboard(src, this.panelShow);
    });
    Bus.$on("draw-line", () => {
      this.buildLine(this.panelShow);
    });
    Bus.$on("draw-plygon", () => {
      this.buildPoly(this.panelShow);
    });
    Bus.$on("distance-measure", () => {
      this.buildLine(this.getDistance);
    });
    Bus.$on("space-measure", () => {
      this.buildPoly(this.getSpace);
    });
    Bus.$on("resettlement-layer", id => {
      this.resettlementLayerId = id;
    });
    //添加行政区划图层
    Bus.$on("add-layer", message => {
      this.addLayer(message);
    });
    Bus.$on("add-pin-kun-layer", message => {
      this.addPinKunLayer(message);
    });
    Bus.$on("remove-dataSource", () => {
      this.viewer.dataSources.removeAll();
    });
    Bus.$on("add-layer-entity", element => {
      this.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(element, {
          stroke: Cesium.Color.RED,
          fill: Cesium.Color.fromCssColorString("#75BEC1").withAlpha(0),
          strokeWidth: 3,
          markerSymbol: "aaa",
          clampToGround: true
        })
      );
    });
    Bus.$on("add-polyine", list => {
      this.addPolyline(list, "#ffd200");
    });
    Bus.$on("set-view", position => {
      this.flyTo(position.lon, position.lat, position.range);
    });
    Bus.$on("add-industry-onEarth2", (area, date) => {
      const user = sessionStorage.getItem("username");
      let layers;
      if (user === "neimg" && area !== "000000000000") {
        layers = this.pinKunTranslate[area] + date + "_qu";
      } else {
        layers = this.pinKunTranslate[area] + date;
      }
      this.addPinKunLayer({
        layers
      });
    });
    Bus.$on(
      "add-industry-onEarth",
      (currentIndustry, industryData, countrys, area) => {
        this.addIndustry(currentIndustry, industryData, countrys, area);
      }
    );
    Bus.$on("add-town-and-village", message => {
      const cartesian = this.WGS84_to_Cartesian3([message.lon, message.lat]);
      this.addPlace2(
        cartesian,
        message.name,
        message.id,
        "村镇",
        message.name.includes("安置点")
          ? "static/images/resettlement.png"
          : "static/images/town.png"
      );
    });
    Bus.$on("clear-entity", () => {
      this.removeEntity();
    });
    Bus.$on("clear-entity2", () => {
      this.removeEntity2();
      this.closePeoPle();
      this.showAllMessage = false;
    });
    Bus.$on("clear-entity3", () => {
      this.removeEntity3();
    });
    Bus.$on("clear-last-entity3", () => {
      this.removeLastEntity3();
    });
    Bus.$on("clear-last-entity2", () => {
      this.removeLastEntity2();
    });
    Bus.$on("add-resettlemen-point", (data, nodeData) => {
      this.resettlementData = [];
      data.forEach(item => {
        this.resettlementData.push({
          id: item.id,
          name: item.name,
          number: item.number,
          help: item.help,
          reason: item.reason,
          time: item.time,
          movetime: item.movetime,
          village: item.village,
          resettlement: item.resettlement,
          area: item.area,
          old_long: item.old_long,
          old_lat: item.old_lat,
          new_long: item.new_long,
          new_lat: item.new_lat
        });
      });
      this.addResettlement(this.resettlementData, nodeData);
      this.showContent = true;
    });
    Bus.$on("add-foot-print", data => {
      this.addLayer({
        name: "layerChina",
        layers: "shengjiel"
      });
      this.flyTo(112.003, 30, 8886680);
      data.forEach(dataItem => {
        this.addPlace2(
          this.WGS84_to_Cartesian3([dataItem.lon, dataItem.lat]),
          dataItem.place + " " + dataItem.date,
          null,
          "足迹",
          "static/images/f16px.png"
        );
        this.addPath({
          old_long: "116.389775",
          old_lat: "39.911223",
          new_long: dataItem.lon,
          new_lat: dataItem.lat,
          clockRange: Cesium.ClockRange.LOOP_STOP,
          uri: "static/images/arrow.glb"
        });
      });
    });
    this.init();
    window.viewer = this.viewer;
    this.getMessageEvent();
    this.addLister();
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer("earth", {
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        shouldAnimate: true,
        timeline: false,
        contextOptions: {
          webgl: {
            preserveDrawingBuffer: true
          }
        }
      });
      //添加罗盘、导航仪（放大/缩小）和距离刻度
      const options = {
        // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
        defaultResetView: Cesium.Cartographic.fromDegrees(
          108.8,
          35.5,
          22000000
        ),
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        enableCompass: true,
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
        enableZoomControls: true,
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        enableDistanceLegend: true,
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        enableCompassOuterRing: true
      };
      //      CesiumNavigation.umd(this.viewer, options);
      //      CesiumNavigation(this.viewer, options);
      this.addImageLayer();
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(108.8, 35.5, 22000000),
        duration: 3.0
      });
    },
    xiaoguo() {
      getfileMeta(this.resettlementLayerId).then(res => {
        const serviceId = res.rows[0].serviceId;
        getlayermeta(serviceId).then(res1 => {
          res1.forEach(item => {
            if (item.type === "wmts") {
              item.matrixIds = [];
              for (let z = 0; z <= item.zoomStop; z += 1) {
                item.matrixIds[z] = `${item.srs}:${z}`;
              }
              this.addeRsettlementLayer(item, 1, true);
            }
          });
        });
      });
    },
    handleCheckedTerrain(value) {
      this.addTerrain(value);
    },
    addLister() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction(movement => {
        const obj = this.viewer.scene.pick(movement.position);
        if (Cesium.defined(obj) && obj.id instanceof Cesium.Entity) {
          const model = obj.id;
          Bus.$emit("click-layer-tree", model.name);
          if (model.name === "村镇") {
            Bus.$emit("click-tree", model.id);
          } else if (model.name === "居民") {
            this.resettlementData.forEach(item => {
              if (item.id === model.id || item.ID === model.id) {
                this.currentPeople = item;
                this.currentModel = model;
              }
            });
            searchPoint(encodeURI(this.currentPeople.name)).then(res => {
              if (res && res.length > 0) {
                this.currentPeople.url = `${window.UrlSetting.baseUrl}/manager/rest/file/browse?id=${res[0].id}&fileType=${res[0].fileType}`;
              } else {
                this.currentPeople.url = "static/images/timg.jpg";
              }
            });
            this.showAllMessage = false;
          } else if (model.name === "安置点") {
            this.showAllMessage = true;
            this.currentPeople = null;
          } else if (model.name === "icon") {
            this.moveIcon = true;
            this.viewer.scene.screenSpaceCameraController.enableRotate = false;
          } else if (model.name === "mark") {
            Bus.$emit("get-panel-data", model.label.text._value);
            this.showPanel = true;
            this.currentPoint = model.position._value;
            this.viewer.scene.postRender.addEventListener(this.cesiumMoveEvent);
            this.currentModel = model;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      handler.setInputAction(movement => {
        document.oncontextmenu = function() {
          return false;
        };
        this.clearLayers();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      handler.setInputAction(movement => {
        if (!this.showEdit) {
          return;
        }
        const point = this.getWGS84(movement.position);
        if (point) {
          this.formData.old_long = point.lon.toFixed(6);
          this.formData.old_lat = point.lat.toFixed(6);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    getMessageEvent() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.endPosition);
        if (!cartesian) {
          return;
        }
        const position = this.Cartesian3_to_WGS84(cartesian);
        const positionView = this.Cartesian3_to_WGS84(
          this.viewer.camera.position
        );
        this.viewMessage = `经度：${position.lng.toFixed(
          4
        )}°，纬度：${position.lat.toFixed(4)}°，视高：${(
          positionView.alt / 1000
        ).toFixed(3)}km`;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      let _lastFpsSampleTime = null;
      let _frameCount = 0;
      let _fps = 0;
      this.viewer.scene.postRender.addEventListener(() => {
        if (_lastFpsSampleTime == null) {
          _lastFpsSampleTime = Cesium.getTimestamp();
          return;
        }
        const time = Cesium.getTimestamp();

        _frameCount++;
        let fps = _fps;
        const fpsElapsedTime = time - _lastFpsSampleTime;
        if (fpsElapsedTime > 1000) {
          fps = ((_frameCount * 1000) / fpsElapsedTime) | 0;

          _lastFpsSampleTime = time;
          _frameCount = 0;
        }

        if (fps !== _fps) {
          _fps = fps;
          this.fpsMessage = `帧率：${fps}`;
        }
      });
    },
    closePeoPle() {
      this.currentPeople = null;
      this.clearLayers();
    },
    clearLayers() {
      if (!this.currentLayer) {
        return;
      }
      if (this.currentModel) {
        this.currentModel.show = true;
      }
      this.showImageIcon = false;
      this.viewer.imageryLayers.remove(this.currentLayer, true);
      this.currentLayer = null;
      this.viewer.scene.postRender.removeEventListener(this.cesiumImgEvent);
      if (!this.currentLayer1) {
        return;
      }
      this.viewer.imageryLayers.remove(this.currentLayer1, true);
      this.currentLayer1 = null;
      this.removeLastEntity2();
      this.removeLastEntity2();
    },
    addImageLayer() {
      const imageLayer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: layer
          //tilingScheme: new Cesium.GeographicTilingScheme()
        })
      );
      /** const imageLayer = new Cesium.ImageryLayer(
        new Cesium.createTileMapServiceImageryProvider({
          url: layer,
          format: "image/jpeg"
        })
      );*/
      this.viewer.imageryLayers.removeAll();
      this.viewer.imageryLayers.add(imageLayer, 0);
    },
    addTerrain(bool) {
      let terrainProvider;
      if (bool) {
        terrainProvider = new Cesium.CesiumTerrainProvider({
          url: terrain
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
      } else {
        terrainProvider = new Cesium.EllipsoidTerrainProvider();
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
      }
      this.viewer.terrainProvider = terrainProvider;
    },
    addeRsettlementLayer(data, level, bool) {
      const matrixIds = new Array();
      this.extent = {
        west: data.extent.minx,
        south: data.extent.miny,
        east: data.extent.maxx,
        nonth: data.extent.maxy
      };
      this.currentLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapTileServiceImageryProvider({
          url: data.url,
          layer: data.layer,
          style: "",
          format: data.format,
          tileMatrixSetID: data.srs,
          tileMatrixLabels: data.matrixIds,
          maximumLevel: data.zoomStop,
          minimumLevel: data.zoomStart,
          tilingScheme: new Cesium.GeographicTilingScheme(),
          rectangle: Cesium.Rectangle.fromDegrees(
            this.extent.west,
            this.extent.south,
            this.extent.east,
            this.extent.nonth
          )
        })
      );
      this.viewer.imageryLayers.add(this.currentLayer, level);
      if (bool) {
        this.currentLayer.minificationFilter =
          Cesium.TextureMinificationFilter.NEAREST;
        this.currentLayer.magnificationFilter =
          Cesium.TextureMagnificationFilter.NEAREST;
        this.currentLayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        this.showImageIcon = true;
        this.currentPoint = this.WGS84_to_Cartesian3([
          this.extent.west,
          (this.extent.south + this.extent.nonth) / 2
        ]);
        this.viewer.scene.postRender.addEventListener(this.cesiumImgEvent);
      }
    },
    addLayer(message) {
      if (this.currentLayer) {
        this.viewer.imageryLayers.remove(this.currentLayer, true);
        this.currentLayer = null;
      }
      if (!message) {
        return;
      }
      this.currentLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: geoserverUrl + "/shp/wms",
          layers: message.layers,
          parameters: {
            transparent: "true",
            format: "image/png"
          }
        })
      );
      this.viewer.imageryLayers.add(this.currentLayer, 1);
    },
    addPinKunLayer(message) {
      if (this.currentPinKunLayer) {
        this.viewer.imageryLayers.remove(this.currentPinKunLayer, true);
        this.currentPinKunLayer = null;
      }
      if (!message) {
        return;
      }
      this.currentPinKunLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: geoserverUrl + "/shp/wms",
          layers: message.layers,
          parameters: {
            transparent: "true",
            format: "image/png"
          }
        })
      );
      this.viewer.imageryLayers.add(this.currentPinKunLayer, 2);
    },
    addResettlement(data, nodeData) {
      //添加居民点  迁移路线及动画
      setTimeout(() => {
        data.forEach((item, index) => {
          const isn = parseFloat(item.old_long);
          if (!isNaN(isn)) {
            this.addPlace2(
              this.WGS84_to_Cartesian3([item.old_long, item.old_lat]),
              item.name,
              item.id,
              "居民",
              "static/images/f16px.png"
            );
            if (index < 100) {
              this.addPath({
                old_long: item.old_long,
                old_lat: item.old_lat,
                new_long: nodeData.lon,
                new_lat: nodeData.lat,
                name: item.name,
                clockRange: Cesium.ClockRange.CLAMPED,
                image: "static/images/f16px.png"
              });
            }
          }
        });
        this.viewer.clock.onTick.removeEventListener(this.pathListener);
        this.viewer.clock.onTick.addEventListener(this.pathListener);
      }, 500);
      //添加安置点
      this.addPlace2(
        this.WGS84_to_Cartesian3([nodeData.lon, nodeData.lat]),
        nodeData.name,
        nodeData.area,
        "安置点",
        "static/images/resettlement.png"
      );
      if (nodeData.area === "610726002299") {
        return;
      }
      //添加安置区域
      let list = nodeData.polygon;
      if (list.length > 0) {
        list.push(list[0]);
        this.addPolyline([].concat.apply([], list), "#ffd200");
      }
    },
    addPath(data) {
      const property = new Cesium.SampledPositionProperty();
      const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
      const center = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16, 1));
      const stop = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16, 2));
      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = data.clockRange;
      this.viewer.clock.multiplier = 30;
      const positionStart = Cesium.Cartesian3.fromDegrees(
        data.old_long,
        data.old_lat,
        0
      );
      const positionCenter = Cesium.Cartesian3.fromDegrees(
        (parseFloat(data.old_long) + parseFloat(data.new_long)) / 2,
        (parseFloat(data.old_lat) + parseFloat(data.new_lat)) / 2,
        Math.abs(data.old_long - data.new_long) * 5000
      );
      const positionStop = Cesium.Cartesian3.fromDegrees(
        data.new_long,
        data.new_lat,
        0
      );
      property.addSample(start, positionStart);
      property.addSample(center, positionCenter);
      property.addSample(stop, positionStop);
      property.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
      });
      let billboard, model;
      if (data.image) {
        billboard = {
          image: data.image,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 24,
          height: 24
        };
      }
      if (data.uri) {
        model = {
          uri: data.uri,
          minimumPixelSize: 32
        };
      }
      const modelPath = this.viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop
          })
        ]),
        position: property,
        orientation: new Cesium.VelocityOrientationProperty(property),
        label: {
          text: data.name,
          font: "12px Helvetica",
          fillColor: Cesium.Color.BLACK,
          outlineWidth: 5.0,
          outlineColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, 10),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        },
        billboard,
        model,
        path: {
          resolution: 1,
          material: Cesium.Color.YELLOW,
          width: 0.5
        }
      });
      this.entitiesList3.push(modelPath);
    },
    pathListener() {
      const time = this.viewer.clock.currentTime;
      if (time.secondsOfDay === 72155) {
        this.removeEntity3();
        this.viewer.clock.onTick.removeEventListener(this.pathListener);
      }
    },
    flyTo(lon, lat, height) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        duration: 1.0
      });
    },
    addIndustry(currentIndustry, industryData, countrys, area) {
      const _this = this;
      industryData.features.forEach((items, index) => {
        if (items.properties.cp) {
          const cartesian = _this.WGS84_to_Cartesian3(items.properties.cp);
          _this.addPlace(
            cartesian,
            items.properties.name,
            _this.getICon(currentIndustry)
          );
        }
        const countryItem = countrys.find(item => {
          return item.title == items.properties.name;
        });
        const color = _this.getColor(currentIndustry, index, countryItem, area);
        items.geometry.coordinates.forEach(function(itemss) {
          if (itemss.length > 1) {
            _this.addPolygon([].concat.apply([], itemss), color);
          } else {
            _this.addPolygon([].concat.apply([], itemss[0]), color);
          }
        });
      });
    },
    getColor(currentIndustry, index, countryItem, area) {
      if (!countryItem) {
        return "#ffffff";
      }
      let color;
      switch (currentIndustry) {
        case 0:
          const colorList = [
            "#ffffff",
            "#FFBB74",
            "#FFBB74",
            "#FFF2BD",
            "#FFF2BD",
            "#FFF2BD",
            "#FFBB72",
            "#ffffff",
            "#FFF2BB",
            "#E34901",
            "#ffffff",
            "#FFBB74",
            "#FF8E01",
            "#FF8E01",
            "#E34901",
            "#FFF2BD",
            "#E34901",
            "#ffffff",
            "#ffffff",
            "#FFF2BD",
            "#ffffff",
            "#ffffff",
            "#FFBB74",
            "#FF8E01",
            "#E34901",
            "#FFBB74",
            "#FFBB74",
            "#FFF2BD",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#E34901"
          ];
          return colorList[index];
        case 1:
          if (area.substr(-12) == "000000000000") {
            if (countryItem.number >= 450) {
              color = "#D8584D";
            } else if (countryItem.number >= 300 && countryItem.number < 450) {
              color = "#f79646";
            } else if (countryItem.number >= 200 && countryItem.number < 300) {
              color = "#7f7f7f";
            } else if (countryItem.number >= 100 && countryItem.number < 200) {
              color = "#4bacc6";
            } else if (countryItem.number < 100) {
              color = "#4f81bd";
            }
          } else if (area.substr(-10) == "0000000000") {
            if (countryItem.number >= 45) {
              color = "#D8584D";
            } else if (countryItem.number >= 30 && countryItem.number < 45) {
              color = "#f79646";
            } else if (countryItem.number >= 20 && countryItem.number < 30) {
              color = "#7f7f7f";
            } else if (countryItem.number >= 10 && countryItem.number < 20) {
              color = "#4bacc6";
            } else if (countryItem.number < 10) {
              color = "#4f81bd";
            }
          } else if (area.substr(-8) == "00000000") {
            if (countryItem.number >= 10) {
              color = "#D8584D";
            } else if (countryItem.number >= 6 && countryItem.number < 10) {
              color = "#f79646";
            } else if (countryItem.number >= 4 && countryItem.number < 6) {
              color = "#7f7f7f";
            } else if (countryItem.number >= 2 && countryItem.number < 4) {
              color = "#4bacc6";
            } else if (countryItem.number < 2) {
              color = "#4f81bd";
            }
          }
          return color;
        case 2:
          if (countryItem.Guidetype == 1) {
            color = "#DB2EA8";
          } else if (countryItem.Guidetype == 2) {
            color = "#9E40C5";
          } else if (countryItem.Guidetype == 3) {
            color = "#928DDF";
          } else if (countryItem.Guidetype == 4) {
            color = "#DBD388";
          } else if (countryItem.Guidetype == 5) {
            color = "#B5DB7A";
          } else if (countryItem.Guidetype == 6) {
            color = "#3EBCDB";
          }
          return color;
      }
    },
    getICon(currentIndustry) {
      if (currentIndustry === 0) {
        return "static/images/rightbottom/jinb.png";
      } else {
        return "static/images/rightbottom/place_default.png";
      }
    },
    addPoint(cartesian, color) {
      const point = viewer.entities.add({
        position: cartesian,
        point: {
          color: Cesium.Color.fromCssColorString(color),
          pixelSize: 5,
          heightReference: Cesium.HeightReference.clampToGround
        }
      });
      this.entitiesList2.push(point);
    },
    addPlace(cartesian, text, image) {
      const place = this.viewer.entities.add({
        position: cartesian,
        label: {
          text,
          font: "14px Helvetica",
          fillColor: Cesium.Color.BLACK,
          outlineWidth: 5.0,
          outlineColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(30, -15),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        },
        billboard: {
          image,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 30,
          height: 30
        }
      });
      this.entitiesList.push(place);
    },
    addPlace2(cartesian, text, id, name, image) {
      const place = this.viewer.entities.add({
        position: cartesian,
        id,
        name,
        label: {
          text,
          font: "14px Helvetica",
          fillColor: Cesium.Color.BLACK,
          outlineWidth: 5.0,
          outlineColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, 10),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        },
        billboard: {
          image,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 30,
          height: 30
        }
      });
      this.entitiesList2.push(place);
    },
    /**
     * 画多边形(方法2)
     */
    addPolygon(polyList, color) {
      const poly = this.viewer.entities.add({
        polygon: {
          show: true,
          hierarchy: Cesium.Cartesian3.fromDegreesArray(polyList),
          material: Cesium.Color.fromCssColorString(color),
          outline: true,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
          height: 0
        }
      });
      this.entitiesList.push(poly);
    },
    showLagerImage(url) {
      Bus.$emit("show-lager-image", url);
    },
    addPolyline(list, color) {
      const polyline = this.viewer.entities.add({
        polyline: {
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArray(list),
          material: Cesium.Color.fromCssColorString(color),
          width: 5,
          clampToGround: true
        }
      });
      this.entitiesList2.push(polyline);
    },
    /**
     * 画线
     */
    lineItem(lineList, material, width, clampToGround) {
      function callBackLine() {
        return lineList;
      }

      const line = this.viewer.entities.add({
        polyline: {
          show: true,
          positions: new Cesium.CallbackProperty(callBackLine, false),
          material,
          width,
          clampToGround
        }
      });
      this.entitiesList3.push(line);
    },
    /**
     * 画label
     */
    labelItem(cartesian, param) {
      const label = this.viewer.entities.add({
        position: cartesian,
        name: param.name,
        label: {
          text: param.text,
          font: param.font,
          fillColor: Cesium.Color.BLACK,
          outlineWidth: 5.0,
          outlineColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(param.offsetX, param.offsetY),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        }
      });
      this.entitiesList3.push(label);
    },

    /**
     * 添加线的鼠标事件
     */
    buildLine(callBack) {
      let positions = [];
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      this.handlerList.push(handler);
      this.lineItem(positions, Cesium.Color.CORNFLOWERBLUE, 3, true);
      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.position);
        if (!cartesian) {
          return;
        }
        if (positions.length == 0) {
          positions.push(cartesian);
        }
        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.endPosition);
        if (!cartesian) {
          return;
        }
        if (positions.length >= 2) {
          positions.pop();
          positions.push(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(() => {
        document.oncontextmenu = function() {
          return false;
        };
        this.removeEvent();
        callBack(positions);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    getDistance(positions) {
      const distance = this.getSpaceDisfromArray(positions);
      const param = {
        text: `长度：${(distance / 1000).toFixed(2)}千米`,
        font: "18px sans-serif"
      };
      this.labelItem(positions[0], param);
    },
    getSpaceDisfromArray(positions) {
      const _this = this;
      const cartographicList = positions.map(point => {
        return _this.getCartographicFromCartesian3(point);
      });
      let dist = 0.0;
      for (let i = 0; i < cartographicList.length - 1; i++) {
        dist += _this.getSpaceDistance(
          cartographicList[i],
          cartographicList[i + 1]
        );
      }
      return dist.toFixed(2);
    },
    getSpaceDistance(startPoint, endPoint) {
      const surdis = this.getDistanceByPoint(startPoint, endPoint);
      return Math.sqrt(
        Math.pow(surdis, 2) + Math.pow(startPoint.height - endPoint.height, 2)
      );
    },
    getDistanceByPoint(startPoint, endPoint) {
      const geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(startPoint, endPoint);
      return Math.round(geodesic.surfaceDistance);
    },

    /**
     * 画多边形
     */
    polyItem(polyList, material) {
      function callBackPoly() {
        return polyList;
      }
      const poly = this.viewer.entities.add({
        polygon: {
          show: true,
          hierarchy: new Cesium.CallbackProperty(callBackPoly, false),
          material
        }
      });
      this.entitiesList3.push(poly);
    },
    /**
     * 添加多边形的鼠标事件
     */
    buildPoly(callBack) {
      let positions = [];
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      this.handlerList.push(handler);
      this.polyItem(positions, Cesium.Color.GREEN.withAlpha(0.5));
      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.position);
        if (!cartesian) {
          return;
        }
        if (positions.length == 0) {
          positions.push(cartesian);
        }
        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.endPosition);
        if (positions.length >= 2) {
          positions.pop();
          positions.push(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(() => {
        document.oncontextmenu = function() {
          return false;
        };
        this.removeEvent();

        callBack(positions);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    getSpace(positions) {
      const area = this.getArea(positions);
      const param = {
        text: `面积：${(area / 1000000).toFixed(2)}平方千米`,
        font: "18px sans-serif"
      };
      this.labelItem(positions[0], param);
    },
    getArea(positions) {
      const _this = this;
      const points = positions.map(point => {
        return _this.Cartesian3_to_WGS84(point);
      });
      const earthRadiusMeters = 6371000.0;
      const radiansPerDegree = Math.PI / 180.0;
      let totalAngle = 0;
      for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        let k = (i + 2) % points.length;
        totalAngle += _this.Angle(points[i], points[j], points[k]);
      }
      const planarTotalAngle = (points.length - 2) * 180.0;
      let sphericalExcess = totalAngle - planarTotalAngle;
      if (sphericalExcess > 420.0) {
        totalAngle = points.length * 360.0 - totalAngle;
        sphericalExcess = totalAngle - planarTotalAngle;
      } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
        sphericalExcess = Math.abs(360.0 - sphericalExcess);
      }
      return (
        sphericalExcess *
        radiansPerDegree *
        earthRadiusMeters *
        earthRadiusMeters
      );
    },
    Angle(p1, p2, p3) {
      const bearing21 = this.Bearing(p2, p1);
      const bearing23 = this.Bearing(p2, p3);
      let angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    },
    Bearing(from, to) {
      const radiansPerDegree = Math.PI / 180.0;
      const degreesPerRadian = 180.0 / Math.PI;
      const lat1 = from.lat * radiansPerDegree;
      const lon1 = from.lng * radiansPerDegree;
      const lat2 = to.lat * radiansPerDegree;
      const lon2 = to.lng * radiansPerDegree;
      let angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      angle = angle * degreesPerRadian;
      return angle;
    },
    billboardItem(position, image) {
      const billboard = this.viewer.entities.add({
        position: position,
        billboard: {
          image,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
      this.entitiesList3.push(billboard);
    },
    /**
     * 添加点的鼠标事件-画图标
     */
    buildBillboard(src, callback) {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      this.handlerList.push(handler);
      handler.setInputAction(movement => {
        const cartesian = this.getCartesian(movement.position);
        if (!cartesian) {
          return;
        }
        this.billboardItem(cartesian, src);
        this.removeEvent();
        callback([cartesian]);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    panelShow(points) {
      this.showPanel = true;
      this.currentPoint = points[0];
      this.viewer.scene.postRender.addEventListener(this.cesiumMoveEvent);
      Bus.$emit("panel-positions", points);
    },
    removeCesiumMove() {
      this.viewer.scene.postRender.removeEventListener(this.cesiumMoveEvent);
    },
    cesiumMoveEvent() {
      const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        this.currentPoint
      );
      this.createPanel.top = picks.y - 245 + "px";
      this.createPanel.left = picks.x - 170 + "px";
    },
    cesiumImgEvent() {
      const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        this.currentPoint
      );
      const point = this.Cartesian3_to_WGS84(this.currentPoint);
      if (point.lng < this.extent.west) {
        this.currentPoint = this.WGS84_to_Cartesian3([
          this.extent.west,
          (this.extent.south + this.extent.nonth) / 2
        ]);
        return;
      }
      if (point.lng > this.extent.east) {
        this.currentPoint = this.WGS84_to_Cartesian3([
          this.extent.east,
          (this.extent.south + this.extent.nonth) / 2
        ]);
        return;
      }
      this.imgPosition.top = picks.y - 5 + "px";
      this.imgPosition.left = picks.x - 13 + "px";
      const slider = document.getElementById("imgIcon");
      this.viewer.scene.imagerySplitPosition =
        picks.x / slider.parentElement.offsetWidth;
    },
    drapImg(evt) {
      if (evt.clientX > 0) {
        const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this.viewer.scene,
          this.currentPoint
        );
        this.currentPoint = this.getCartesian({
          x: evt.clientX,
          y: picks.y
        });
      }
    },
    removeEvent() {
      this.handlerList.forEach(item => {
        if (!item.isDestroyed()) {
          item.destroy();
        }
      });
      this.handlerList = [];
    },
    /**
     * 世界坐标转弧度
     */
    getCartographicFromCartesian3(cartesian3) {
      return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        cartesian3
      );
    },
    /**
     * 屏幕坐标转Cartesian3
     */
    getCartesian(position) {
      const ray = this.viewer.scene.camera.getPickRay(position);
      const point = this.viewer.scene.globe.pick(ray, this.viewer.scene);
      if (!point) {
        return;
      }
      const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        point
      );
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      return Cesium.Cartesian3.fromDegrees(lon, lat, height);
    },
    getWGS84(position) {
      const ray = this.viewer.scene.camera.getPickRay(position);
      const point = this.viewer.scene.globe.pick(ray, this.viewer.scene);
      if (!point) {
        return;
      }
      const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        point
      );
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      return {
        lon,
        lat
      };
    },
    /**
     * Cartesian3转WGS84
     */
    Cartesian3_to_WGS84(point) {
      var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var alt = cartographic.height;
      return { lat: lat, lng: lng, alt: alt };
    },
    /**
     * WGS84坐标转笛卡尔坐标系
     */
    WGS84_to_Cartesian3(point) {
      var ellipsoid = this.viewer.scene.globe.ellipsoid;

      var cartographic = Cesium.Cartographic.fromDegrees(point[0], point[1], 0);

      var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
      return cartesian3;
    },
    removeEntity() {
      this.entitiesList.forEach(item => {
        this.viewer.entities.remove(item);
      });
      this.entitiesList = [];
    },
    removeEntity2() {
      this.entitiesList2.forEach(item2 => {
        this.viewer.entities.remove(item2);
      });
      this.entitiesList2 = [];
    },
    removeEntity3() {
      this.entitiesList3.forEach(item2 => {
        this.viewer.entities.remove(item2);
      });
      this.entitiesList3 = [];
    },
    removeLastEntity3() {
      this.viewer.entities.remove(
        this.entitiesList3[this.entitiesList3.length - 1]
      );
      this.entitiesList3.pop();
    },
    removeLastEntity2() {
      this.viewer.entities.remove(
        this.entitiesList2[this.entitiesList2.length - 1]
      );
      this.entitiesList2.pop();
    },
    flyToByEntiy(entities) {
      this.viewer.flyTo(entities, {
        duration: 3.0,
        offset: new Cesium.HeadingPitchRange(0, -89, 0)
      });
    },
    goResettlement(item) {
      this.flyTo(item.new_long, item.new_lat, 4000);
    },
    goPeople(item) {
      this.flyTo(item.old_long, item.old_lat, 1000);
    },
    editCurrnetPeople() {
      this.formData = {
        area: this.currentPeople.area,
        number: this.currentPeople.number,
        reason: this.currentPeople.reason,
        time: this.currentPeople.time,
        movetime: this.currentPeople.movetime,
        old_long: this.currentPeople.old_long,
        old_lat: this.currentPeople.old_lat
      };
      this.showEdit = true;
    },
    saveEdit() {
      let param = {
        id: this.currentPeople.id
      };
      for (let key in this.formData) {
        if (this.formData[key] !== this.currentPeople[key]) {
          param[key] = this.formData[key];
        }
      }
      upDateMessage(param).then(res => {
        for (let i in param) {
          this.currentPeople[i] = param[i];
        }
        this.currentModel.position = this.WGS84_to_Cartesian3([
          this.currentPeople.old_long,
          this.currentPeople.old_lat
        ]);
      });
      this.showEdit = false;
    },
    goBackGreen(item) {
      this.clearLayers();
      this.currentModel.show = false;
      //const data = {
      //  extent: {
      //    miny: parseFloat(item.old_lat) - 0.002,
      //    minx: parseFloat(item.old_long) - 0.002,
      //    maxy: parseFloat(item.old_lat) + 0.002,
      //    maxx: parseFloat(item.old_long) + 0.002
      //  },
      //  format: "image/png",
      //  layer: this.greenUrl[this.currentUser],
      //  resolutions: [
      //    0.0000858306884765625,
      //    0.00004291534423828125,
      //    0.000021457672119140625,
      //    0.000010728836059570312,
      //    0.000005364418029785156,
      //    0.000002682209014892578
      //  ],
      //  srs: "EPSG:4326",
      //  type: "wmts",
      //  url: wmtsUrl,
      //  zoomStart: 13,
      //  zoomStop: 18
      //};
      //data.matrixIds = [];
      //for (let z = 0; z <= data.zoomStop; z += 1) {
      //  data.matrixIds[z] = `${data.srs}:${z}`;
      //}
      //this.currentLayer1 = new Cesium.ImageryLayer(
      //  new Cesium.UrlTemplateImageryProvider({
      //    url: layer1,
      //    tilingScheme: new Cesium.GeographicTilingScheme()
      //  })
      //);
      //this.viewer.imageryLayers.add(this.currentLayer1, 1);
      //this.addeRsettlementLayer(data, 2, true);
      this.extent = {
        south: parseFloat(item.old_lat) - 0.002,
        west: parseFloat(item.old_long) - 0.002,
        nonth: parseFloat(item.old_lat) + 0.002,
        east: parseFloat(item.old_long) + 0.002
      };
      this.currentLayer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: layer1,
          tilingScheme: new Cesium.GeographicTilingScheme(),
          rectangle: Cesium.Rectangle.fromDegrees(
            this.extent.west,
            this.extent.south,
            this.extent.east,
            this.extent.nonth
          )
        })
      );
      this.viewer.imageryLayers.add(this.currentLayer, 1);
      this.currentLayer.minificationFilter =
        Cesium.TextureMinificationFilter.NEAREST;
      this.currentLayer.magnificationFilter =
        Cesium.TextureMagnificationFilter.NEAREST;
      this.currentLayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
      this.showImageIcon = true;
      this.currentPoint = this.WGS84_to_Cartesian3([
        this.extent.west,
        (this.extent.south + this.extent.nonth) / 2
      ]);
      this.viewer.scene.postRender.addEventListener(this.cesiumImgEvent);
      this.addPolyline(
        [
          parseFloat(item.old_long) - 0.0005,
          parseFloat(item.old_lat) - 0.0005,
          parseFloat(item.old_long) + 0.0005,
          parseFloat(item.old_lat) - 0.0005,
          parseFloat(item.old_long) + 0.0005,
          parseFloat(item.old_lat) + 0.0005,
          parseFloat(item.old_long) - 0.0005,
          parseFloat(item.old_lat) + 0.0005,
          parseFloat(item.old_long) - 0.0005,
          parseFloat(item.old_lat) - 0.0005
        ],
        "#ff0000"
      );
      this.addPolyline(
        [
          parseFloat(item.old_long) - 0.002,
          parseFloat(item.old_lat) - 0.002,
          parseFloat(item.old_long) + 0.002,
          parseFloat(item.old_lat) - 0.002,
          parseFloat(item.old_long) + 0.002,
          parseFloat(item.old_lat) + 0.002,
          parseFloat(item.old_long) - 0.002,
          parseFloat(item.old_lat) + 0.002,
          parseFloat(item.old_long) - 0.002,
          parseFloat(item.old_lat) - 0.002
        ],
        "#ffd200"
      );
      this.addPoint(
        this.WGS84_to_Cartesian3([item.old_long, item.old_lat]),
        "#ff0000"
      );
      this.flyTo(item.old_long, item.old_lat, 1000);
    }
  }
};
</script>

<style scoped></style>
