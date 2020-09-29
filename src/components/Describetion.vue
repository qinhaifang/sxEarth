<template>
  <div v-show="showAll" class="describetion">
    <!--县描述信息-->
    <div
      v-if="this.area === 'county' && describetion.name"
      class="county-describetion"
    >
      <div class="colse" @click="describetion.name = null">×</div>
      <div class="title">{{ describetion.name }}简介</div>
      <div class="content">{{ describetion.introduction }}</div>
    </div>
    <!--镇描述信息-->
    <div
      v-if="this.area === 'town' && describetion.name"
      class="town-describetion"
    >
      <div class="title">{{ describetion.name }}</div>
      <div class="content">{{ describetion.introduction }}</div>
    </div>
    <div
      v-if="['village', 'cha'].includes(this.area) && describetion.name"
      class="village-describetion"
    >
      <div class="title">{{ describetion.name }}</div>
      <div class="content">{{ describetion.introduction }}</div>
    </div>
    <div v-if="['village', 'cha'].includes(this.area)" class="village-img">
      <div class="title" v-if="this.area === 'village'">安置点建设图</div>
      <div class="title" v-if="this.area === 'cha'">茶园建设图</div>
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <img :src="item" @click="imgInView(item)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div
      v-if="['village', 'cha'].includes(this.area)"
      class="village-box"
      :class="{ 'box-height': !minBox }"
    >
      <div class="inner-box">
        <div class="title" @click="toggleBox">资源管理器</div>
        <el-tabs class="tab-box">
          <el-tab-pane label="影像">
            <el-checkbox
              v-for="(item, index) in yingxiang"
              :key="index"
              :class="{ checked: currentYingXiang === index }"
              @change="checkedYingXiang(index)"
            >
              <div class="left">{{ item.fileName }}</div>
              <div class="right">
                {{
                  item.fileName
                    .split("_")
                    [item.fileName.split("_").length - 1].slice(0, 8)
                }}
              </div>
            </el-checkbox>
          </el-tab-pane>
          <el-tab-pane label="专题">
            <div v-for="(item, index) in zhuanti" :key="index">
              <div class="left1">
                <img
                  v-if="item.type !== 'creat'"
                  @click="
                    imgInView(
                      `${baseUrl}/manager/rest/file/browse?id=${item.id}&fileType=${item.fileType}`
                    )
                  "
                  :src="
                    `${baseUrl}/manager/rest/file/browse?id=${item.id}&fileType=${item.fileType}`
                  "
                />
                <img
                  v-if="item.type === 'creat'"
                  @click="imgInView(item.url)"
                  :src="item.url"
                />
                <span>{{ item.fileName }}</span>
              </div>
              <div class="right">
                <span v-if="item.type !== 'creat'">{{
                  item.fileName
                    .split("_")
                    [item.fileName.split("_").length - 1].slice(0, 8)
                }}</span>
                <span v-if="item.type === 'creat'">{{ item.date }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-if="this.area === 'cha'" class="cha">
      <div class="inner-box">
        <div class="title">帮扶贫困户列表</div>
        <div class="table">
          <div class="head">
            <div>
              <span style="width:60px;">户主</span>
              <span style="width:65px;">家庭人口</span>
              <span style="width:60px;">帮扶人</span>
              <span style="width:80px;">致贫原因</span>
              <span style="width:100px;">搬迁时间</span>
              <span style="width:80px;">原住址</span>
            </div>
          </div>
          <div class="body">
            <div class="row" v-for="(item, index) in chaList" :key="index">
              <div>
                <span style="width:60px;">{{ item.name }}</span>
                <span style="width:65px;">{{ item.number }}</span>
                <span style="width:60px;">{{ item.help }}</span>
                <span style="width:80px;">{{ item.reason }}</span>
                <span style="width:100px;">{{ item.movetime }}</span>
                <span style="width:80px;">{{ item.village }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="lagerImg" class="larger-image">
      <div class="close" @click="lagerImg = null">×</div>
      <img :src="lagerImg" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lagerImg: null,
      area: "county",
      imgList: [],
      describetion: {
        name: null,
        introduction: null
      },
      minBox: true,
      showAll: true,
      yingxiang: [],
      currentYingXiang: null,
      baseUrl: window.UrlSetting.baseUrl,
      zhuanti: [],
      chaList: []
    };
  },
  mounted() {
    Bus.$on("timeline-zhuanti", (png, date, value) => {
      this.zhuanti.push({
        type: "creat",
        date,
        url: png,
        fileName: value + date
      });
    });
    Bus.$on("timeline-yingxiang", (index, polygon) => {
      this.checkedYingXiang(index, polygon);
    });
    Bus.$on("cha-lie-biao", data => {
      this.chaList = data.splice(0, 170);
      // Bus.$emit("add-search-point", this.chaList);
    });
    Bus.$on("yingxiangtu", data => {
      this.yingxiang = data;
    });
    Bus.$on("zhuantitu", data => {
      this.zhuanti = data;
    });
    Bus.$on("toggle-div", bool => {
      this.showAll = bool;
    });
    Bus.$on("show-lager-image", url => {
      this.lagerImg = url;
    });
    Bus.$on("add-introduction", (area, name, introduction) => {
      if (area.substr(-8) == "00000000") {
        this.area = null;
      } else if (area.substr(-6) == "000000") {
        this.area = "county";
      } else if (area.substr(-3) == "000") {
        this.area = "town";
      } else if (area === "610726002299") {
        this.area = "cha";
      } else {
        this.area = "village";
      }
      this.describetion.name = name;
      this.describetion.introduction = introduction;
    });
    Bus.$on("village-img", list => {
      this.imgList = list;
    });
  },
  methods: {
    imgInView(url) {
      this.lagerImg = url;
    },
    toggleBox() {
      this.minBox = !this.minBox;
    },
    checkedYingXiang(index, polygon) {
      Bus.$emit("remove-ying-xiang");
      if (this.currentYingXiang !== null) {
        Bus.$emit("clear-last-entity2");
      }
      if (this.currentYingXiang === index) {
        this.currentYingXiang = null;
      } else {
        this.currentYingXiang = index;
        Bus.$emit("add-ying-xiang", this.yingxiang[this.currentYingXiang].id);

        Bus.$emit("add-polyine", polygon);
      }
      // Bus.$emit("current-timeline", this.currentYingXiang);
    }
  }
};
</script>

<style scoped></style>
