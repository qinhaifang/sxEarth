<template>
  <div class="leftside-wrapper">
    <div class="leftside-container">
      <div class="leftside_fpzjxm">
        <div class="title">
          <span style="margin-left:10px;">扶贫资金项目</span>
        </div>
        <ul id="industryContainer">
          <li v-for="(imgItem, index) in imgList" :key="index">
            <img :src="imgItem" />
          </li>
        </ul>
        <div class="industry_content">
          <div
            class="leftitem"
            v-for="(item, index) in layersMessage"
            :key="index"
          >
            <el-checkbox
              v-model="item.check"
              @change="searchProjectList"
            ></el-checkbox>
            <span style="margin-left:10px">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import carousel from "../../../static/jquery-3d-circle-image-slider/js/jquery.carousel.min";
import mousewheel from "../../../static/jquery-3d-circle-image-slider/js/jquery.mousewheel";
import "../../../static/jquery-3d-circle-image-slider/css/carousel.css";

export default {
  name: "Leftside",
  components: {},
  data() {
    return {
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
      layersMessage: [
        { name: "低保政策兜底一批", check: false },
        { name: "医疗救助解困一批", check: false },
        { name: "教育扶智帮助一批", check: false },
        { name: "扶持生产发展一批", check: false },
        { name: "生态补偿脱贫一批", check: false },
        { name: "转移就业扶持一批", check: false },
        { name: "移民搬迁安置一批", check: false },
        { name: "边贸政策扶助一批", check: false }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    searchProjectList() {
      Bus.$emit("isShowProjectList", true);
    },
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
    }
  }
};
</script>

<style scoped>
/* /deep/ */
 .el-checkbox__inner{
  background-color: transparent;
}
.leftside-wrapper {
  width: 17%;
  height: calc(100% - 72px);
  background-color: #003353;
  float: left;
}
.leftside-container {
  width: 100%;
  height: 100%;
  /*background-color: #0a4b7a;*/
}
.title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background-color: #126494;
  font-size: 20px;
  font-weight: bold;
  font-family: MicrosoftYaHei;
}
/* 扶贫资金项目 */
.leftside_fpzjxm {
  width: calc(100% - 10px);
  height: 65%;
  background-color: #0a4b7a;
  margin: 0 5px 5px;
}
#industryContainer {
  width: 250px !important;
  height: 25% !important;
  margin:0 auto;
  text-align: center;
  left: 0 !important;
  top: -10px;
}
.leftside_fpzjxm .leftitem {
  font-size: 18px;
  font-family: MicrosoftYaHei;
  margin: 10px 0;
}
.leftside_fpzjxm .industry_content {
  padding-left: 10px;
  padding-top: 10px;
}
/* 行政区划 */
.leftside_xzqh {
  width: calc(100% - 10px);
  height: calc(50% - 10px);
  background-color: #15384e;
  margin: 0 5px;
}
</style>
