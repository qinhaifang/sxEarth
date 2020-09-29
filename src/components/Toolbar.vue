<template>
  <div>
    <div class="tool">
      <span :class="{'active-tab':show.analysis}" @click="showTab('analysis')">空间分析</span>
      <span :class="{'active-tab':show.mark}" @click="showTab('mark')">标绘</span>
      <span :class="{'active-tab':show.measure}" @click="showTab('measure')">量测</span>
      <span :class="{'active-tab':show.printPic}" @click="printPicClick">专题图</span>
    </div>
    <Analysis class="analysis" v-show="show.analysis"></Analysis>
    <Mark v-show="show.mark"></Mark>
    <Measure v-if="show.measure"></Measure>
    <sceneDisplay></sceneDisplay>
  </div>
</template>

<script>
import Analysis from "./Analysis";
import Mark from "./Mark";
import Measure from "./Measure";
import sceneDisplay from './printPic/PrintPic'

export default {
  components: {
    Analysis,
    Mark,
    Measure,
    sceneDisplay
  },
  data() {
    return {
      show: {}
    };
  },
  methods: {
    showTab(key) {
      if (this.show[key]) {
        this.show = {};
      } else {
        this.show = {};
        this.show[key] = true;
      }
    },
     //专题图
      printPicClick() {
        Bus.$emit("exportPicClick");
      },
  }
};
</script>

<style scoped>
</style>
