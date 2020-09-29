<template>
  <div>
    <div v-show="showBar" class="tool-bar">
      <div class="left" @click="handleNodeClick(parent)">返回</div>
      <div v-if="showAll" class="right" @click="toggleDiv(false)">隐藏</div>
      <div v-if="!showAll" class="right" @click="toggleDiv(true)">显示</div>
    </div>
    <div v-show="showBar2" class="tool-bar">
      <div class="left" @click="clearStep">返回</div>
    </div>
    <div v-show="showAll && !showBar" class="poverty-point">
      <div class="title">全国贫困点列表</div>
      <div class="poverty-count">
        <el-input
          class="search"
          size="mini"
          v-model="title"
          placeholder="请输入名称"
          @keyup.enter.native="search"
        ></el-input>
        <div class="step" @click="addStep">习总扶贫足迹</div>
        <div class="tree-count">
          <el-tree
            :data="treeData"
            accordion
            @node-click="handleNodeClick"
            node-key="id"
            :default-expanded-keys="keyList"
          ></el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchData,
  searchPoint,
  getTreeByParent,
  getJsonById,
  getFootPrint
} from "../api/api";
export default {
  data() {
    return {
      title: "",
      treeData: [],
      showBar: false,
      showBar2: false,
      showAll: true,
      parent: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      townVillageData: {},
      childrenList: [],
      keyList: []
    };
  },
  mounted() {
    Bus.$on("click-tree", id => {
      this.handleNodeClick(this.townVillageData[id]);
    });
    Bus.$on("click-layer-tree", label => {
      for (let i = 0; i < this.childrenList.length; i++) {
        if (this.childrenList[i].label === label) {
          this.handleNodeClick(this.childrenList[i]);
          break;
        }
      }
    });
    this.getTreeData(0, this.treeData);
  },
  methods: {
    search() {
      this.treeData = [];
      if (this.title) {
        searchPoint(encodeURI(this.title)).then(res => {
          res.forEach(item => {
            if (!item.relativePath && !item.fileName.includes("图片")) {
              const children =
                item.fileName.includes("安置点") ||
                item.fileName.includes("电站") ||
                item.fileName.includes("合作社")
                  ? []
                  : [{}];
              this.treeData.push({
                label: item.fileName,
                id: item.id,
                children
              });
            }
          });
        });
      } else {
        this.getTreeData(0, this.treeData);
      }
    },
    toggleDiv(bool) {
      Bus.$emit("toggle-div", bool);
      this.showAll = bool;
    },
    addStep() {
      getFootPrint().then(res => {
        Bus.$emit("add-foot-print", res);
      });
      this.toggleDiv(false);
      this.showBar2 = true;
    },
    clearStep() {
      Bus.$emit("clear-entity2");
      Bus.$emit("clear-entity3");
      this.toggleDiv(true);
      this.showBar2 = false;
    },
    getTreeData(id, node, bool, callback) {
      let addParent = false;
      getTreeByParent(id).then(res => {
        res.forEach(item => {
          if (!item.relativePath && !bool && node) {
            const children =
              item.fileName.includes("安置点") ||
              item.fileName.includes("电站") ||
              item.fileName.includes("合作社") ||
              item.fileName.includes("茶园")
                ? []
                : [{}];
            node.push({
              parent: id,
              label: item.fileName,
              id: item.id,
              children
            });
          }
          if (item.fileName === "安置点图片") {
            getTreeByParent(item.id).then(resImg => {
              let imagList = [];
              resImg.forEach(itemImg => {
                imagList.push(
                  `${window.UrlSetting.baseUrl}/manager/rest/file/browse?id=${itemImg.id}&fileType=${itemImg.fileType}`
                );
              });
              //安置点建设图
              Bus.$emit("village-img", imagList);
            });
          }
          if (item.fileName === "影像") {
            getTreeByParent(item.id).then(resImage => {
              Bus.$emit("yingxiangtu", resImage);
              if (resImage[0]) {
                Bus.$emit("resettlement-layer", resImage[0].id);
              }
            });
          }
          if (item.fileName === "专题图") {
            getTreeByParent(item.id).then(data => {
              Bus.$emit("zhuantitu", data);
            });
          }
          if (item.fileName.includes("introduction")) {
            getJsonById(item.id).then(res => {
              if (node && node.length > 0 && node[0].children.length === 0) {
                addParent = true;
              }
              callback && callback(res[0], addParent);
            });
          }
        });
        this.childrenList = node;
      });
    },
    handleNodeClick(item) {
      this.keyList = [item.id];
      this.toggleDiv(true);
      Bus.$emit("clear-entity2");
      //非安置点 茶园等信息
      this.showBar = item.children.length === 0;
      item.children = [];
      this.getTreeData(
        item.id,
        item.children,
        this.showBar,
        (data, addParent) => {
          if (addParent) {
            this.parent = item;
          }
          item.message = data.message;
          item.child = data.children;
          //从县级以下（包括县级）开始执行
          if (item.message.area.substr(-8) !== "00000000") {
            this.addTownAndVillage(item.children);
          }
          Bus.$emit("init-industry", item.message.area);
          if (item.message.area === "610726002299") {
            Bus.$emit("cha-lie-biao", item.child);
          }
          if (item.label.includes("安置点")) {
            let param = {
              page: 1,
              rows: 10000,
              resettlement: item.label
            };
            searchData(param).then(res1 => {
              item.child = res1.list;
              Bus.$emit("init-time-line", item, this.showBar);
            });
          } else {
            Bus.$emit("init-time-line", item, this.showBar);
          }
        }
      );
      Bus.$emit("min-industry", this.showBar);
      Bus.$emit("clear-entity3");
      Bus.$emit("remove-ying-xiang");
    },
    addTownAndVillage(children) {
      children.forEach(item => {
        this.getTreeData(item.id, null, this.showBar, data => {
          this.townVillageData[item.id] = item;
          data.message.id = item.id;
          Bus.$emit("add-town-and-village", data.message);
        });
      });
    }
  }
};
</script>

<style scoped></style>
