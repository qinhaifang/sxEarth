<template>
  <div v-show="showAll">
    <div class="industry" :class="{'min-industry':minIndustry}">
      <div class="title">扶贫行业数据</div>
      <ul id="industryContainer">
        <li v-for="(imgItem,index) in imgList" :key="index">
          <img :src="imgItem" />
        </li>
      </ul>
      <div class="industry-content">
        <el-checkbox
          v-for="(item,index) in layersMessage[username]"
          :key="index"
          :label="item.name"
          :class="{'checked':currentLayer === item.area}"
          @change="checkedLayer(item.area)"
        ></el-checkbox>
      </div>
    </div>
    <div class="legend">
      <img :src="imgData[imageIndex]" />
    </div>
    <div class="img-title" v-if="imageIndex===0">
      <img src="static/images/rightbottom/title.png" />
    </div>
    <div
      v-if="currentArea.substr(-8) === '00000000'"
      class="right-bottom"
      :style="{'height':imgHeight+'px'}"
      @mouseenter="imgHeight=110*showNumber"
      @mouseleave="imgHeight=110"
    >
      <img
        v-if="showNumber === 4 || showNumber === 3 && index > 0"
        :class="{'active-img':currentIndustry === index}"
        v-for="(item,index) in industryContent"
        :key="index"
        :src="item.img"
        @click="checkedIndustry(index)"
      />
    </div>
  </div>
</template>

<script>
import carousel from "../../static/jquery-3d-circle-image-slider/js/jquery.carousel.min";
import mousewheel from "../../static/jquery-3d-circle-image-slider/js/jquery.mousewheel";
import "../../static/jquery-3d-circle-image-slider/css/carousel.css";

import { getRegionBoundary } from "../api/api";

export default {
  data() {
    return {
      username: sessionStorage.getItem("username") || "admin",
      canMove: false,
      minIndustry: false,
      rotateY: 0,
      imgList: [
        "static/images/carousel/1.png",
        "static/images/carousel/2.png",
        "static/images/carousel/3.png",
        "static/images/carousel/4.png",
        "static/images/carousel/5.png",
        "static/images/carousel/6.png",
        "static/images/carousel/7.png",
        "static/images/carousel/8.png",
        "static/images/carousel/9.png",
        "static/images/carousel/10.png",
        "static/images/carousel/11.png",
        "static/images/carousel/12.png",
        "static/images/carousel/13.png",
        "static/images/carousel/14.png",
        "static/images/carousel/15.png",
        "static/images/carousel/16.png",
        "static/images/carousel/17.png",
        "static/images/carousel/18.png"
      ],
      layersMessage: {
        lueyx: [
          {
            name: "全国行政区划",
            area: "000000000000"
          },
          {
            name: "陕西省行政区划",
            area: "610000000000"
          },
          {
            name: "汉中市行政区划",
            area: "610700000000"
          },
          {
            name: "略阳县行政区划",
            area: "610727000000"
          }
        ],
        ningqx: [
          {
            name: "全国行政区划",
            area: "000000000000"
          },
          {
            name: "陕西省行政区划",
            area: "610000000000"
          },
          {
            name: "汉中市行政区划",
            area: "610700000000"
          },
          {
            name: "宁强县行政区划",
            area: "610726000000"
          }
        ],
        neimg: [
          {
            name: "全国行政区划",
            area: "000000000000"
          },
          {
            name: "内蒙古行政区划",
            area: "150000000000"
          },
          {
            name: "呼伦贝尔市行政区划",
            area: "150700000000"
          },
          {
            name: "鄂温克族自治旗行政区划",
            area: "150724000000"
          }
        ]
      },
      industryContent: [
        {
          name: "易地扶贫搬迁分布图",
          img: "static/images/rightbottom/YiDiBanQian.png"
        },
        {
          name: "贫困人口数量分布图",
          img: "static/images/rightbottom/RenKouQingKuangFenBu.png"
        },
        {
          name: "主要致贫原因分布图",
          img: "static/images/rightbottom/ZhuYaoZhiPinYinSu.png"
        },
        {
          name: "国家级贫困县分布",
          img: "static/images/rightbottom/PinKunXian.png"
        }
      ],
      imgData: {
        0: "static/images/rightbottom/tuli1.png",
        1: "static/images/rightbottom/sheng.png",
        2: "static/images/rightbottom/shi.png",
        3: "static/images/rightbottom/xian.png",
        4: "static/images/rightbottom/ZhiPinYiSuTongJi.png"
      },
      imageIndex: null,
      roatateDeg: 0,
      currentIndustry: null,
      currentLayer: null,
      imgHeight: 110,
      showNumber: 4,
      regionBoundary: null,
      currentArea: "000000000000",
      showAll: true
    };
  },
  mounted() {
    this.roatateDeg = 360 / this.imgList.length;
    Bus.$on("min-industry", bool => {
      this.minIndustry = bool;
      const div = document.getElementById("navigationDiv");
      if (bool) {
        div.style.display = "none";
      } else {
        div.style.display = "block";
      }
    });
    Bus.$on("init-industry", area => {
      this.currentArea = this.currentLayer = area;
      if (area === "000000000000") {
        this.showNumber = 4;
      } else {
        this.showNumber = 3;
        if (this.currentIndustry === 0) {
          Bus.$emit("clear-entity");
          this.imageIndex = null;
          this.currentIndustry = null;
        }
      }
      if (this.currentIndustry !== null) {
        this.addeRgionBoundary();
      }
      this.addLayerEntity();
    });
    Bus.$on("toggle-div", bool => {
      this.showAll = bool;
    });
    this.init();
  },
  methods: {
    init() {
      jQuery_1_9_1.browser = {};
      (function() {
        jQuery_1_9_1.browser.msie = false;
        jQuery_1_9_1.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
          jQuery_1_9_1.browser.msie = true;
          jQuery_1_9_1.browser.version = RegExp.$1;
        }
      })();
      jQuery_1_9_1("#industryContainer").carousel({
        width: 240,
        height: 130,
        itemWidth: 50,
        horizontalRadius: 90,
        verticalRadius: 30,
        resize: false,
        mouseScroll: false,
        mouseDrag: false,
        scaleRatio: 0.4,
        scrollbar: false,
        tooltip: false,
        mouseWheel: true,
        mouseWheelReverse: true
      });
      jQuery_1_9_1("#industryContainer img")[0].className =
        "carousel-item click";
    },
    getImageIndex() {
      if (
        this.currentIndustry === 0 &&
        this.currentArea.substr(-8) == "00000000"
      ) {
        this.imageIndex = 0;
      } else if (this.currentIndustry === 1) {
        if (this.currentArea.substr(-12) == "000000000000") {
          this.imageIndex = 1;
        } else if (this.currentArea.substr(-10) == "0000000000") {
          this.imageIndex = 2;
        } else if (this.currentArea.substr(-8) == "00000000") {
          this.imageIndex = 3;
        }
      } else if (
        this.currentIndustry === 2 &&
        this.currentArea.substr(-8) == "00000000"
      ) {
        this.imageIndex = 4;
      }
    },
    checkedIndustry(index) {
      if (this.currentIndustry === index) {
        this.currentIndustry = null;
        if (index === 3) {
          Bus.$emit("add-pin-kun-layer", null);
        }
      } else {
        this.currentIndustry = index;
        if(index !== 3){
          Bus.$emit("add-pin-kun-layer", null);
        }
      }
      this.addeRgionBoundary();
    },
    checkedLayer(area) {
      if (this.currentLayer === area) {
        this.currentLayer = null;
      } else {
        this.currentLayer = area;
      }
      Bus.$emit("checked-layer", this.currentLayer);
    },
    async addLayerEntity() {
      if (!this.regionBoundary) {
        this.regionBoundary = await getRegionBoundary();
      }
      Bus.$emit("remove-dataSource");
      this.regionBoundary.forEach(element => {
        if (element.area === this.currentLayer) {
          Bus.$emit("add-layer-entity", element);
        }
      });
    },
    async addeRgionBoundary() {
      if (!this.regionBoundary) {
        this.regionBoundary = await getRegionBoundary();
      }
      Bus.$emit("clear-entity");
      this.imageIndex = null;
      if (this.currentIndustry === 3) {
        Bus.$emit("add-industry-layers", this.currentIndustry);
      } else {
        this.regionBoundary.forEach(element => {
          if (element.area === this.currentArea) {
            Bus.$emit("add-industry", element, this.currentIndustry);
          }
        });
        this.getImageIndex();
      }
    }
  }
};
</script>

<style scoped>
</style>