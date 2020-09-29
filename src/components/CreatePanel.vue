<template>
  <div>
    <el-container v-show="!select">
      <el-header>
        添加标记
        <span v-if="isCreate" class="closebtn" @click="cancelMark"></span>
        <span v-if="!isCreate" class="closebtn" @click="sureEdit"></span>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
            名称：
            <el-input v-model="markName" v-focus></el-input>
            <br />备注：
            <el-input v-model="markRemark" type="textarea"></el-input>
          </el-main>
          <!-- <el-aside v-if="showImage">
            &nbsp;<img :src="defaultImage">
            <a @click="select = true">更换</a>
          </el-aside>-->
        </el-container>
        <el-footer>
          <el-button v-if="isCreate" type="danger" plain size="mini" @click="cancelMark">取消</el-button>
          <el-button v-if="isCreate" type="primary" plain size="mini" @click="update">确定</el-button>
          <el-button v-if="!isCreate" type="danger" plain size="mini" @click="cancelEdit">取消</el-button>
          <el-button v-if="!isCreate" type="primary" plain size="mini" @click="sureEdit">确定</el-button>
        </el-footer>
      </el-container>
    </el-container>
    <!-- <el-container v-show="select">
      <img v-for="img in images" :src="img" @click="changeHandler(img)">
    </el-container>-->
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      isCreate: true,
      oldMarkName: null,
      markName: null,
      markRemark: null,
      images: [],
      select: false,
      currentPoint: null,
      currentCoordinate: null,
      defaultImage: "static/images/pin.png",
      showImage: true
    };
  },
  directives: {
    focus(el) {
      el.focus();
    }
  },
  mounted() {
    Bus.$on("editPanel", conditions => {
      this.isCreate = false;
      this.oldMarkName = this.markName = conditions.markName;
      this.markRemark = conditions.markRemark;
    });
    Bus.$on("draw-mark", () => {
      this.isCreate = true;
      this.showImage = true;
    });
    Bus.$on("draw-line", () => {
      this.isCreate = true;
      this.showImage = false;
    });
    Bus.$on("draw-plygon", () => {
      this.isCreate = true;
      this.showImage = false;
    });
    //   this.getImageIcon();
  },
  methods: {
    cancelMark() {
      this.markName = null;
      this.markRemark = null;
      Bus.$emit("remove-panel-event");
      Bus.$emit("clear-last-entity3");
    },
    cancelEdit() {
      this.markName = null;
      this.markRemark = null;
      Bus.$emit("remove-panel-event");
    },
    sureEdit() {
      Bus.$emit("saveEdit", this.oldMarkName, {
        markName: this.markName,
        markRemark: this.markRemark
      });
      this.markName = null;
      this.markRemark = null;
      Bus.$emit("remove-panel-event");
    },
    update() {
      if (!this.markName) {
        this.$message({
          showClose: true,
          message: "请添加标记名称",
          type: "warning"
        });
        return;
      }
      const param = {
        text: this.markName,
        font: "24px sans-serif",
        offsetX: 40,
        offsetY: -40,
        name:'mark'
      };
      let conditions = {
        markName: this.markName,
        markRemark: this.markRemark
      };
      if (this.showImage) {
        conditions.image = this.defaultImage;
      }
      Bus.$emit("saveMark", conditions);
      Bus.$emit("add-label", conditions.positions[0], param);
      this.markName = null;
      this.markRemark = null;
      Bus.$emit("remove-panel-event");
    },
    // changeHandler(id) {
    //   this.defaultImage = id;
    //   this.select = false;
    //   cesiumCommon.billboardItem2(null, this.defaultImage);
    // },
    //获取点标图片
    getImageIcon() {
      searchMeta("3dtile", `id=${window.UrlSetting.MARKERMODEL}`).then(res => {
        res.data.map(e => {
          this.images.push(
            window.UrlSetting.MANAGER +
              "/manager/rest/file/browse?fileType=5&id=" +
              e.id
          );
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
