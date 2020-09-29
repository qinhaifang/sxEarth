<template>
  <div class="main-view">
    <Nav></Nav>
    <Leftside></Leftside>
    <Rightside></Rightside>
    <Bottomside></Bottomside>
  </div>
</template>

<script>

import Nav from '@/components/page1/Nav'
import Leftside from '@/components/page1/Leftside'
import Rightside from '@/components/page1/Rightside'
import Bottomside from '@/components/page1/Bottomside'

export default {
  name: "IndexView1",
  components: {
    Nav,
    Leftside,
    Rightside,
    Bottomside
  }
}

</script>

<style scoped>



</style>
