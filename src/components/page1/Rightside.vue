<template>
  <div class="rightside-wrapper">
    <div class="rightside-container">
      <div class="rightside-list">
        <div class="title"><span style="margin-left:10px;">项目列表</span></div>
        <div style="height:calc(100% - 40px);overflow:auto">
          <div
          v-show="isShow"
          class="list_item"
          v-for="(item, index) in list"
          :key="index"
          @click="selectProject(item)"
          >
            <div class="list_item_top">
              <div style="width:16px">
                <el-checkbox v-model="item.check"></el-checkbox>
              </div>
              <div style="margin-left:10px">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="list_item_bottom">
              <div style="width:16px"></div>
              <div style="margin-left:10px">
                <span>项目金额：{{ item.value }}万元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rightside",
  components: {},
  mounted() {
    Bus.$on("isShowProjectList", bool => {
      this.isShow = bool;
    });
  },
  data() {
    return {
      isShow: false,
      list: [
        {
          name: "新建大棚项目",
          value: 90,
          check: false
        },
        {
          name: "2019年普通高中学校改善办学条件（新建学生公寓楼）",
          value: 48,
          check: false
        },
        { name: "2019年中央彩票公益金耿镇集中安置区扶贫车间建设项目", value: 347.16, check: false },
        {
          name: "2019年度阳曲县2017年易地扶贫搬迁集中安置项目",
          value: 350,
          check: false
        }
      ]
    };
  },
  methods: {
    selectProject(item) {
      if (!item.check) {
        if (item.name == "新建大棚项目") {
          Bus.$emit("select_project1");
          Bus.$emit("project-click-event", item.name);
        } else if (item.name == "2019年普通高中学校改善办学条件（新建学生公寓楼）") {
          Bus.$emit("select_project2");
          Bus.$emit("project-click-event", item.name);
        } else if (item.name == "2019年中央彩票公益金耿镇集中安置区扶贫车间建设项目") {
          Bus.$emit("select_project2");
          Bus.$emit("project-click-event", item.name);
        }else if (item.name == "2019年度阳曲县2017年易地扶贫搬迁集中安置项目") {
          Bus.$emit("select_project2");
          Bus.$emit("project-click-event", item.name);
        }else {
          Bus.$emit("select_project");
          Bus.$emit("clear-all-mark");
          Bus.$emit("zone-click-event", "山西省")
        }
        this.list.forEach(obj => {
          if (obj.name != item.name) {
            obj.check = false;
          }
        });
      } else {
        Bus.$emit("select_project");
        Bus.$emit("clear-all-mark");
        Bus.$emit("zone-click-event", "山西省")
      }
      item.check = !item.check;
    }
  }
};
</script>

<style scoped>
/* /deep/  */
.el-checkbox__inner{
  background-color: transparent;
}
.rightside-wrapper {
  width: 17%;
  height: calc(100% - 72px);
  background-color: #003353;
  float: right;
}
.rightside-container {
  width: 100%;
  height: 100%;
  /*background-color: #0a4b7a;*/
}

.rightside-list {
  width: calc(100% - 10px);
  height: 100%;
  background-color: #0a4b7a;
  margin: 0 5px;
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
.list_item {
  height: 120px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 18px;
  cursor: pointer;
}
.list_item_top,
.list_item_bottom {
  display: flex;
}
.list_item_top {
  height:50%;
  margin-bottom: 10px;
}
.list_item_bottom {
  height:50%;
  font-size: 16px;
  color: #ddd;
}
</style>
