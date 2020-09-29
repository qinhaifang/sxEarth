
import { Message, Loading } from 'element-ui';
import {
  wafang,
  singleSlopeAspect,
  gcsVisiblity
} from '../../api/statistic'

import cesiumCommon from "./cesiumCommon";
import echarts from "echarts";


class afterAjax {
  constructor() {
    this.myChart = null;
  }
  /**
   * 点点通视
   */
  pointToPointViewAfter(response, pointList) {
    viewer.scene.globe.depthTestAgainstTerrain = false;
    if (response.msg == "两点通视" || response.msg == "两点在一个格网内,可见") {
      Message({
        message: response.msg,
        type: 'success',
        duration: 5 * 1000,
        showClose: true,
      });
      cesiumCommon.lineItem(Cesium.Cartesian3.fromDegreesArrayHeights([
        pointList[0].lng,
        pointList[0].lat,
        pointList[0].alt + 2,
        pointList[1].lng,
        pointList[1].lat,
        pointList[1].alt + 2
      ]), Cesium.Color.fromCssColorString('#75bfc2'), 5);
    } else if (response.msg == "存在障碍点") {
      const zhangaiPoint = response.point;
      cesiumCommon.pointItem(Cesium.Cartesian3.fromDegrees(
        zhangaiPoint.x,
        zhangaiPoint.y,
        zhangaiPoint.z - 2
      ), Cesium.Color.YELLOW);
      cesiumCommon.lineItem(Cesium.Cartesian3.fromDegreesArrayHeights([
        pointList[0].lng,
        pointList[0].lat,
        pointList[0].alt + 2,
        zhangaiPoint.x,
        zhangaiPoint.y,
        zhangaiPoint.z - 2
      ]), Cesium.Color.fromCssColorString('#75bfc2'), 5);
      cesiumCommon.lineItem(Cesium.Cartesian3.fromDegreesArrayHeights([
        zhangaiPoint.x,
        zhangaiPoint.y,
        zhangaiPoint.z - 2,
        pointList[1].lng,
        pointList[1].lat,
        pointList[1].alt + 2
      ]), Cesium.Color.fromCssColorString('#ca3160'), 5);
    }
  }
  /**
   * 遮蔽分析
   */
  hideVeilServiceAfter(response, tuliMessage, currentTab, params) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    tuliMessage[currentTab].content[0].value = response.ratio.toFixed(4);
    const src = this.buildCanvas(response.rows, response.cols, response.vm);
    cesiumCommon.loadCanvas2(src, parseFloat(params.dis), [params.lon, params.lat]);
  }
  /**
   * 路径分析
   */
  ShortestPathServiceViewAfter(response) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const ptArray = response.resultList;
    ptArray.forEach((item) => {
      var positions = [];
      item.forEach((pt) => {
        positions.push(Cesium.Cartesian3.fromDegrees(pt.x, pt.y));
      });
      cesiumCommon.lineItem(positions, new Cesium.PolylineGlowMaterialProperty({
        color: Cesium.Color.fromCssColorString('#ca3160'),
        glowPower: 0.25
      }), 5, true);
    });
  }
  /**
   * 点面通视
   */
  visibility2ViewAfter(response) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const gisExtent = response.gisExtent;
    const src = this.buildCanvas(response.rows, response.cols, response.vm);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 剖面
   */
  sectionViewAfter(response, pointList, poumianMessage) {
    poumianMessage.startPointLng = pointList[0].lng.toFixed(4);
    poumianMessage.startPointLat = pointList[0].lat.toFixed(4);
    poumianMessage.endPointLng = pointList[1].lng.toFixed(4);
    poumianMessage.endPointLat = pointList[1].lat.toFixed(4);
    poumianMessage.maxHeight = response.maxH.toFixed(2);
    poumianMessage.minHeight = response.minH.toFixed(2);
    this.buildChart(response, '剖面分析结果');
  }
  /**
   * 距离量测
   */
  distanceViewAfter(response, cartesian) {
    const data = response.dis || response.l;
    cesiumCommon.pointItem(cartesian,
      Cesium.Color.WHITE.withAlpha(0),
      "距离:" + data.toFixed(2) + "米"
    );
    const point = cesiumCommon.Cartesian3_to_WGS84(cartesian);
    cesiumCommon.pointItem(
      { lng: point.lng, lat: point.lat },
      Cesium.Color.WHITE.withAlpha(0),
      "距离:" + data.toFixed(2) + "米"
    );
  }
  /**
   * 面积量测
   */
  areaViewAfter(response, cartesian) {
    cesiumCommon.pointItem(cartesian,
      Cesium.Color.WHITE.withAlpha(0),
      "面积为:" + response.area.toFixed(2) + response.msg
    );
    const point = cesiumCommon.Cartesian3_to_WGS84(cartesian);
    cesiumCommon.pointItem(
      { lng: point.lng, lat: point.lat },
      "面积为:" + response.area.toFixed(2) + response.msg
    );
  }
  /**
   * 缓冲区
   */
  bufferViewAfter(response) {
    let obj = JSON.parse(response.geometry);
    cesiumCommon.showGeojson(obj);
  }
  /**
   * 淹没
   */
  headFloodViewAfter(response) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const gisExtent = response.gisExtent;
    const rows = response.rows;
    const cols = response.cols;
    const vm = response.flooded;
    let color = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (vm[i][j] == 0) {
          color.push(117);
          color.push(190);
          color.push(193);
          color.push(100);
        } else if (vm[i][j] == 1) {
          color.push(255);
          color.push(56);
          color.push(116);
          color.push(100);
        } else {
          color.push(255);
          color.push(0);
          color.push(0);
          color.push(0);
        }
      }
    }
    const src = this.createCanvas(rows, cols, color);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 挖填方
   */
  wafangViewAfter(maxH, pointList, params, wafangLevel, tuliMessage, currentTab) {
    const rect = {
      minX: Math.min(pointList[0].lng, pointList[1].lng),
      maxX: Math.max(pointList[0].lng, pointList[1].lng),
      minY: Math.min(pointList[0].lat, pointList[1].lat),
      maxY: Math.max(pointList[0].lat, pointList[1].lat),
      maxH,
    };
    const wheight = -Number(wafangLevel) + maxH;
    cesiumCommon.rectItem2(Cesium.Rectangle.fromDegrees(rect.minX,
      rect.minY,
      rect.maxX,
      rect.maxY,
    ),
      new Cesium.ImageMaterialProperty({
        image: "../../../../static/groundlib/excavationregion_side.jpg",
        repeat: new Cesium.Cartesian2(1, 1)
      }), Number(wafangLevel))
    cesiumCommon.wallItem(Cesium.Cartesian3.fromDegreesArray([
      rect.minX,
      rect.minY,
      rect.maxX,
      rect.minY,
      rect.maxX,
      rect.maxY,
      rect.minX,
      rect.maxY,
      rect.minX,
      rect.minY,
    ]),
      [maxH, maxH, maxH, maxH, maxH],
      [Number(wafangLevel), Number(wafangLevel), Number(wafangLevel), Number(wafangLevel), Number(wafangLevel)],
      new Cesium.ImageMaterialProperty({
        image: "../../../../static/groundlib/excavationregion_top.jpg",
        repeat: new Cesium.Cartesian2(1, 1)
      }));
    const width = cesiumCommon.getFlatternDistance(rect.minY, rect.minX, rect.maxY, rect.minX);
    const height = cesiumCommon.getFlatternDistance(rect.minY, rect.minX, rect.minY, rect.maxX);
    const position = Cesium.Cartesian3.fromDegrees(rect.minX + (rect.maxX - rect.minX) / 2, rect.minY + (rect.maxY - rect.minY) / 2, wheight);
    const box = cesiumCommon.boxItem(position, height, width, Cesium.Color.WHITE.withAlpha(0.3))
    const en = box.computeModelMatrix(Cesium.JulianDate.now()).clone();
    viewer.entities.remove(box);
    const globe = viewer.scene.globe;
    globe.depthTestAgainstTerrain = true;
    globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      modelMatrix: en,
      planes: [
        new Cesium.Plane(new Cesium.Cartesian3(1.0, 0.0, 0.0), -height / 2),
        new Cesium.Plane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), -height / 2),
        new Cesium.Plane(new Cesium.Cartesian3(0.0, 1.0, 0.0), -width / 2),
        new Cesium.Plane(new Cesium.Cartesian3(0.0, -1.0, 0.0), -width / 2),
      ],
    });
    params.wafangLevel = wafangLevel;
    params.dataModel = '0';
    wafang(params).then((response) => {
      if (response.data.isSuccess == 1) {
        for (let i = 0; i < 2; i++) {
          tuliMessage[currentTab].content[i].value = response.data[tuliMessage[currentTab].content[i].key].toFixed(2) + 'm³';
        }
        const text = "挖方:" + response.data.wafangVbm.toFixed(2) + "m³," + "填方:" + response.data.tianfangVbm.toFixed(2) + "m³"
        cesiumCommon.pointItem(Cesium.Cartesian3.fromDegrees(rect.minX + (rect.maxX - rect.minX) / 2, rect.minY + (rect.maxY - rect.minY) / 2, maxH + 500),
          Cesium.Color.WHITE.withAlpha(0),
          text);
      } else {
        Message({
          message: '服务请求失败！',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        });
      }
    })
  }
  /**
   * 坡度坡向
   */
  slopeViewAfter(res, tuliMessage, currentTab) {
    let canvas = document.createElement("canvas");
    const colors = [];
    let minNumber = 90;
    let maxNumber = 0;
    res.slope.forEach(function (item) {
      if (item < minNumber) {
        minNumber = item;
      }
      if (item > maxNumber) {
        maxNumber = item;
      }
    })
    const tempNumber = (maxNumber - minNumber) / 8;
    if (tempNumber != 0) {
      tuliMessage[currentTab].content[0].value = "≤" + ~~(minNumber + tempNumber) + '°';
      tuliMessage[currentTab].content[1].value = ~~(minNumber + tempNumber) + '°' + "-" + ~~(minNumber + 2 * tempNumber) + '°';
      tuliMessage[currentTab].content[2].value = ~~(minNumber + 2 * tempNumber) + '°' + "-" + ~~(minNumber + 3 * tempNumber) + '°';
      tuliMessage[currentTab].content[3].value = ~~(minNumber + 3 * tempNumber) + '°' + "-" + ~~(minNumber + 4 * tempNumber) + '°';
      tuliMessage[currentTab].content[4].value = ~~(minNumber + 4 * tempNumber) + '°' + "-" + ~~(minNumber + 5 * tempNumber) + '°';
      tuliMessage[currentTab].content[5].value = ~~(minNumber + 5 * tempNumber) + '°' + "-" + ~~(minNumber + 6 * tempNumber) + '°';
      tuliMessage[currentTab].content[6].value = ~~(minNumber + 6 * tempNumber) + '°' + "-" + ~~(minNumber + 7 * tempNumber) + '°';
      tuliMessage[currentTab].content[7].value = ~~(minNumber + 7 * tempNumber) + '°' + "-" + ~~(minNumber + 8 * tempNumber) + '°';
      tuliMessage[currentTab].content[7].value = ~~(minNumber + 8 * tempNumber) + '°' + "-" + Math.ceil(maxNumber) + '°';
    }
    res.slope.forEach(function (value) {
      if (value <= minNumber + tempNumber) {
        colors.push("124,178,87");
      } else if (value < minNumber + 2 * tempNumber) {
        colors.push("65,108,36");
      } else if (value < minNumber + 3 * tempNumber) {
        colors.push("35,76,7");
      } else if (value < minNumber + 4 * tempNumber) {
        colors.push("5,53,3");
      } else if (value < minNumber + 5 * tempNumber) {
        colors.push("27,107,98");
      } else if (value < minNumber + 6 * tempNumber) {
        colors.push("32,85,87");
      } else if (value < minNumber + 7 * tempNumber) {
        colors.push("7,51,53");
      } else if (value < minNumber + 8 * tempNumber) {
        colors.push("8,43,44");
      } else if (value >= minNumber + 8 * tempNumber) {
        colors.push("4,31,31");
      }
    })
    let color = [];
    colors.forEach(function (item) {
      let rgbArr = item.split(',');
      color.push(rgbArr[0]);
      color.push(rgbArr[1]);
      color.push(rgbArr[2]);
      color.push(100);
    })
    canvas.setAttribute("width", res.cols + 'px')
    canvas.setAttribute("height", res.rows + 'px')
    let ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(res.cols, res.rows);//创建新的、空白的 ImageData 对象
    for (let x = 0; x < imgData.width; x++) {
      for (let y = 0; y < imgData.height; y++) {
        const index = (y * imgData.width + x) * 4;
        imgData.data[index] = color[index];
        imgData.data[index + 1] = color[index + 1];
        imgData.data[index + 2] = color[index + 2];
        imgData.data[index + 3] = color[index + 3];
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const src = canvas.toDataURL("image/png");
    cesiumCommon.loadCanvas(res, src);
  }
  /**
   * 点高程坡度坡向
   */
  singleptViewAfter(res, params, tipMessage, point) {
    singleSlopeAspect(params).then((response) => {
      if (response.data.isSuccess === 1) {
        const res1 = response.data;
        tipMessage.height = res.height.toFixed(2);
        tipMessage.slope = res1.slope.toFixed(2);
        tipMessage.aspect = res1.aspect.toFixed(2);
        viewer.scene.postRender.addEventListener(() => {
          const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, point);
          tipMessage.top = (picks.y - 128) + 'px';
          tipMessage.left = (picks.x - 95) + 'px';
        })
      }
    })
  }
  /**
   * 两点方位角
   */
  azimuthServiceViewAfter(res, positions) {
    cesiumCommon.lineItem(positions, Cesium.Color.CORNFLOWERBLUE, 3);
    cesiumCommon.pointItem(positions[1],
      Cesium.Color.WHITE.withAlpha(0),
      '两点方位角为：' + res.angle.toFixed(2) + res.msg
    );
  }
  /**
   * 方位角量测
   */
  azimuthMeasureServiceViewAfter(res, positions) {
    cesiumCommon.lineItem(positions, Cesium.Color.CORNFLOWERBLUE, 3);
    cesiumCommon.pointItem(positions[1],
      Cesium.Color.WHITE.withAlpha(0),
      '方位角为：' + res.angle.toFixed(2) + res.msg
    );
  }
  /**
   * 点预测
   */
  azimuthDistanceServiceViewAfter(res) {
    cesiumCommon.pointItem(Cesium.Cartesian3.fromDegrees(res.endLon, res.endLat),
      Cesium.Color.fromCssColorString('#ca3160'),
      '预测点坐标：[' + res.endLon.toFixed(2) + ',' + res.endLat.toFixed(2) + ']'
    );
    viewer.scene.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(res.endLon, res.endLat, 100000) });
  }
  /**
   * 高程统计
   */
  heightAreaServiceViewAfter(response, pointList, poumianMessage) {
    poumianMessage.startPointLng = response.min_x.toFixed(4);
    poumianMessage.startPointLat = response.min_y.toFixed(4);
    poumianMessage.endPointLng = response.max_x.toFixed(4);
    poumianMessage.endPointLat = response.max_y.toFixed(4);
    poumianMessage.maxHeight = response.maxH.toFixed(2);
    poumianMessage.minHeight = response.minH.toFixed(2);
    poumianMessage.averageH = response.averageH.toFixed(2);
    this.buildChart(response, '高程统计结果');
  }
  /**
   * 等高线提取
   */
  contourViewAfter(res) {
    res.resultList.forEach(function (item) {
      let index = 0;
      let pointsArr = [];
      item.forEach(function (data) {
        index++;
        pointsArr.push(data.p.x);
        pointsArr.push(data.p.y);
      });
      cesiumCommon.lineGeometry(Cesium.Cartesian3.fromDegreesArray(pointsArr),
        Cesium.Color.YELLOW,
        1);
    });
  }
  /**
   * 阴影分析
   */
  shadowServiceViewAfter(res) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const gisExtent = res.gisExtent;
    const rows = res.rows;
    const cols = res.rows;
    const vm = res.hillShade;
    let color = [];
    vm.forEach(function (value) {
      color.push(value);
      color.push(value);
      color.push(value);
      color.push(255);
    })
    const src = this.createCanvas(rows, cols, color);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 观察所分析
   */
  watchHouseViewAfter(res, geometry) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    res.resultList.forEach((item) => {
      const cartesian = Cesium.Cartesian3.fromDegrees(item.x, item.y);
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      const height = viewer.scene.globe.getHeight(cartographic);
      cesiumCommon.billboardItem(Cesium.Cartesian3.fromDegrees(item.x, item.y, height)
        , "../../../../static/image/eye.png");
    });
    const gisExtent = res.gisExtent;
    cesiumCommon.rectItem2(new Cesium.Rectangle.fromDegrees(gisExtent.xMin, gisExtent.yMin, gisExtent.xMax, gisExtent.yMax)
      , Cesium.Color.WHITE.withAlpha(0.4));
    viewer.scene.camera.flyTo({ destination: Cesium.Rectangle.fromDegrees(gisExtent.xMin, gisExtent.yMin, gisExtent.xMax, gisExtent.yMax) });
    const width = (gisExtent.xMax - gisExtent.xMin) / 20;
    const height = (gisExtent.yMax - gisExtent.yMin) / 20;
    this.watchHouseTongShi(geometry, res.resultList, width, height);
  }
  watchHouseTongShi(geometry, list, width, height) {
    const _this = this;
    var handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    cesiumCommon.handlerList.push(handler);
    handler.setInputAction(function (movement) {
      const cartesian = cesiumCommon.getCartesian(movement.position);
      if (!cartesian) {
        return
      }
      let ind = -1;
      const point = cesiumCommon.Cartesian3_to_WGS84(cartesian);
      list.forEach((item, index) => {
        if (Math.abs(point.lng - item.x) < width && Math.abs(point.lat - item.y) < height) {
          ind = index;
        }
      });
      if (ind < 0) {
        return
      }
      const loading = Loading.service({
        lock: true,
        text: '正在计算中，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      gcsVisiblity({
        demTileLevel: cesiumCommon.getZoom(),
        geometry: geometry,
        lon: list[ind].x,
        lat: list[ind].y,
      }).then((response) => {
        loading.close();
        if (response.data.isSuccess == 1) {
          viewer.entities.remove(cesiumCommon.entitiesList[cesiumCommon.entitiesList.length - 1]);
          var gisExtent = response.data.gisExtent;
          var cols = response.data.cols;
          var rows = response.data.rows;
          var vm = response.data.vm;
          let src = _this.buildCanvas(rows, cols, vm);
          cesiumCommon.loadCanvas({
            "min_x": gisExtent.xMin,
            "max_x": gisExtent.xMax,
            "min_y": gisExtent.yMin,
            "max_y": gisExtent.yMax
          }, src);
        } else {
          Message({
            message: '服务请求失败！',
            type: 'error',
            duration: 5 * 1000,
            showClose: true,
          });
        }
      });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  /**
   * 直瞄分析
   */
  directAimViewAfter(res) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.entities.remove(cesiumCommon.entitiesList[cesiumCommon.entitiesList.length - 1]);
    const gisExtent = res.gisExtent;
    const rows = res.rows;
    const cols = res.rows;
    const vm = res.aimedMatrix;
    let color = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        switch (vm[i][j]) {
          case 4:
            color.push(117);
            color.push(190);
            color.push(193);
            color.push(100);
            break;
          case 3:
            color.push(193);
            color.push(232);
            color.push(0);
            color.push(100);
            break;
          case 2:
            color.push(255);
            color.push(128);
            color.push(0);
            color.push(100);
            break;
          case 1:
            color.push(255);
            color.push(56);
            color.push(116);
            color.push(100);
            break;
          default:
            color.push(255);
            color.push(255);
            color.push(255);
            color.push(0);
            break;
        }
      }
    }
    const src = this.createCanvas(rows, cols, color);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 间瞄分析
   */
  indirectAimViewAfter(res) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.entities.remove(cesiumCommon.entitiesList[cesiumCommon.entitiesList.length - 1]);
    const gisExtent = res.gisExtent;
    const rows = res.rows;
    const cols = res.rows;
    const vm = res.aimedMatrix;
    let color = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        switch (vm[i][j]) {
          case 2:
            color.push(117);
            color.push(190);
            color.push(193);
            color.push(100);
            break;
          case 1:
            color.push(255);
            color.push(56);
            color.push(116);
            color.push(100);
            break;
          default:
            color.push(255);
            color.push(255);
            color.push(255);
            color.push(0);
            break;
        }
      }
    }
    const src = this.createCanvas(rows, cols, color);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 空降场选址分析
   */
  kjcxzViewAfter(res) {
    viewer.scene.globe.depthTestAgainstTerrain = false;
    const list = res.resultList;
    list.forEach((item, index) => {
      let part = [];
      item.gridV.forEach((e) => {
        part.push(e.x);
        part.push(e.y);
      })
      cesiumCommon.PolygonGeometry(Cesium.Cartesian3.fromDegreesArray(part),
        Cesium.Color.YELLOW.withAlpha(0.3));
      const cartesian = Cesium.Cartesian3.fromDegrees(item.gridV[0].x, item.gridV[0].y);
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      const height = viewer.scene.globe.getHeight(cartographic);
      cesiumCommon.pointItem(Cesium.Cartesian3.fromDegrees(item.gridV[0].x, item.gridV[0].y,height),
        Cesium.Color.WHITE.withAlpha(0),
        `面积:${res.area[index]}平方米`
      );
    })
  }
  /**
   * 核防护分析
   */
  nuclearProtectionViewAfter(res) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const gisExtent = res.gisExtent;
    const rows = res.rows;
    const cols = res.cols;
    const vm = res.nucleusArr;
    let color = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const v = i * cols + j;
        switch (vm[v]) {
          case 1:
            color.push(255);
            color.push(56);
            color.push(116);
            color.push(100);
            break;
          default:
            color.push(255);
            color.push(255);
            color.push(255);
            color.push(0);
            break;
        }
      }
    }
    const src = this.createCanvas(rows, cols, color);
    cesiumCommon.loadCanvas({
      "min_x": gisExtent.xMin,
      "max_x": gisExtent.xMax,
      "min_y": gisExtent.yMin,
      "max_y": gisExtent.yMax
    }, src);
  }
  /**
   * 道路机动
   */
  RouterServiceViewAfter(response) {
    const plans = response.plans;
    if (plans) {
      plans.forEach((plan) => {
        plan.routes.forEach((route) => {
          let positions = [];
          route.path.forEach(pt => {
            positions.push(Cesium.Cartesian3.fromDegrees(pt[0], pt[1]));
          });
          cesiumCommon.lineItem(positions, new Cesium.PolylineGlowMaterialProperty({
            glowPower: .2,
            color: Cesium.Color.BLUE
          }), 10, true);
        });
      });
    }
  }
  /**
   * 叠置分析
   */
  overlayViewAfter(res) {
    let data = res.featureInfo.features;
    cesiumCommon.showGeojson2(data);
  }
  /**
   * 地貌分析
   */
  morphologicViewAfter(response, radioModel, cartesian) {
    let dataArray = [];
    switch (radioModel) {
      case 1:
        dataArray = response.moutainList;
        dataArray.forEach((item) => {
          cesiumCommon.pointItem(
            Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z),
            Cesium.Color.WHITE,
            "山顶点"
          );
        })
        break;
      case 2:
        dataArray = response.saddleList;
        dataArray.forEach((item) => {
          cesiumCommon.pointItem(
            Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z),
            Cesium.Color.WHITE,
            "鞍部点"
          );
        })
        break;
      case 3:
      case 4:
      case 5:
        dataArray = response.resultLine;
        dataArray.forEach((item) => {
          let index = 0;
          let pointsArr = [];
          item.gridV.forEach(function (data) {
            index++;
            pointsArr.push(data.x);
            pointsArr.push(data.y);
          });
          cesiumCommon.lineGeometry(
            Cesium.Cartesian3.fromDegreesArray(pointsArr),
            Cesium.Color.fromCssColorString('#FF3874'),
            2
          );
        });
        break;
      case 6:
        cesiumCommon.pointItem(cartesian,
          Cesium.Color.WHITE.withAlpha(0),
          "地形为:" + response.type
        );
        const point = cesiumCommon.Cartesian3_to_WGS84(cartesian);
        cesiumCommon.pointItem(
          { lng: point.lng, lat: point.lat },
          "地形为:" + response.type
        );
        break;
    }
  }


  buildCanvas(rows, cols, vm) {
    let color = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (vm[i * cols + j] == 1) {
          color.push(117);
          color.push(190);
          color.push(193);
          color.push(100);
        } else if (vm[i * cols + j] == 0) {
          color.push(255);
          color.push(56);
          color.push(116);
          color.push(100);
        } else {
          color.push(255);
          color.push(0);
          color.push(0);
          color.push(0);
        }
      }
    }
    const canvas = this.createCanvas(rows, cols, color);
    return canvas;
  }
  createCanvas(rows, cols, color) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", cols + 'px');
    canvas.setAttribute("height", rows + 'px');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(cols, rows);
    for (let x = 0; x < imgData.width; x++) {
      for (let y = 0; y < imgData.height; y++) {
        const index = (y * imgData.width + x) * 4;
        imgData.data[index] = color[index];
        imgData.data[index + 1] = color[index + 1];
        imgData.data[index + 2] = color[index + 2];
        imgData.data[index + 3] = color[index + 3];
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/png");
  }
  buildChart(response, title) {
    this.myChart = echarts.init(document.getElementById('echartsDiv'));
    const data = response.data;
    const xyzData = response.ptLocation;
    let xAxis_data = [];
    let yAxis_data = [];
    for (let i = 0; i < data.length; i++) {
      xAxis_data.push(data[i][0]);
      yAxis_data.push(data[i][1]);
    }
    const option = {
      grid: {
        show: true,
        left: '8%',
        right: '12%',
        bottom: '40',
        top: '40',
        backgroundColor: 'rgba(24,31,40,0.6)'
      },
      textStyle: { color: '#D2D2D2' },
      tooltip: {
        backgroundColor: '#56d9ed'
      },
      legend: {
        data: ['高程']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis_data,
        name: '距离：千米',
        nameLocation: 'end',
        nameGap: 5,
        nameTextStyle: {
          color: '#56d9ed'
        },
        axisLine: {
          lineStyle: {
            color: '#666',
            width: 1,
            type: 'solid'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
            width: 2,
          }
        }
      },
      yAxis: {
        scale: true,
        type: 'value',
        name: '距离：米',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: '#56d9ed'
        },
        axisLine: {
          lineStyle: {
            color: '#666',
            width: 1,
            type: 'solid'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
            width: 2,
          }
        }
      },
      series: [{
        data: yAxis_data,
        type: 'line',
        smooth: 0.5,
        lineStyle: {
          color: '#56D9ED'
        }
      }]
    };
    this.myChart.setOption(option);
    this.myChart.on('click', function (param) {
      var temp = Number(param.name);
      var point;
      for (var i = 0; i < data.length; i++) {
        if (data[i][0] == temp) {
          point = xyzData[i];
        }
      }
      if (point != undefined) {
        let pointMark;
        const heightType = Cesium.HeightReference.CLAMP_TO_GROUND;
        if (pointMark != undefined) {
          viewer.entities.remove(pointMark);
        }
        pointMark = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z),
          point: {
            color: Cesium.Color.fromCssColorString('#ca3160'),
            pixelSize: 5,
            heightReference: heightType
          }
        });
        cesiumCommon.entitiesList.push(pointMark);
        viewer.scene.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z + 500) });
      }
    })
  }
}
const viewerAfter = new afterAjax();
export default viewerAfter
