<template>
  <div class="mark-div">
    <div class="markerPanel">
      <span
        class="marker-panel"
        :class="{'active-panel':activeModel['marker']}"
        @click="drawMark"
        title="标记地点"
      ></span>
      <span
        class="polyline-panel"
        :class="{'active-panel':activeModel['polyline']}"
        @click="drawLine"
        title="绘线"
      ></span>
      <span
        class="polygon-panel"
        :class="{'active-panel':activeModel['polygon']}"
        type="info"
        @click="drawPoly"
        title="绘多边形"
      ></span>
      <span class="import-panel" type="info" @click="openFile()" title="导入地点"></span>
      <span class="export-panel" type="info" @click="exportMarks()" title="导出地点"></span>
      <span class="remove-panel" type="info" @click="clear()" title="一键删除"></span>
      <input type="file" v-show="false" @change="importMarks" id="uploadhandler" />
    </div>
    <div class="mark-table" v-if="dataList.length > 0">
      <div class="table">
        <div class="head">
          <span style="width:32px;">类型</span>
          <span style="width:208px;">名称</span>
          <span style="width:120px;">操作</span>
        </div>
        <div class="body">
          <div class="row" v-for="(item,index) in dataList" :key="index">
            <span style="width:32px;">{{fiter(item.type)}}</span>
            <span style="width:208px;">{{item.markName}}</span>
            <span style="width:120px;">
               <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                 <el-button type="primary" size="mini" icon="el-icon-edit" @click="editMark(item)"></el-button>
                </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="删除" placement="top">
                 <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteMark(item,index)"></el-button>
                </el-tooltip>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      activeModel: {},
      positions: [],
      mark: {
        entity: null,
        feature: null
      },
      defaultImage: "static/images/pin.png",
      dataList: []
    };
  },
  mounted() {
    Bus.$on("saveEdit", (name, params) => {
      for (let i = 0; i < this.dataList.length; i++) {
        if (name === this.dataList[i].markName) {
          this.dataList[i].markName = params.markName;
          this.dataList[i].markRemark = params.markRemark;
          break;
        }
      }
    });
    Bus.$on("get-panel-data", markName => {
      const message = this.getMarkMessage(markName);
      Bus.$emit("editPanel", message);
    });
    Bus.$on("panel-positions", positions => {
      this.positions = positions;
    });
    Bus.$on("remove-panel-event", () => {
      this.activeModel = {};
    });
    Bus.$on("saveMark", conditions => {
      conditions.positions = this.positions;
      conditions.type = Object.keys(this.activeModel)[0];
      this.dataList.push(conditions);
      this.activeModel = {};
    });
  },
  methods: {
    fiter(key) {
      switch (key) {
        case "marker":
          return "点标";
        case "polyline":
          return "线标";
        case "polygon":
          return "面标";
      }
    },
    getMarkMessage(markName) {
      let message;
      for (let j = 0; j < this.dataList.length; j++) {
        if (this.dataList[j].markName === markName) {
          message = this.dataList[j];
          break;
        }
      }
      return message;
    },
    drawMark() {
      this.activeModel = {};
      this.activeModel.marker = true;
      Bus.$emit("draw-mark", this.defaultImage);
    },
    drawLine() {
      this.activeModel = {};
      this.activeModel.polyline = true;
      Bus.$emit("draw-line");
    },
    drawPoly() {
      this.activeModel = {};
      this.activeModel.polygon = true;
      Bus.$emit("draw-plygon");
    },
    openFile() {
      document.getElementById("uploadhandler").click();
    },
    exportMarks() {
      const marks = [];
      for (let i = 0; i < this.dataList.length; i++) {
        marks.push(JSON.stringify(this.dataList[i]));
      }
      const blob = new Blob(marks, { type: "" });
      saveAs(blob, "marks.json");
    },
    clear() {
      Bus.$emit("clear-entity3");
      this.dataList = [];
    },
    importMarks() {
      const self = this;
      self.dataList = [];
      const evt = event ? event : window.event;
      const files = evt.target.files,
        reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = function() {
        //读取完成后，数据保存在对象的result属性中
        const res = this.result;
        const arr = res.split("}{");
        arr.map(r => {
          if (r[0] != "{") {
            r = "{" + r;
          }
          if (r[r.length - 1] != "}") {
            r = r + "}";
          }
          const markData = JSON.parse(r);
          self.addMark(markData);
          self.dataList.push(markData);
        });
      };
    },
    /**
     * 导入后添加标记到地图
     */
    addMark(markData) {
      switch (markData.type) {
        case "marker":
          Bus.$emit("import-mark", markData.positions, this.defaultImage);
          break;
        case "polyline":
          Bus.$emit("import-polyline", markData.positions);
          break;
        case "polygon":
          Bus.$emit("import-polygon", markData.positions);
          break;
      }
      const param = {
        text: markData.markName,
        font: "24px sans-serif",
        offsetX: 40,
        offsetY: -40,
        name: "mark"
      };
      Bus.$emit("add-label", markData.positions[0], param);
    },
    editMark(item){
      Bus.$emit('edit-mark',item.markName);

    },
    deleteMark(item,index){
      Bus.$emit('delete-mark',item.markName);
      this.dataList.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.marker-panel {
  background: url("../../static/images/marker.png") no-repeat center;
}

.polyline-panel {
  background: url("../../static/images/polyline.png") no-repeat center;
}

.polygon-panel {
  background: url("../../static/images/polygon.png") no-repeat center;
}

.import-panel {
  background: url("../../static/images/upload.png") no-repeat center;
}

.export-panel {
  background: url("../../static/images/download.png") no-repeat center;
}

.remove-panel {
  background: url("../../static/images/remove.png") no-repeat center;
}
</style>
