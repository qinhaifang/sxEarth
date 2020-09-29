<template>
  <div class="main-view">
    <Nav></Nav>
    <Leftside></Leftside>
    <Rightside></Rightside>
    <Bottomside></Bottomside>
  </div>
</template>

<script>
import Nav from "@/components/page/Nav";
import Leftside from "@/components/page/Leftside";
import Rightside from "@/components/page/Rightside";
import Bottomside from "@/components/page/Bottomside";

export default {
  name: "IndexView",
  components: {
    Nav,
    Leftside,
    Rightside,
    Bottomside
  }
};
</script>

<style scoped></style>
