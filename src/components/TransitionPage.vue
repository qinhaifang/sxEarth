<template>
  <div class="transition-page-wrapper">
    <div id="cesium-container1"></div>
    <el-button class="home" type="primary" @click="linkToHome">首页</el-button>
    <el-button class="exit" type="primary" @click="linkToLogin">退出</el-button>
    <div class="title">广西县级财政扶贫资金动态监控系统</div>
  </div>
</template>

<script>

export default {
  name: "TransitionPage",
  data() {
    return {

    }
  },
  mounted() {
    let viewer = new Cesium.Viewer("cesium-container1", {
      baseLayerPicker: false,//地图切换控件
      fullscreenButton: false,//全屏按钮
      vrButton: false, //双屏按钮
      geocoder: false, //地名查找
      homeButton: false,//首页按钮
      infoBox: false,
      sceneModePicker: false, //是否显示投影方式控件
      selectionIndicator: false, //选中元素显示
      navigationHelpButton: false,//是否显示帮助信息控件
      navigationInstructionsInitiallyVisible: false,
      animation: false, //动画控制
      shouldAnimate: true,
      timeline: false,
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true
        }
      },
      imageryProvider: new Cesium.createTileMapServiceImageryProvider({
        url: "../../static/tiles",
        maximumLevel: 2
      })
    });
    viewer.cesiumWidget.creditContainer.style.display = "none";

    const imageLayer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({
        url: 'http://220.181.130.171:9090/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{reverseY}.jpg'
      })
    );
    viewer.imageryLayers.add(imageLayer);

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(108.8, 35.5, 22000000)//经度，纬度，高度，椭球，结果
    });
  },
  methods: {
    linkToHome() {
      this.$router.push({
        path: '/index'
      })
    },
    linkToLogin() {
      this.$router.push({
        path: 'LoginView'
      })      
    }
  }
};
</script>

<style scoped>
  
.transition-page-wrapper{
  position: relative;
  width: 100%;
  height: 100%;
}
#cesium-container1{
  width: 100%;
  height: 100%;  
}
.title{
  position: absolute;
  top: 300px;
  width: 100%;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 44px;
  font-weight: bolder;
}
.home{
  position: absolute;
  top: 20px;
  left: 20px;
}
.exit{
  position: absolute;
  top: 20px;
  right: 20px;  
}

</style>
