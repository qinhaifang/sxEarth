<template>
  <div style="position: absolute;margin-top: -40px;" class="picMain">
    <el-dialog title="预览" :visible.sync="dialogFormVisible" :modal="false">
      <div id="leftDiv">
        <el-tabs v-model="activeName">
          <el-tab-pane label="编辑" name="first">
            <fabric></fabric>
          </el-tab-pane>
          <el-tab-pane label="文本" name="second">
            <label>输入文本内容：</label>
            <br />
            <br />
            <div class="editor-container">
              <UE :id="'editor1'" :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
            </div>
            <div class="positionDiv">
              <div class="buttonDiv">
                <el-button size="mini" @click="titleShow">添加</el-button>
                <el-button size="mini" @click="titleHidden">清空</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图例" name="third">
            <label>请输入描述、选择颜色：</label>
            <br />
            <br />
            <div style="    height: 100px;">
              <el-input style="float: left;" v-model="inputLegend" placeholder="请输入描述"></el-input>
              <el-color-picker style="float: left;" v-model="color1">选择颜色</el-color-picker>
              <el-button
                size="mini"
                style="margin-left: 20px;margin-top: 12px;"
                @click="addLegendData"
              >增加</el-button>
            </div>
            <div class="LegendLeftDiv">
              <label>预设项：</label>
              <br />
              <div></div>
            </div>
            <div class="LegendCenterDiv"></div>
            <div class="LegendRightDiv">
              <label>图例项：</label>
              <br />
              <div></div>
            </div>
            <ElTransfer
              v-model="value1"
              :titles="['预设项', '图例项']"
              :data="legendData"
              @change="rightChange"
            ></ElTransfer>
            <div class="buttonDiv">
              <el-button size="mini" @click="addLegend">预览</el-button>
              <el-button size="mini" @click="clearLegend">清空</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="指北针" name="fourth">
            <label>选择指北针：</label>
            <br />
            <br />
            <el-row>
              <el-col
                :span="8"
                v-for="(o,index) in northImgArr"
                :key="o"
                :offset="index%3 == 0 ? 0 : 2"
              >
                <el-card :body-style="{ }">
                  <img v-bind:src="o" class="image" />
                  <div>
                    <div class="bottom clearfix">
                      <el-button type="text" class="button" @click="addNorth(o)">预览</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div class="buttonDiv">
              <el-button size="mini" @click="clearNorth">清空</el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="比例尺" name="fifth">
            <label>插入比例尺：</label>
            <br />
            <br />
            <label>1 ：</label>
            <el-input v-model="inputScale" placeholder="请输入"></el-input>
            <label>KM</label>
            <div class="buttonDiv">
              <el-button size="mini" @click="showScale">预览</el-button>
              <el-button size="mini" @click="hideScale">清空</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div id="mainDiv">
        <div
          class="tui-image-editor"
          style="position: absolute; width: 100%;height: 750px;z-index:999"
        ></div>
        <div class="mainTitle"></div>
        <div id="titleDiv" :style="titleStyle" v-show="titleVisible"></div>
        <div
          class="pic-content"
          :style="{height:`${700/(currentIndex+1)-20}px`}"
          v-for="(item,index) in zhuantiMessage"
        >
          <div class="leftGrid">
            <ul class="newul">
              <li class="leftLi">
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="lefta">{{item.lat1}}</a>
              </li>
              <li class="leftLi">
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="lefta">{{item.lat2}}</a>
              </li>
              <li class="leftLi">
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="lefta">{{item.lat3}}</a>
              </li>
              <li class="leftLi">
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="lefta">{{item.lat4}}</a>
              </li>
            </ul>
          </div>
          <div class="rightGrid">
            <ul class="newul">
              <li
                style="position: relative;
            width: 6px;
            height: 15%;
            left: 2px;
            border-bottom: 1px solid gray;"
              >
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="righta">{{item.lat1}}</a>
              </li>
              <li
                style="position: relative;
            width: 6px;
            height: 15%;
            left: 2px;
            border-bottom: 1px solid gray;"
              >
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="righta">{{item.lat2}}</a>
              </li>
              <li
                style="position: relative;
            width: 6px;
            height: 15%;
            left: 2px;
            border-bottom: 1px solid gray;"
              >
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="righta">{{item.lat3}}</a>
              </li>
              <li
                style="position: relative;
            width: 6px;
            height: 15%;
            left: 2px;
            border-bottom: 1px solid gray;"
              >
                <a :style="{top:`${94/(currentIndex+1)}px`}" class="righta">{{item.lat4}}</a>
              </li>
            </ul>
          </div>
          <div class="ruler1">
            <div class="cm1">
              <a class="bottoma1">{{item.lon1}}</a>
            </div>
            <div class="cm1">
              <a class="bottoma1">{{item.lon2}}</a>
            </div>
            <div class="cm1">
              <a class="bottoma1">{{item.lon3}}</a>
            </div>
            <div class="cm1">
              <a class="bottoma1">{{item.lon4}}</a>
            </div>
            <div class="cm1">
              <a class="bottoma1">{{item.lon5}}</a>
            </div>
          </div>
          <div class="ruler">
            <div class="cm">
              <a class="bottoma">{{item.lon1}}</a>
            </div>
            <div class="cm">
              <a class="bottoma">{{item.lon2}}</a>
            </div>
            <div class="cm">
              <a class="bottoma">{{item.lon3}}</a>
            </div>
            <div class="cm">
              <a class="bottoma">{{item.lon4}}</a>
            </div>
            <div class="cm">
              <a class="bottoma">{{item.lon5}}</a>
            </div>
          </div>
          <div class="centerDiv">
            <img class="north" />
            <div class="legendImg">
              <label class="legendLabel">图 例</label>
              <div
                style="display: block;text-align: left;"
                v-for="(legendItem, index) in item.legendDivData"
              >
                <div
                  :style="{'display': 'inline-block',
                'width': '11px',
                'height': '11px',
                'margin-left': '1px',
                'background-color': legendItem.color}"
                ></div>
                <span>{{ legendItem.label }}</span>
              </div>
            </div>
            <img :src="item.imageUrl" id="save_img" />
            <div class="buttomDiv">
              <label>1:{{item.inputScale}}KM</label>
              <br />
              <img class="buttomImg" src="../../../static/img/scale.png" />
            </div>
          </div>
        </div>
        <div class="discription">
          <UE
            v-show="!showDiscription"
            :id="'editor2'"
            :defaultMsg="defaultDiscription"
            :config="config"
            ref="ue2"
          ></UE>
          <div v-show="showDiscription" class="discription-content"></div>
          <div v-show="!showDiscription" class="discription-button">
            <el-button size="mini" @click="saveDiscription">保 存</el-button>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPic">新 增</el-button>
        <el-button type="primary" @click="savePic">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElTransfer from "./transfer/src/main";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import UE from "./UE.vue";
import fabric from "./Fabric.vue";
import cesiumCommon from "../js/cesiumCommon";

export default {
  name: "PrintPic",
  components: { UE, ElTransfer, fabric },
  data() {
    return {
      defaultMsg: "请输入",
      defaultDiscription: "请填写专题说明",
      showDiscription: false,
      config: {
        toolbars: [
          [
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "fontborder",
            "strikethrough",
            "superscript",
            "subscript",
            "removeformat",
            "formatmatch",
            "autotypeset",
            "blockquote",
            "|",
            "forecolor",
            "backcolor",
            "insertorderedlist",
            "insertunorderedlist",
            "selectall",
            "cleardoc",
            "|",
            "rowspacingtop",
            "rowspacingbottom",
            "lineheight",
            "|",
            "customstyle",
            "paragraph",
            "fontfamily",
            "fontsize",
            "|",
            "directionalityltr",
            "directionalityrtl",
            "indent",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "touppercase",
            "tolowercase",
            "|",
            "horizontal",
            "date",
            "time"
          ]
        ],
        //          initialFrameWidth: 350,
        initialFrameHeight: 100
      },
      value: "请输入文本",
      titleText: "",
      msg: "",
      map: "",
      color1: "#F51008",
      textareaTitle: "",
      textareaDesc: "",
      dialogFormVisible: false,
      dialogSpecialVisible: false,
      titleVisible: true,
      activeName: "first",
      activeName1: "first",
      toolbars1: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true // 标题
      },
      subfield: false,
      inputScale: "",
      inputLegend: "",
      legendData: [],
      value1: [],
      legendDivData: [],
      titleStyle: {
        position: "absolute",
        "z-index": 999,
        "margin-left": "",
        "margin-top": ""
      },
      northImgArr: [
        "../../../static/img/north.png",
        "../../../static/img/north1.png",
        "../../../static/img/north2.png",
        "../../../static/img/north3.png",
        "../../../static/img/north4.png",
        "../../../static/img/north5.png"
      ],
      zhuantiMessage: [],
      currentIndex: 0
    };
  },
  mounted() {
    let _this = this;
    Bus.$off("exportPicClick");
    Bus.$on("exportPicClick", () => {
      this.dialogFormVisible = true;
    });
  },
  methods: {
    addPic() {
      this.zhuantiMessage.push({});
      this.currentIndex = this.zhuantiMessage.length - 1;
      document.getElementById("app").setAttribute("style", "cursor: pointer");
      this.dialogFormVisible = false;
      this.exportCesiumPic();
    },
    buildCanvas(pingMu, canvas) {
      const width = pingMu.maxX - pingMu.minX;
      const height = pingMu.maxY - pingMu.minY;
      const imageContent = document.createElement("canvas");
      imageContent.width = width;
      imageContent.height = height;
      let ctx = imageContent.getContext("2d");
      ctx.drawImage(
        canvas,
        pingMu.minX,
        pingMu.minY,
        width,
        height,
        0,
        0,
        width,
        height
      );
      this.zhuantiMessage[this.currentIndex].imageUrl = imageContent.toDataURL(
        "image/png"
      );
      this.dialogFormVisible = true;
    },
    exportCesiumPic() {
      const _this = this;
      cesiumCommon.buildCesiumRect(list => {
        let pointList = [];
        let rects = [];
        list.forEach(item => {
          const point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            item
          );
          rects.push(cesiumCommon.Cartesian3_to_WGS84(item));
          pointList.push(point);
        });
        const extents = [
          Math.min(rects[0].lng, rects[1].lng),
          Math.min(rects[0].lat, rects[1].lat),
          Math.max(rects[0].lng, rects[1].lng),
          Math.max(rects[0].lat, rects[1].lat)
        ];
        this.initScale(extents);
        const pingMu = {
          minX: Math.min(pointList[0].x, pointList[1].x),
          maxX: Math.max(pointList[0].x, pointList[1].x),
          minY: Math.min(pointList[0].y, pointList[1].y),
          maxY: Math.max(pointList[0].y, pointList[1].y)
        };
        setTimeout(() => {
          const canvas = viewer.scene.canvas;
          _this.buildCanvas(pingMu, canvas);
        }, 10);
      });
    },
    savePic() {
      const _this = this;
      _this
        .$prompt("请输入专题名称", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          html2canvas(document.getElementById("mainDiv")).then(function(
            canvas
          ) {
            const png = canvas.toDataURL("image/png");
            Bus.$emit("add-zhuan-ti", png, value);
            // if (navigator.msSaveBlob) {
            //   navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            // } else {
            //   canvas.toBlob(function (blob) {
            //     saveAs(blob, 'map.png');
            //   });
            // }
            _this.clearOld();
          });
        });
    },
    titleShow() {
      this.titleVisible = true;
      var ueTxt = this.$refs.ue.getUEContent();
      var div = document.createElement("div");
      div.innerHTML = ueTxt;
      document.getElementById("titleDiv").appendChild(div);
      div.style.position = "fixed";
      div.style.cursor = "pointer";
      div.style.top = "12%";
      this.dragFunc(div, "label");
    },
    saveDiscription() {
      this.showDiscription = true;

      var ueTxt = this.$refs.ue2.getUEContent();
      var div = document.createElement("div");
      div.innerHTML = ueTxt;
      document
        .getElementsByClassName("discription-content")[0]
        .appendChild(div);
    },
    titleHidden() {
      this.titleVisible = false;
    },
    dragFunc(div1, key) {
      var that = this;
      div1.onmousedown = function(ev) {
        var oevent = ev || event;
        var distanceX = oevent.clientX - div1.offsetLeft;
        var distanceY = oevent.clientY - div1.offsetTop;
        document.onmousemove = function(ev) {
          var oevent = ev || event;
          div1.style.left = oevent.clientX - distanceX + "px";
          div1.style.top = oevent.clientY - distanceY + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
      if (key == "label") {
        div1.onmouseenter = function(ev) {
          var img = document.createElement("img");
          img.src = "../../../static/specialImg/close2.png";
          img.style.position = "absolute";
          img.style.top = "0px";
          img.style.right = "-15px";
          img.onclick = function(ev) {
            var clickObj = ev.currentTarget.parentNode;
            that
              .$confirm("是否确定删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: function(action, instance, done) {
                  if (action === "confirm") {
                    document.getElementById("titleDiv").removeChild(clickObj);
                    done();
                  } else {
                    done();
                  }
                }
              })
              .then(function() {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
              })
              .catch(function() {
                that.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          };
          div1.appendChild(img);
        };
        div1.onmouseleave = function(ev) {
          if (div1.children[div1.children.length - 1] != undefined) {
            div1.removeChild(div1.children[div1.children.length - 1]);
          }
        };
      }
    },
    addNorth(src) {
      document.getElementsByClassName("north")[this.currentIndex].src = src;
      this.dragFunc(
        document.getElementsByClassName("north")[this.currentIndex],
        "img"
      );
    },
    clearNorth() {
      document.getElementsByClassName("north")[this.currentIndex].src = "";
    },
    addLegendData() {
      this.color1;
      this.inputLegend;
      this.legendData;
      var data = {
        key: this.legendData.length + 1,
        label: this.inputLegend,
        disabled: false, //i % 4 === 0,
        check: false,
        color: this.color1
      };
      this.legendData.push(data);
    },
    addLegend() {
      document.getElementsByClassName("legendImg")[
        this.currentIndex
      ].style.display = "block";
      this.dragFunc(
        document.getElementsByClassName("legendImg")[this.currentIndex],
        "img"
      );
    },
    clearLegend() {
      document.getElementsByClassName("legendImg")[
        this.currentIndex
      ].style.display = "none";
    },
    showScale() {
      this.$set(
        this.zhuantiMessage[this.currentIndex],
        "inputScale",
        this.inputScale
      );
      document.getElementsByClassName("buttomDiv")[
        this.currentIndex
      ].style.display = "block";
      this.dragFunc(
        document.getElementsByClassName("buttomDiv")[this.currentIndex],
        "div"
      );
    },
    hideScale() {
      document.getElementsByClassName("buttomDiv")[
        this.currentIndex
      ].style.display = "none";
    },
    initScale(extents) {
      var lonStart = parseFloat(extents[0].toFixed(4));
      var latStart = parseFloat(extents[1].toFixed(4));
      var lonEnd = parseFloat(extents[2].toFixed(4));
      var latEnd = parseFloat(extents[3].toFixed(4));
      var Tlon = parseFloat(((lonEnd - lonStart) / 6).toFixed(4));
      var Tlat = parseFloat(((latEnd - latStart) / 6).toFixed(4));
      this.zhuantiMessage[this.currentIndex].lon1 = this.formatDegree(
        (lonStart + Tlon).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lat5 = this.formatDegree(
        (latStart + Tlat).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lon2 = this.formatDegree(
        (parseFloat(lonStart) + 2 * Tlon).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lat4 = this.formatDegree(
        (parseFloat(latStart) + 2 * Tlat).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lon3 = this.formatDegree(
        (parseFloat(lonStart) + 3 * Tlon).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lat3 = this.formatDegree(
        (parseFloat(latStart) + 3 * Tlat).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lon4 = this.formatDegree(
        (parseFloat(lonStart) + 4 * Tlon).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lat2 = this.formatDegree(
        (parseFloat(latStart) + 4 * Tlat).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lon5 = this.formatDegree(
        (parseFloat(lonStart) + 5 * Tlon).toFixed(4)
      );
      this.zhuantiMessage[this.currentIndex].lat1 = this.formatDegree(
        (parseFloat(latStart) + 5 * Tlat).toFixed(4)
      );
    },
    formatDegree(value) {
      var v1 = Math.floor(value); //度
      var v2 = Math.floor((value - v1) * 60); //分
      var v3 = Math.round(((value - v1) * 3600) % 60); //秒
      return v1 + "°" + v2 + "'"; // + v3 + '"';
    },
    rightChange(value, direction, movedKeys) {
      this.zhuantiMessage[this.currentIndex].legendDivData = [];
      let that = this;
      this.legendData.forEach(function(item) {
        value.forEach(function(vItem) {
          if (item.key == vItem) {
            that.zhuantiMessage[that.currentIndex].legendDivData.push(item);
          }
        });
      });
    },
    clearOld() {
      this.titleHidden();
      this.clearNorth();
      this.clearLegend();
      this.hideScale();
      Bus.$emit("clearFabric");
      this.zhuantiMessage = [];
      document.getElementsByClassName("discription-content")[0].innerHTML = "";
      this.dialogFormVisible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.picMain .el-dialog__header {
  padding: 20px 20px 10px;
  text-align: left;
  background-color: #1d2733;
  color: wheat;
}

.picMain .el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #c5ebf8;
}

.picMain .el-dialog__body {
  /* padding: 30px 20px; */
  color: #606266;
  font-size: 14px;
}

.picMain .el-input__inner {
  /*padding-right: 30px;*/
  width: 90%;
  margin-bottom: 5px;
  color: #b1d1e1;
  /*background-color: #171e26;*/
  /*border: 1px solid #198FCC;*/
}

.picMain .el-textarea__inner {
  width: 100%;
  /*margin-left: 10%;*/
  border: 0px solid #dcdfe6;
}

.picMain .el-dialog {
  width: 90%;
  background-color: #171e26;
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.picMain .el-dialog__wrapper {
  top: -100px;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}

#leftDiv {
  float: left;
  width: 30%;
  margin-right: 10px;
}

#mainDiv {
  border: 1px solid #dcdfe6;
  float: left;
  width: 69%;
  height: 750px;
  background-color: white;
  position: relative;
}

#rightDiv {
  float: left;
  width: 33%;
  margin-right: 10px;
}

.picMain .el-dialog__body {
  padding: 15px 20px;
  color: #606266;
  font-size: 14px;
  float: left;
  width: 97%;
}

.north {
  position: absolute;
  cursor: pointer;
  width: 40px;
  right: 11%;
  top: 15%;
  z-index: 999;
}

.legendImg {
  position: absolute;
  cursor: pointer;
  width: 150px;
  left: 5%;
  top: 60%;
  display: none;
  background-color: white;
  border: 1px black solid;
  z-index: 999;
}

.titleArea {
  text-align: center;
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  /*margin-left: 10%;*/
  border: 0px solid #dcdfe6;
  border-radius: 4px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.v-note-wrapper {
  min-width: 0px;
  height: 115px;
  min-height: 0px;
  min-height: 0px;
}

.picMain .el-tabs__item {
  color: #d1e5f2;
  padding: 0 20px;
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.titleLabel {
  color: #d1e5f2;
}

.positionDiv {
  text-align: left;
  color: #b1d1e1;
  margin-top: 20px;
}

.picMain .el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 60%;
}

.picMain .buttonDiv {
  margin-top: 40px;
  margin-left: 100px;
}

.picMain .LegendLeftDiv {
  width: 40%;
  float: left;
}

.LegendCenterDiv {
  width: 20%;
  float: left;
  margin-top: 40px;
}

.LegendRightDiv {
  width: 40%;
  float: left;
}

.picMain .el-tabs__content {
  text-align: left;
  color: #b1d1e1;
}
.picMain .el-transfer {
  width: 380px;
}

.picMain .el-transfer-panel {
  width: 155px;
  border: 1px solid #198fcc;
  background: #171e26;
}

.picMain .el-transfer__buttons {
  display: inline-block;
  vertical-align: middle;
  width: 55px;
  padding: 0 0px;
}

.picMain.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  /*width: 100%;*/
  display: block;
  /*border-bottom: 1px solid #198FCC;*/
}

.imageLegend {
  width: 100%;
  display: block;
}

.picMain .clearfix:before,
.picMain .clearfix:after {
  display: table;
  content: "";
}

.picMain .clearfix:after {
  clear: both;
}

.picMain .el-col-8 {
  width: 25%;
  margin-top: 10px;
}

.picMain .el-col-offset-2 {
  margin-left: 9.33333%;
}

.picMain .markdown-body * {
  background-color: #171e26;
  color: #b1d1e1;
}

.picMain .el-button {
  /*display: inline-block;*/
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  /*background: #171e26;*/
  border: 1px solid #198fcc;
  color: #b1d1e1;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
}

.picMain .el-transfer-panel .el-transfer-panel__header {
  height: 40px;
  line-height: 40px;
  background: #171e26;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #198fcc;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
}

.picMain
  .el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label {
  font-size: 16px;
  font-weight: 400;
  color: #b1d1e1;
}

.el-transfer-panel__item.el-checkbox {
  color: #b1d1e1;
}

.picMain::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #e0e0e0;
}

/*定义滑块 内阴影+圆角*/
.picMain::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #b3b3b3;
}

.picMain .el-card {
  border: 1px solid #198fcc;
  background-color: #171e26;
  color: #303133;
  transition: 0.3s;
}

.picMain .el-checkbox__inner {
  background-color: #7cd5f7;
}

.picMain .el-transfer__button.is-disabled,
.el-transfer__button.is-disabled:hover {
  border: 1px solid #dcdfe6;
  background-color: #04090a;
  color: #c0c4cc;
}

.picMain .auto-textarea-wrapper .auto-textarea-input {
  /*color: #f3f5f7 !important;*/
  background: fixed !important;
  border: none !important;
}

.picMain .v-note-wrapper {
  border: 1px solid #198fcc;
}

.buttomDiv {
  position: absolute;
  bottom: 30%;
  display: none;
  cursor: pointer;
  z-index: 999;
}

.buttomImg {
  width: 70px;
}

a {
  text-decoration: none;
}

.newul {
  list-style: none;
  height: 100%;
}

.rightli {
  position: relative;
  width: 6px;
  height: 15%;
  left: 2px;
  border-bottom: 1px solid gray;
}

ul > li + li {
  border-left-color: gray;
}

.righta {
  color: black;
  position: absolute;
  white-space: nowrap;
  left: -8px;
  top: 94px;
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(90deg);
}

.centerDiv {
  margin: 20px 30px;
  width: 100%;
  height: calc(100% - 25px);
}

#save_img {
  width: calc(100% - 54px);
  height: 100%;
}

#saveDiv {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
}

.rightGrid {
  position: absolute;
  right: 20px;
  height: 100%;
}

.leftGrid {
  height: 100%;
  left: -20px;
  position: absolute;
}

.leftLi {
  position: relative;
  width: 5px;
  height: 15%;
  left: 4px;
  border-bottom: 1px solid gray;
  border-left: 1px solid transparent;
}

.lefta {
  position: absolute;
  color: black;
  left: -30px;
  top: 94px;
  white-space: nowrap;
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(90deg);
}

.ruler {
  position: absolute;
  width: 100%;
  margin: 16px auto;
  height: 14px;
  bottom: 0px;
}

.picMain .ruler .cm,
.picMain .ruler .mm {
  position: absolute;
  border-left: 1px solid #555;
  height: 7px;
  width: 10%;
  bottom: 0px;
}

.picMain .ruler .cm:after {
  position: absolute;
  bottom: -15px;
  font: 11px/1 sans-serif;
}

.picMain .ruler .cm:nth-of-type(1) {
  left: 20%;
}

.picMain .ruler .cm:nth-of-type(1):after {
  content: "";
}

.picMain .ruler .cm:nth-of-type(2) {
  left: 35%;
}

.picMain .ruler .cm:nth-of-type(2):after {
  content: "";
}

.picMain .ruler .cm:nth-of-type(3) {
  left: 50%;
}

.picMain .ruler .cm:nth-of-type(3):after {
  content: "";
}

.picMain .ruler .cm:nth-of-type(4) {
  left: 65%;
}

.picMain .ruler .cm:nth-of-type(4):after {
  content: "";
}

.picMain .ruler .cm:nth-of-type(5) {
  left: 80%;
}

.picMain .ruler .cm:nth-of-type(5):after {
  content: "";
}

.bottoma {
  display: block;
  position: absolute;
  height: 20px;
  line-height: 0px;
  top: -5px;
  left: -40px;
  margin-left: 22px;
  margin-top: 20px;
  color: black;
}

.ruler1 {
  position: absolute;
  width: 100%;
  height: 14px;
  top: -5px;
}

.ruler1 .cm1,
.ruler1 .mm1 {
  position: absolute;
  border-left: 1px solid #555;
  height: 5px;
  width: 10%;
  left: 20%;
}

.ruler1 .cm1:after {
  position: absolute;
  bottom: -15px;
  font: 11px/1 sans-serif;
}

.ruler .cm:nth-of-type(1) {
  left: 20%;
}

.ruler1 .cm1:nth-of-type(1):after {
  content: "";
}

.ruler1 .cm1:nth-of-type(2) {
  left: 35%;
}

.ruler1 .cm1:nth-of-type(2):after {
  content: "";
}

.ruler1 .cm1:nth-of-type(3) {
  left: 50%;
}

.ruler1 .cm1:nth-of-type(3):after {
  content: "";
}

.ruler1 .cm1:nth-of-type(4) {
  left: 65%;
}

.ruler1 .cm1:nth-of-type(4):after {
  content: "";
}

.ruler1 .cm1:nth-of-type(5) {
  left: 80%;
}

.ruler1 .cm1:nth-of-type(5):after {
  content: "";
}

.bottoma1 {
  display: block;
  position: absolute;
  height: 13px;
  line-height: 0px;
  left: -40px;
  margin-left: 22px;
  bottom: 0px;
  /* Writing-mode: tb-rl; */
  color: black;
}

.ruler2 {
  position: absolute;
  height: 100%;
  left: 16px;
  width: 14px;
  bottom: 0px;
}

.ruler2 .cm2 {
  position: absolute;
  border-bottom: 1px solid #555;
  width: 14px;
  /*height: 10%;*/
}

.ruler2 .cm2:after {
  position: absolute;
  bottom: -15px;
  font: 11px/1 sans-serif;
}

.ruler2 .cm2:nth-of-type(1) {
  top: 20%;
}

.ruler2 .cm2:nth-of-type(1):after {
  content: "";
}

.ruler2 .cm2:nth-of-type(2) {
  top: 35%;
}

.ruler2 .cm2:nth-of-type(2):after {
  content: "";
}

.ruler2 .cm2:nth-of-type(3) {
  top: 50%;
}

.ruler2 .cm2:nth-of-type(3):after {
  content: "";
}

.ruler2 .cm2:nth-of-type(4) {
  top: 65%;
}

.ruler2 .cm2:nth-of-type(4):after {
  content: "";
}

.ruler2 .cm2:nth-of-type(5) {
  top: 80%;
}

.ruler2 .cm2:nth-of-type(5):after {
  content: "";
}

.bottoma2 {
  display: block;
  position: absolute;
  height: 32px;
  line-height: 0px;
  left: -6px;
  /* margin-left: 16px; */
  bottom: 0px;
  writing-mode: tb-rl;
  color: black;
}

.markDiv {
  position: absolute;
  right: 10px;
  width: 400px;
  height: 300px;
  background-color: #171e26;
}

.legendLabel {
  color: black;
  font-size: 20px;
}

.mainTitle {
  height: 50px;
  border-bottom: 1px black solid;
}

.picMain .close {
  float: right;
  font-size: 12px;
  font-weight: 12;
  line-height: 1;
  color: white;
  text-shadow: 0 1px 0 #fff;
  filter: alpha(opacity=20);
  opacity: 1;
  background-color: #4c4854;
}
.pic-content {
  position: relative;
  width: 65%;
}
.discription {
  width: 30%;
  position: absolute;
  height: calc(100% - 80px);
  border: 1px solid #000;
  right: 0px;
  top: 55px;
  padding: 10px;
  z-index: 1000;
}
.discription .edui-editor-iframeholder {
  height: 480px !important;
}
.discription-content {
  height: 100%;
  overflow: auto;
}
.discription-button {
  text-align: right;
  padding: 10px;
}
</style>
