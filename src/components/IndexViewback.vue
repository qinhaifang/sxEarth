<template>
  <div class="main-view">
    <EarthMap></EarthMap>
    <TopCompontent></TopCompontent>
    <Industry></Industry>
    <Statistic></Statistic>
    <NewTimeLine></NewTimeLine>
    <Describetion></Describetion>
    <PovertyPoint></PovertyPoint>
    <Toolbar></Toolbar>
    <Search></Search>
  </div>
</template>

<script>
import EarthMap from "./EarthMap";
import CesiumCompontent from "./CesiumCompontent";
import TopCompontent from "./TopCompontent";
import Industry from "./Industry";
import PovertyPoint from "./PovertyPoint";
import Statistic from "./Statistic";
import TimeLine from "./TimeLine";
import NewTimeLine from "./NewTimeLine";
import Describetion from "./Describetion";
import Toolbar from "./Toolbar";
import Search from "./Search";
export default {
  name: "IndexView",
  components: {
    CesiumCompontent,
    TopCompontent,
    Industry,
    PovertyPoint,
    Statistic,
    TimeLine,
    Describetion,
    Toolbar,
    Search,
    EarthMap,
    NewTimeLine
  }
};
</script>

<style scoped></style>
