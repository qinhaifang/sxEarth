<template>
  <div
    v-if="showTimeLine"
    v-show="showAll"
    class="time-line"
    @wheel.prevent="mouseWheel"
  >
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
          <div class="label" @click="selectDate(item.date, index)">
            {{ item.date }}
          </div>
          <div class="point" @click="selectDate(item.date, index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChaYuanMessage, getLayerMessage } from "../api/api";

export default {
  data() {
    return {
      left: 0,
      layreMap: {},
      currentArea: null,
      timeLineData: [],
      currentDate: null,
      resettlementMap: {},
      industryData: null,
      currentIndustry: null,
      currentNodeMessage: null,
      showAll: true,
      yingxiang: null,
      chaYuanMessage: null,
      showTimeLine: true
    };
  },
  mounted() {
    Bus.$on("add-zhuan-ti", (png, value) => {
      Bus.$emit("timeline-zhuanti", png, this.currentDate, value);
    });
    Bus.$on("current-timeline", index => {
      if (this.timeLineData[index]) {
        this.currentDate = this.timeLineData[index].date;
      } else {
        this.currentDate = null;
      }
    });
    Bus.$on("yingxiangtu", data => {
      this.yingxiang = data;
    });
    Bus.$on("checked-layer", area => {
      const message = this.layreMap[area];
      Bus.$emit("add-layer", message);
    });
    Bus.$on("toggle-div", bool => {
      this.showAll = bool;
    });
    Bus.$on("init-time-line", (node, is_leaf) => {
      this.showTimeLine = true;
      if (node.message.area === "610726002299") {
        this.buildTimeLine2(node);
      } else {
        this.buildTimeLine(node, is_leaf);
      }
      if (["150724111016", "150724111013"].includes(node.message.area)) {
        this.showTimeLine = false;
      }
      //添加行政区划图层
      this.addLayer(node);
      //定位选择行政区划位置
      this.setView(node);
    });
    Bus.$on("add-industry-layers", currentIndustry => {
      this.industryData = null;
      this.currentIndustry = currentIndustry;
      if (this.currentIndustry !== null) {
        Bus.$emit("add-industry2", this.industryData, this.currentIndustry);
      }
    });
    Bus.$on("add-industry", (industryData, currentIndustry) => {
      this.industryData = industryData;
      this.currentIndustry = currentIndustry;
      if (this.currentIndustry !== null) {
        Bus.$emit("add-industry2", this.industryData, this.currentIndustry);
      }
    });
    this.buildTimeLine({ message: { area: "000000000000" } }, false);
    this.getLayers();
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
    buildTimeLine(node, is_leaf) {
      const area = node.message.area;
      this.currentArea = area;
      this.currentNodeMessage = node.message;
      this.timeLineData = [];
      this.resettlementMap = {};
      if (!is_leaf) {
        this.timeLineData = [
          { date: "2017", url: "" },
          { date: "2018", url: "" },
          { date: "2019", url: "" }
        ];
      } else if (
        area.substr(0, 4) == "6107" ||
        area == "150724111013" ||
        area == "150724111016"
      ) {
        const resettementPoint = node.message;
        node.child.forEach(item => {
          if (!this.resettlementMap[item.movetime]) {
            this.resettlementMap[item.movetime] = [];
            this.timeLineData.push({ date: item.movetime, url: "" });
          }
          this.resettlementMap[item.movetime].push(item);
        });
      }
      this.timeLineData.sort((r, l) => {
        return r.date > l.date ? 1 : -1;
      });
      const length = this.timeLineData.length;
      this.currentDate = this.timeLineData[length - 1].date;
      this.addStatistic(this.currentArea, this.currentDate);
      this.left = 0;
      if (this.timeLineData.length > 5) {
        this.left = 100 - this.timeLineData.length * 20;
      }
      Bus.$emit("search-area", this.currentArea, node.label);
      Bus.$emit(
        "add-introduction",
        area,
        node.message.name,
        node.message.introduction
      );
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
    selectDate(date, index) {
      this.currentDate = date;
      if (this.currentArea === "610726002299") {
        Bus.$emit("timeline-yingxiang", index, this.chaYuanMessage[date]);
      } else {
        this.addStatistic(this.currentArea, this.currentDate);
      }
      Bus.$emit("clear-entity");
      if (
        this.currentIndustry !== null &&
        this.currentArea.substr(-8) == "00000000"
      ) {
        Bus.$emit("add-industry2", this.industryData, this.currentIndustry);
      }
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

<style scoped></style>
