<template>
  <div id="app">
    <router-view />
    <Tree v-if="isShowEarth"></Tree>
    <EarthMap v-if="isShowEarth" class="earth"></EarthMap>
  </div>
</template>

<script>
import Tree from "@/components/common/Tree";
import EarthMap from "@/components/EarthMap";

export default {
  name: "App",
  components: {
    Tree,
    EarthMap
  },
  data() {
    return {
      isShowEarth: false
    };
  },
  watch: {
    $route: "routeHandle"
  },
  methods: {
    routeHandle(route) {
      this.isShowEarth = !(route.name === "LoginView");
      if (route.name === "TransitionPage") {
        this.isShowEarth = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "style/index";

.earth {
  position: absolute;
  top: 72px;
  left: 17%;
  right: 17%;
  bottom: 25%;
  z-index: 100;
}
</style>
