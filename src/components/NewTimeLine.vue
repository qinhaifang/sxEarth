<template>
  <div v-show="showAll" class="time-line" @wheel.prevent="mouseWheel">
    <div class="out-line">
      <div class="line"></div>
      <div class="inner-line" :style="{ left: left + '%' }">
        <div
          class="time-item"
          :class="{ 'is-active': currentDate === item.date }"
          v-for="(item, index) in timeLineData"
          :key="index"
          :style="{ width: 100 / timeLineData.length + '%' }"
        >
          <div class="label" @click="selectDate(item, index)">
            {{ item.date }}
          </div>
          <div class="point" @click="selectDate(item, index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChaYuanMessage, getLayerMessage } from "../api/api";
import axios from "axios";
export default {
  data() {
    return {
      projectName: "",
      left: 0,
      layreMap: {},
      currentArea: null,
      timeLineData: [],
      currentDate: null,
      resettlementMap: {},
      industryData: null,
      currentIndustry: null,
      currentNodeMessage: null,
      showAll: false,
      yingxiang: null,
      chaYuanMessage: null,
      yingxiangTimeData: []
    };
  },
  created() {
    axios.get("../../static/data/timeline.json").then(res => {
      this.yingxiangTimeData = res.data;
    });
  },
  mounted() {
    //点击动态监控弹出对应项目进度时间
    Bus.$on("project-time-course", name => {
      this.projectName = name;
      let isExit = false;
      for (let i = 0; i < this.yingxiangTimeData.length; i++) {
        if (this.yingxiangTimeData[i].name === name) {
          isExit = true;
          this.timeLineData = this.yingxiangTimeData[i].data;
          this.buildTimeLine();
          break;
        }
      }
      this.showAll = isExit;
    });
    Bus.$on("show-time-line", bool => {
      this.showAll = bool;
    });
    //添加安置点
    Bus.$on("XXX-AZD-time", name => {
      this.projectName = name;
      this.timeLineData = this.yingxiangTimeData[0].data;
      this.showAll = true;
      this.buildTimeLine();
    });
  },
  methods: {
    mouseWheel(evt) {
      if (this.timeLineData.length < 6) {
        return;
      }
      const direction = evt.deltaY / 100;
      if (this.left <= -(this.timeLineData.length - 5) * 20 && direction < 0) {
        this.left = 100 - this.timeLineData.length * 20;
        return;
      }
      if (this.left >= 0 && direction > 0) {
        this.left = 0;
        return;
      }
      this.left += direction * 5;
    },
    buildTimeLine() {
      this.timeLineData.sort((r, l) => {
        return r.date > l.date ? 1 : -1;
      });
      const length = this.timeLineData.length;
      this.currentDate = this.timeLineData[length - 1].date;
      Bus.$emit(
        "add-yingxiang-lyr",
        this.timeLineData[length - 1].url,
        this.projectName,
        this.timeLineData[length - 1].date
      );
      //this.addStatistic(this.currentArea, this.currentDate);
      this.left = 0;
      if (this.timeLineData.length > 5) {
        this.left = 100 - this.timeLineData.length * 20;
      }
    },
    buildTimeLine2(node) {
      const area = node.message.area;
      this.currentArea = area;
      this.timeLineData = [];
      this.getChaYuanData();
      Bus.$emit("add-statistic", area);
      Bus.$emit(
        "add-introduction",
        area,
        node.message.name,
        node.message.introduction
      );
      Bus.$emit("add-resettlemen-point", [], node.message);
      this.yingxiang.forEach(item => {
        const str = item.fileName.slice(-12, -4);
        const date =
          str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
        this.timeLineData.push({ date, url: "" });
      });
    },
    addStatistic(area, date) {
      Bus.$emit("add-statistic", area, date, this.currentNodeMessage.name);
      if (this.resettlementMap[date]) {
        Bus.$emit("clear-entity2");
        Bus.$emit("clear-entity3");
        Bus.$emit("clear-entity");
        Bus.$emit(
          "add-resettlemen-point",
          this.resettlementMap[date],
          this.currentNodeMessage
        );
      }
    },
    selectDate(item, index) {
      this.currentDate = item.date;
      Bus.$emit("add-yingxiang-lyr", item.url, this.projectName, item.date);
    },
    getLayers() {
      getLayerMessage().then(res => {
        this.layreMap = res;
      });
    },
    setView(node) {
      const position = {
        lon: node.message.lon,
        lat: node.message.lat,
        range: node.message.range
      };
      Bus.$emit("set-view", position);
    },
    addLayer(node) {
      const area = node.message.area;
      const message = this.layreMap[area];
      Bus.$emit("add-layer", message);
    },
    getChaYuanData() {
      getChaYuanMessage().then(res => {
        this.chaYuanMessage = res;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.time-line {
  position: absolute;
  bottom: 10px;
  left: calc(50% - 300px);
  width: 600px;
  height: 60px;
  background: rgba(25, 58, 77, 0.7);
  border-radius: 10px;
  z-index: 2000;
  .out-line {
    position: absolute;
    left: 5%;
    width: 90%;
    height: 100%;
    overflow: hidden;
  }
  .inner-line {
    position: absolute;
    width: 100%;
    height: 100%;
    white-space: nowrap;
  }
  .line {
    position: absolute;
    top: 29px;
    width: 100%;
    height: 5px;
    background: #fff;
  }
  .time-item {
    display: inline-block;
    position: relative;
    min-width: 20%;
    .label {
      cursor: pointer;
      position: absolute;
      top: -10px;
      left: calc(50% - 42px);
      font-size: 14px;
      color: #fff;
    }
    .point {
      cursor: pointer;
      position: absolute;
      top: 10px;
      left: calc(50% - 10px);
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 5px;
    }
  }
  .is-active {
    .label {
      color: #409eff;
    }
    .point {
      background: #409eff;
    }
  }
}
</style>
