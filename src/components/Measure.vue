<template>
  <div class="measure">
    <el-button type="primary" size="mini" @click="distanceMeasure">距离测量</el-button>
    <el-button type="primary" size="mini" @click="spaceMeasure">面积测量</el-button>
    <el-button type="danger" size="mini" @click="clear">清空</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    distanceMeasure() {
      Bus.$emit('distance-measure');
     
    },
    spaceMeasure() {
       Bus.$emit('space-measure');
     
    },
    clear() {
      Bus.$emit('clear-entity3')
    }
  }
};
</script>

<style scoped>
</style>
