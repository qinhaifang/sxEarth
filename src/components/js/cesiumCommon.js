const tile = window.UrlSetting.TILES_URL;

class cesiumMethods {
  constructor() {
    this.entitiesList = [];
    this.primitivesList = [];
    this.handlerList = [];
    this.tile3d = null;
  }
  /**
   * 获取当前图层层级
   */
  getZoom() {
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cameraHeight = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    const moveRate = cameraHeight / 1000.0;
    if (moveRate > 10123) {
      return 2;
    } else if (moveRate > 7123) {
      return 3;
    } else if (moveRate > 6321) {
      return 4;
    } else if (moveRate > 5522) {
      return 5;
    } else if (moveRate > 3436) {
      return 6;
    } else if (moveRate > 539) {
      return 7;
    } else if (moveRate > 305) {
      return 8;
    } else if (moveRate > 180) {
      return 9;
    } else if (moveRate > 133) {
      return 10;
    } else if (moveRate > 100) {
      return 11;
    } else if (moveRate > 76.5) {
      return 12;
    } else if (moveRate > 58.2) {
      return 13;
    } else if (moveRate > 23.5) {
      return 14;
    } else if (moveRate > 9.6) {
      return 15;
    } else if (moveRate > 4) {
      return 16;
    } else if (moveRate > 2) {
      return 17;
    } else if (moveRate > 1.7) {
      return 18;
    } else if (moveRate > 1.5) {
      return 19;
    } else if (moveRate > 1) {
      return 20;
    } else {
      return 18;
    }
  }
  /**
   * 添加点的鼠标事件
   */
  buildPoint(params, positions, callBack) {
    //计数器
    let count = 0;
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    this.handlerList.push(handler);
    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      if (params.count > 2) {
        params.text.splice(1, 0, params.text[1]);
      }
      positions.push(cartesian);
      this.pointItem(cartesian, Cesium.Color.WHITE, params.text[count]);
      Bus.$emit("addPoint", this.Cartesian3_to_WGS84(cartesian), params.text[count]);
      count++;
      if (count == params.count) {
        this.handerDestroy(handler);
        Bus.$emit('changeButton', {});
        if (params.isNeedStep2) {
          Bus.$emit(params.isNeedStep2, JSON.parse(JSON.stringify(positions)));
        } else if (params.addParameter) {
          Bus.$emit('changeParameterShow', true);
        } else {
          callBack();
        }
      }
      //add by niulei start
      if (!params.measureFlag) {
        return false;
      }
      handler.setInputAction((movement) => {
        const cartesian = this.getCartesian(movement.position);
        if (!cartesian) {
          return;
        }
        //消除第二个点以及测量结果
        this.entitiesList.forEach((item) => {
          item.show = false;
          viewer.entities.remove(item);
        });
        this.entitiesList = [];

        positions[1] = cartesian;
        callBack();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //add by niulei end
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction((movement) => {
      document.oncontextmenu = function () {
        return false;
      };
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      positions.push(cartesian);
      this.pointItem(cartesian, Cesium.Color.WHITE, params.text[params.text.length - 1]);
      Bus.$emit("addPoint", this.Cartesian3_to_WGS84(cartesian), params.text[count]);
      count++;
      this.handerDestroy(handler);
      if (params.isNeedStep2) {
        Bus.$emit(params.isNeedStep2, JSON.parse(JSON.stringify(positions)));
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 添加线的鼠标事件
   */
  buildLine(params, positions, callBack) {
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    this.handlerList.push(handler);
    this.lineItem(positions, Cesium.Color.CORNFLOWERBLUE, 3, true);
    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      if (positions.length == 0) {
        positions.push(cartesian);
      }
      positions.push(cartesian);
      if (positions.length == params.count) {
        positions.pop();
        this.handerDestroy(handler);
        Bus.$emit('changeButton', {});
        if (params.addParameter) {
          Bus.$emit('changeParameterShow', true);
        } else {
          callBack();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.endPosition);
      if (positions.length >= 2) {
        positions.pop();
        positions.push(cartesian);
      }
      let list = [];
      positions.forEach((item) => {
        const WGS84 = this.Cartesian3_to_WGS84(item)
        list.push([WGS84.lng, WGS84.lat])
      })
      Bus.$emit("drawLine", list)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
      document.oncontextmenu = function () {
        return false;
      };
      this.handerDestroy(handler);
      Bus.$emit('changeButton', {});
      if (params.addParameter) {
        Bus.$emit('changeParameterShow', true);
      } else {
        callBack();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 添加多边形的鼠标事件
   */
  buildPoly(params, positions, callBack) {
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    this.handlerList.push(handler);
    this.polyItem(positions, Cesium.Color.GREEN.withAlpha(0.5));
    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      if (positions.length == 0) {
        positions.push(cartesian);
      }
      positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.endPosition);
      if (positions.length >= 2) {
        positions.pop();
        positions.push(cartesian);
        let list = [];
        positions.forEach((item) => {
          const point = this.Cartesian3_to_WGS84(item);
          list.push([
            point.lng,
            point.lat,
          ])
        });
        const point0 = this.Cartesian3_to_WGS84(positions[0]);
        list.push([
          point0.lng,
          point0.lat,
        ])
        Bus.$emit("drawPolygon", [list])
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
      document.oncontextmenu = function () {
        return false;
      };
      this.handerDestroy(handler);
      this.currentButton = {};
      Bus.$emit('changeButton', {});
      if (params.addParameter) {
        Bus.$emit('changeParameterShow', true);
      } else {
        callBack();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 添加矩形的鼠标事件
   */
  buildRect(params, positions, callBack) {
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    this.handlerList.push(handler);
    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      if (positions.length == 0) {
        positions.push(cartesian);
      }
      positions.push(cartesian);
      this.rectItem(positions, Cesium.Color.GREEN.withAlpha(0.5));
      if (positions.length == params.count) {
        positions.pop();
        this.handerDestroy(handler);
        Bus.$emit('changeButton', {});
        if (params.addParameter) {
          Bus.$emit('changeParameterShow', true);
        } else {
          callBack();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.endPosition);
      if (positions.length >= 2) {
        positions.pop();
        positions.push(cartesian);
        let list = [];
        positions.forEach((item) => {
          list.push(this.Cartesian3_to_WGS84(item))
        });
        const pointList = [
          [list[0].lng, list[0].lat],
          [list[1].lng, list[0].lat],
          [list[1].lng, list[1].lat],
          [list[0].lng, list[1].lat],
          [list[0].lng, list[0].lat]
        ];
        Bus.$emit("drawPolygon", [pointList]);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  /**
   * 画点
   */
  pointItem(cartesian, color, text) {
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        color,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.clampToGround
      },
      label: {
        text,
        font: '14px Helvetica',
        fillColor: Cesium.Color.SKYBLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      }
    });
    this.entitiesList.push(point);
  }
  /**
   * 画线
   */
  lineItem(lineList, material, width, clampToGround) {
    function callBallLine() {
      return lineList
    }

    const line = viewer.entities.add({
      polyline: {
        show: true,
        positions: new Cesium.CallbackProperty(callBallLine, false),
        material,
        width,
        clampToGround
      }
    });
    this.entitiesList.push(line);
  }
  lineGeometry(positions, material, width) {
    const primitive = new Cesium.GroundPolylinePrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.GroundPolylineGeometry({
          positions,
          width
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(material),
        }

      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: false
      })

    });
    const primitiveObj = viewer.scene.primitives.add(primitive);
    this.primitivesList.push(primitiveObj);
  }
  /**
   * 画多边形
   */
  polyItem(polyList, material) {
    function callBallLine() {
      return polyList
    }

    const poly = viewer.entities.add({
      polygon: {
        show: true,
        hierarchy: new Cesium.CallbackProperty(callBallLine, false),
        material,
      }
    });
    this.entitiesList.push(poly);
  }
  /**
   * 空降场选址分析画多边形
   */
  PolygonGeometry(polyList, material) {
    const primitive = new Cesium.GroundPrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(polyList),
        }),
      }),
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: material
        })
      })
    });
    const primitiveObj = viewer.scene.primitives.add(primitive);
    this.primitivesList.push(primitiveObj);
  }


  /**
   * 画矩形（方法1）
   */
  rectItem(rectList, material) {
    const _this = this;
    function callBackPos() {
      const rects = [];
      rectList.forEach((item) => {
        rects.push(_this.getCartographicFromCartesian3(item));
      });
      return _this.getRectangleFromPoint(rects);
    }

    const rectangle = viewer.entities.add({
      rectangle: {
        coordinates: new Cesium.CallbackProperty(callBackPos, false),
        material
      },
    });
    this.entitiesList.push(rectangle);
  }
  /**
   * 画矩形（方法2）
   */
  rectItem2(coordinates, material, height) {
    const rectangle = viewer.entities.add({
      rectangle: {
        coordinates,
        material,
        height
      },
    });
    this.entitiesList.push(rectangle);
  }
  /**
   * 画墙
   */
  wallItem(positions, maximumHeights, minimumHeights, material) {
    const wall = viewer.entities.add({
      wall: {
        positions,
        maximumHeights,
        minimumHeights,
        material
      }
    });
    this.entitiesList.push(wall);
  }
  /**
   * 画盒子
   */
  boxItem(position, height, width, material) {
    const box = viewer.entities.add({
      position: position,
      box: {
        dimensions: new Cesium.Cartesian3(height, width, 5000),
        material,
      }
    });
    this.entitiesList.push(box);
    return box;
  }
  /**
   * 画图标
   */
  billboardItem(position, image) {
    const icon = viewer.entities.add({
      position: position,
      billboard: {
        image,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        width: 30,
        height: 30
      }
    });
    this.entitiesList.push(icon);
  }
  /**
   * 画Canvas(矩形)
   */
  loadCanvas(res, src) {
    const canvas = viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(res.min_x, res.min_y, res.max_x, res.max_y),
        material: new Cesium.ImageMaterialProperty({
          image: src,
          translucent: true,
          repeat: new Cesium.Cartesian2(1, 1)
        }),
      }
    });
    this.entitiesList.push(canvas);
  }
  /**
   * 画Canvas(圆形)
   */
  loadCanvas2(src, dis, center) {
    const ellipse = viewer.entities.add({
      name: 'ellipse',
      position: Cesium.Cartesian3.fromDegrees(center[0], center[1], center[1]),
      ellipse: {
        semiMajorAxis: dis, // 长轴长度
        semiMinorAxis: dis, // 短轴长度
        material: new Cesium.ImageMaterialProperty({
          image: src,
          translucent: true,
          repeat: new Cesium.Cartesian2(1, 1)
        })
      },
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    });
    this.entitiesList.push(ellipse);
  }
  /**
   * geojson形式的多边形
   */
  showGeojson(data) {
    let geojson = {
      "type": "Feature",
      "geometry": '',
      "properties": {
        "name": "Dinagat Islands"
      }
    };
    geojson.geometry = data;
    const viewPosition = this.addSources(geojson, 3);
    viewer.flyTo(viewPosition);
  }
  showGeojson2(data) {
    data.forEach(function (geojson) {
      this.addSources(geojson, 8);
    })
  }
  addSources(geojson, strokeWidth) {
    return viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geojson, {
      stroke: Cesium.Color.HOTPINK,
      fill: Cesium.Color.fromCssColorString('#75BEC1').withAlpha(0.2),
      strokeWidth,
      markerSymbol: 'aaa',
      clampToGround: true
    })
    );
  }
  /**
   * 屏幕坐标转Cartesian3
   */
  getCartesian(position) {
    if (this.tile3d) {
      return viewer.scene.pickPosition(position);
    }
    const ray = viewer.scene.camera.getPickRay(position);
    const point = viewer.scene.globe.pick(ray, viewer.scene);
    const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
      point
    );
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height;
    return Cesium.Cartesian3.fromDegrees(
      lon,
      lat,
      height
    )
    // return viewer.scene.camera.pickEllipsoid(
    //   position,
    //   viewer.scene.globe.ellipsoid
    // );

  }
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
  }
  /**
   /**
   * 世界坐标转弧度
   */
  getCartographicFromCartesian3(cartesian3) {
    return viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
  }
  /**
   * 转换点为矩形范围
   */
  getRectangleFromPoint(points) {
    return Cesium.Rectangle.fromCartographicArray(points);
  }
  /**
   * 计算两点间距离
   */
  getFlatternDistance(lat1, lng1, lat2, lng2) {
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;

    function getRad(d) {
      return d * PI / 180.0;
    }

    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  }
  /**
   * 清空鼠标事件
   */
  handerDestroy(handler) {
    handler.destroy();
    Bus.$emit('changeCursor');
  }
  /**
   * 切换倾斜摄影
   */
  toggle3dTile(bool) {
    if (bool) {
      this.tile3d = new Cesium.Cesium3DTileset({
        url: tile
      });
      viewer.scene.primitives.add(this.tile3d);
      viewer.zoomTo(this.tile3d);
    } else {
      viewer.scene.primitives.remove(this.tile3d);
      this.tile3d = null;
      viewer.scene.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(121, 23, 531800) });
    }
  }
   /**
   * 添加矩形的鼠标事件-仅cesium球上
   */
  buildCesiumRect(callBack){
    let position = [];
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );
    this.handlerList.push(handler);
    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.position);
      if (!cartesian) {
        return;
      }
      if (position.length == 0) {
        position.push(cartesian);
      }
      position.push(cartesian);
      this.rectItem(position, Cesium.Color.GREEN.withAlpha(0.5));
      if (position.length == 3) {
        position.pop();
        this.removeEvent();
        this.clearHandle();
        callBack(position);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
      const cartesian = this.getCartesian(movement.endPosition);
      if (position.length >= 2) {
        position.pop();
        position.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  /**
   * 清空
   */
  clearHandle(){
    viewer.scene.globe.depthTestAgainstTerrain = false;
    this.entitiesList.forEach((item) => {
      viewer.entities.remove(item);
    });
    this.entitiesList = [];
    this.primitivesList.forEach((item) => {
      viewer.scene.primitives.remove(item);
    });
    this.primitivesList = [];
    viewer.dataSources.removeAll();
    if (viewer.scene.globe.clippingPlanes != undefined) {
      viewer.scene.globe.clippingPlanes.enabled = false;
    }
  }
  /**
   * 移除所有事件
   */
  removeEvent(){
    this.handlerList.forEach((item) => {
      if (!item.isDestroyed()) {
        item.destroy();
      }
    });
    this.handlerList = [];
  }
}
const cesiumCommon = new cesiumMethods();
export default cesiumCommon
