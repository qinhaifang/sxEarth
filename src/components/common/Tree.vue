<template>
  <div class="tree">
    <div class="tree-wrapper">
      <div class="tree-title">广西壮族自治区行政区划</div>
      <div class="tree-content">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          :expand-on-click-node="false"
          :default-expanded-keys="[1]"
          :default-checked-keys="[36]"
          @node-click="flyTo"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tree",
  components: {},
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      key: undefined,
      value: undefined
    };
  },
  mounted() {
    // 左下角树
    this.axios.get("../../../static/sampleData/tree2.json").then(res => {
      console.log(res);
      this.treeData = res.data;

      Bus.$emit("zone-click-event", "广西壮族自治区");
    });

    // 点击地球，选择对应的tree节点
    Bus.$on("click-layer-tree", name => {
      this.getKey(this.treeData, name);
      console.log(this.key, this.value);

      if (typeof this.key !== 'undefined' || typeof this.value !== 'undefined') {
        let tree = this.$refs.tree;
        tree.setCheckedKeys([this.key]);

        Bus.$emit("zone-click-event", this.value);        
      }
    });
  },
  methods: {
    getKey(dataList, name) {
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].children && dataList[i].children.length > 0) {
          this.getKey(dataList[i].children, name);
        } else {
          if (dataList[i].label == name) {
            this.key = dataList[i].id;
            this.value = dataList[i].name;
            break;
          }
        }
      }  
    },
    flyTo(data, node) {
      console.log(data, node);

      Bus.$emit("zone-click-event", data.name);

      if (this.$route.path === '/index1' && data.name === '广西壮族自治区') {
        this.$router.push({
          path: '/index'
        })
      }

      // data.label = data.name;
      // Bus.$emit("zone-click-event", data.label);
      if(data.name=='广西壮族自治区') {
        Bus.$emit("overview_show", 1)
        Bus.$emit("fundaccount_show", 0)
      }
      if(data.name=='金秀瑶族自治县') {
        Bus.$emit("overview_show", 2)
        Bus.$emit("fundaccount_show", 1)
      }

    }
  }
};
</script>

<style scoped>
.tree {
  width: 17%;
  height: calc(33% - 12px);
  background-color: #003459;
  position: absolute;
  bottom: 0;
  margin-top: 5px;
}
.tree-wrapper {
  width: calc(100% - 10px);
  height: 100%;
  background-color: #0a4b7a;
  margin: 0 5px;
}
.tree-title {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: bold;
  background-color: #126494;
}
.tree-content {
  width: 100%;
  height: calc(100% - 40px);
  /*padding: 10px;*/
  /*box-sizing: border-box;*/
  overflow: auto;
}

/deep/ .el-tree {
  background-color: #0a4b7a;
  color: #ffffff;
}
/deep/ .el-tree-node__label{
font-size: 16px !important;
}

/deep/ .el-tree-node__content:hover {
  background-color: #126494;
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: #126494 !important;
}
</style>
