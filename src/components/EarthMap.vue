<template>
  <div id="earth">
    <div class="construction-instructions" v-show="isShowSchedule">
      <div
        style="text-align:right;font-size:26px;cursor: pointer;position:absolute;right:10px;top:5px;"
      >
        <i class="el-icon-circle-close" @click="isShowSchedule = false"></i>
      </div>
      <div class="detail-head">
        <div class="head-title" style="cursor: pointer;">
          施工前说明
        </div>
      </div>
      <div class="detail-content">
        <div class="content-item">
          <div class="item-title">项目状况:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgqsm.xmzk
                : ""
            }}
          </div>
        </div>
      </div>
      <div class="detail-head">
        <div class="head-title">施工中说明</div>
      </div>
      <div class="detail-content">
        <div class="content-item">
          <div class="item-title">施工日期:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.sgrq
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">申请资金:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.sqzj
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">指标文件:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.zbwj
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">资金支付日期:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.zjzfrq
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">到企业:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.dqy
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">支付资金:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.zfzj
                : ""
            }}
          </div>
        </div>
        <div
          class="content-item"
          v-if="
            currentProject.sgSchedule && currentProject.sgSchedule.sgzsm.zjzfrq1
          "
        >
          <div class="item-title">资金支付日期:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.zjzfrq1
                : ""
            }}
          </div>
        </div>
        <div
          class="content-item"
          v-if="
            currentProject.sgSchedule && currentProject.sgSchedule.sgzsm.dqy1
          "
        >
          <div class="item-title">到企业:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.dqy1
                : ""
            }}
          </div>
        </div>
        <div
          class="content-item"
          v-if="
            currentProject.sgSchedule && currentProject.sgSchedule.sgzsm.zfzj1
          "
        >
          <div class="item-title">支付资金:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sgzsm.zfzj1
                : ""
            }}
          </div>
        </div>
      </div>
      <div class="detail-head">
        <div class="head-title">施工后说明</div>
      </div>
      <div class="detail-content">
        <div class="content-item">
          <div class="item-title">建设规模及内容:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sghsm.jsgmjnr
                : ""
            }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">社会效益:</div>
          <div class="item-content">
            {{
              currentProject.sgSchedule
                ? currentProject.sgSchedule.sghsm.shxy
                : ""
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="project-detail" v-show="isShowProjectInfo">
      <div
        style="text-align:right;font-size:26px;cursor: pointer;padding-right:5px"
      >
        <i class="el-icon-circle-close" @click="isShowProjectInfo = false"></i>
      </div>
      <div class="detail-head">
        <div class="head-title" style="cursor: pointer;">
          项目详情
        </div>
        <div class="monitor">
          <div
            class="monitor-btn"
            @click="monitorClickHandle()"
            style="padding:5px;background-color:#5081e0;width:80px;border-radius:5px;text-align:center;cursor: pointer;"
          >
            动态监控
          </div>
        </div>
      </div>
      <div class="detail-content">
        <div class="content-item">
          <div class="item-title">项目名称:</div>
          <div class="item-content">
            {{ currentProject.name }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">项目资金:</div>
          <div class="item-content">
            {{ currentProject.xmzj }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">建设地址:</div>
          <div class="item-content">
            {{ currentProject.jsdz }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">项目年度:</div>
          <div class="item-content">
            {{ currentProject.xmnd }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">覆盖贫困村:</div>
          <div class="item-content">
            {{ currentProject.fgpkc }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">项目主管单位:</div>
          <div class="item-content">
            {{ currentProject.xmzgdw }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">项目负责人:</div>
          <div class="item-content">
            {{ currentProject.xmfzr }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">联系方式:</div>
          <div class="item-content">
            {{ currentProject.lxfs }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">建设规模及内容:</div>
          <div class="item-content">
            {{ currentProject.jsgmjnr }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">社会效益:</div>
          <div class="item-content">
            {{ currentProject.shxy }}
          </div>
        </div>
      </div>
    </div>
    <div class="monitor-result-compare" v-show="isShowResultCompare">
      <div style="text-align:right;font-size:26px;cursor: pointer;">
        <i
          class="el-icon-circle-close"
          @click="isShowResultCompare = false"
        ></i>
      </div>
      <table>
        <tr>
          <th></th>
          <th>建设目标</th>
          <th>完成情况</th>
          <th>比对结果</th>
        </tr>
        <tr v-for="(item, index) in tableData" :key="index">
          <td style="width:20%" v-html="item.dataEntry"></td>
          <td style="width:30%" v-html="item.target"></td>
          <td style="width:30%" v-html="item.state"></td>
          <td style="width:20%" v-html="item.compare"></td>
        </tr>
      </table>
    </div>
    <!---->
    <div
      class="monitor-result-btn"
      @click="monitorResultHandle"
      v-show="isShowMonitorBtn"
    >
      监控成效
    </div>
    <div id="slider" v-show="isShowTimeLine"></div>
    <NewTimeLine></NewTimeLine>
  </div>
</template>
<script>
const geoserverUrl = window.UrlSetting.baseUrl + "/geoserver";
const layer = "http://220.181.130.171:9090/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{reverseY}.jpg";
      //window.UrlSetting.baseUrl + "/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{reverseY}.jpg";
const layer1 =
  "http://220.181.130.171:9090/gisserver/tiles/mbtiles/hanzhong/{z}/{x}/{reverseY}.jpg";

const wmtsUrl = window.UrlSetting.baseUrl + "/geoserver/gwc/service/wmts";
const terrain = window.UrlSetting.DEM_URL;
import CreatePanel from "./CreatePanel";
import NewTimeLine from "@/components/NewTimeLine";
import axios from "axios";
import {
  upDateMessage,
  searchPoint,
  getfileMeta,
  getlayermeta
} from "../api/api";

export default {
  components: {
    CreatePanel,
    NewTimeLine
  },
  data() {
    return {
      isShowMonitorBtn: false, //监控成效按钮
      isShowResultCompare: false, //监控成效弹出的表格
      isShowTimeLine: false,
      moveActive: false,
      createPanel: {
        left: "",
        top: ""
      },
      checkTerrain: false,
      viewer: null,
      viewMessage: "经度：0°，纬度：0°，视高：0km",
      fpsMessage: "帧率：0",
      currentLayer: null,
      currentLayer1: null,
      currentPinKunLayer: null,
      iconImage: null,
      extent: null,
      currentPeople: null,
      entitiesList: [],
      entitiesList2: [],
      entitiesList3: [],
      resettlementData: [],
      imgList: null,
      showAllMessage: false,
      resettlementLayerId: null,
      moveIcon: false,
      layerNearest: null,
      handlerList: [],
      showPanel: false,
      currentPoint: null,
      currentModel: null,
      showImageIcon: false,
      imgPosition: {
        left: "",
        top: ""
      },
      showContent: false,
      pinKunTranslate: {
        "000000000000": "china",
        "610000000000": "sx",
        "610700000000": "hanzhong",
        "150000000000": "neimenggu",
        "150700000000": "hulunbeier"
      },
      showEdit: false,
      formData: {},
      currentModle: null,
      isShowProjectInfo: false,
      isShowSchedule: false, // 动态监控  --- 施工前说明
      zoneBoundaryEntity: null,
      currentZoneObject: null,
      zoneObject: [
        {
          zoneName: "gxzzzzz",
          lon: 109.224724,
          lat: 23.791674,
          height: 1314150,
          name: "广西壮族自治区"
        },
        {
          zoneName: "jxyzzzx",
          lon: 110.197481,
          lat: 24.055164,
          height: 169496,
          name: "金秀瑶族自治县"
        },
        {
          zoneName: "lbs",
          lon: 109.213225,
          lat: 23.755164,
          height: 311615,
          name: "来宾市"
        },
        {
          zoneName: "qg",
          lon: 112.003,
          lat: 30,
          height: 10911680,
          name: "全国"
        }
      ],
      projectDetail: [
        {
          centerPosition: {
            lon: 108.1963,
            lat: 24.1250,
            height: 10000
          },
          serviceId: "5f00d151-7c0a-45ce-ac12-565c407b02b9",
          name: "都安县高岭镇加全村下坡屯至拉烈镇隆翠村弄长屯级路硬化工程",
          xmzj: "90 万元",
          jsdz: "罗孟村委新建屯至平竹村委六对屯",
          xmnd: "2018年",
          fgpkc: "新建屯、大坪屯、六对屯",
          xmzgdw: "金秀县交通运输局",
          xmfzr: "严金水",
          lxfs: "18978235778",
          jsgmjnr:
            "新建路线长10.028公里，路基工程、涵洞工程、路面工程、交通安全设施工程建设",
          shxy: "方便广大人民群众出行",
          sgSchedule: {
            sgqsm: {
              xmzk: "道路不平整，容易积水，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2018-10至2019-09",
              sqzj: "1105万元",
              zbwj: "金财建【2019】7号",
              zjzfrq: "2019-03-29",
              dqy: "凯天建设发展集团有限公司",
              zfzj: "252.5万元",
              zjzfrq1: "2019-10-28",
              dqy1: "凯天建设发展集团有限公司",
              zfzj1: "178.2389万元"
            },
            sghsm: {
              jsgmjnr:
                "新建路线长10.028公里，路基工程、涵洞工程、路面工程、交通安全设施工程建设",
              shxy: "方便广大人民群众出行，促进当地经济发展"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target:
                "新建路线长10.028公里，路基工程、涵洞工程、路面工程、交通安全设施工程建设",
              state: "图上作业测量新建路线长约10.05公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2018年10月至2019年9月",
              state: "2019年9月20日监测到项目已按期完成",
              compare: "<span style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target: "2019年2月12日资金下达到金秀县交通运输局1105万元",
              state:
                "2019年3月29日支付252.5万元<br/><br/>2019年10月28日支付178.2389万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：项目资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "lm01",
            "2018-02-06": "lm02",
            "2019-09-20": "lm03"
          }
        },
        {
          centerPosition: {
            lon: 108.0953,
            lat: 24.3222,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "永吉村加拉至干真屯级路建设",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "sh",
            "2017-10-30": "sh",
            "2018-02-06": "sh",
            "2019-09-20": "sh"
          }
        },
        {
          centerPosition: {
            lon: 107.9019,
            lat: 24.1778,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "六山村龙项屯乡级饮水安全巩固提升工程（新建水厂一个）",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "sh",
            "2017-10-30": "sh",
            "2018-02-06": "sh",
            "2019-09-20": "sh"
          }
        },
        {
          centerPosition: {
            lon: 108.1172,
            lat: 23.9340,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "江洒水库移民新村提升工程",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "sh",
            "2017-10-30": "sh",
            "2018-02-06": "sh",
            "2019-09-20": "sh"
          }
        },
        {
          centerPosition: {
            lon: 108.4289,
            lat: 24.0792,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "孟荣水库移民新村续建工程",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2019-03-12": "sh",
            "2019-11-11": "sh",
            "2020-04-09": "sh"
          }
        },
        {
          centerPosition: {
            lon: 108.2328,
            lat: 24.2289,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "拉烈镇地平村花东坳口至弄险道路",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "sh",
            "2017-10-30": "sh",
            "2018-02-06": "sh",
            "2019-09-20": "sh"
          }
        },
        {
          centerPosition: {
            lon: 108.1268,
            lat: 23.9460,
            height: 10000
          },
          serviceId: "18a6f2fc-f794-4e8b-bfc8-8d5da3e4ee4f",
          name: "推内水库移民新村提升工程",
          xmzj: "48 万元",
          jsdz: "忠良乡双合村",
          xmnd: "2019年",
          fgpkc: "忠良乡双合村",
          xmzgdw: "金秀县扶贫办",
          xmfzr: "李东",
          lxfs: "18778247770",
          jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
          shxy: "带动增加贫困人口收入0.5万元，受益贫困人口61人",
          sgSchedule: {
            sgqsm: {
              xmzk: "项目状况：交通不便，影响当地经济发展"
            },
            sgzsm: {
              sgrq: "2019-1至2019-11",
              sqzj: "453万元",
              zbwj: "金财农【2019】3号",
              zjzfrq: "2019-03-27;2019-06-21;2019-08-28",
              dqy: "金秀瑶族自治县城乡建设投资有限公司",
              zfzj: "435.39万元"
            },
            sghsm: {
              jsgmjnr: "建设10.742公里（路基路面路肩、水沟涵洞）",
              shxy:
                "切实改变项目区贫困群众出行难，明显改善项目区贫困落后的交通运输状况。"
            }
          },
          result: [
            {
              dataEntry: "<span style='font-size: 18px'>工程量</span>",
              target: "建设10.742公里（路基路面路肩、水沟涵洞）",
              state: "图上作业测量建设约10.75公里",
              compare:
                "<span style='color:rgba(0,255,0,1)'>工程量满足要求</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>项目进度</span>",
              target: "2019年1月至2019年11月",
              state: "2019年11月监测到项目已按期完成",
              compare:
                "<span style='style='color:rgba(0,255,0,1)'>项目按期完成</span>"
            },
            {
              dataEntry: "<span style='font-size: 18px'>资金拨付进度</span>",
              target:
                "2019年8月14日资金下达到金秀县扶贫办2037万元，包含本项目金额453万元",
              state:
                "2019年3月27日支付183.74万元<br/><br/>2019年6月21日支付34万元<br/><br/>2019年6月21日支付134.45万元<br/><br/>2019年8月28日支付52万元",
              compare:
                "<img src='static/images/warn.png' style='width:20px;height:20px;'/><span style='color:rgba(255,0,0,1)'>预警：资金未全部支付</span>"
            }
          ],
          roadFileName: {
            "2017-02-11": "sh",
            "2017-10-30": "sh",
            "2018-02-06": "sh",
            "2019-09-20": "sh"
          }
        },
      ],
      tableData: [],
      currentProject: {}
    };
  },
  mounted() {
    Bus.$on("clear-all-mark", () => {
      this.isShowResultCompare = false;
      this.isShowMonitorBtn = false;
      this.isShowTimeLine = false;
      this.clearLayers();
      this.showProjectInfoHandle(false);
      this.showScheduleHandle(false);
      //if (this.currentZoneObject) {
      this.clearZoneBoundary();
      //}
      this.removeEntity2();
      this.removeEntity();
      //隐藏时间轴
      Bus.$emit("show-time-line", false);
    });
    //点击行政区划触发
    Bus.$on("zone-click-event", zoneName => {
      if (!zoneName) {
        return;
      }
      Bus.$emit("clear-all-mark");

      if (zoneName === "江林安置点") {
        Bus.$emit("XXX-AZD-time", "xxx安置点");
        return;
      }
      this.zoneLocation(zoneName);
      if (zoneName === "广西壮族自治区") {
        //添加贫困点
        this.addPKPoint();
      }
    });
    //点击项目触发  安置点等
    Bus.$on("project-click-event", projectName => {
      Bus.$emit("clear-all-mark");
      this.projectLocation(projectName);
      //清除之前项目点
      //this.removeEntity2();
      //添加项目点
      if (this.currentProject) {
        this.isShowMonitorBtn = true;
        this.addPoint(
          this.WGS84_to_Cartesian3([
            this.currentProject.centerPosition.lon,
            this.currentProject.centerPosition.lat
          ])
        );
      }
    });
    Bus.$on("add-yingxiang-lyr", (serviceIds, projectName, time) => {
      this.clearLayers();
      // 添加上层影像图
      getlayermeta(serviceIds[serviceIds.length - 1]).then(item => {
        // res1.forEach(item => {

        //   if (item.type === "wmts") {
            // item.matrixIds = [];
            // for (let z = 0; z <= item.meta.maxLevel; z += 1) {
            //   item.matrixIds[z] = `EPSG:4326:${z}`;
            // }
            this.addeRsettlementLayer(item, 2, true);
        //     if (projectName === "xxx安置点") {
        //       this.flyTo(106.296158, 33.0540845, 1000);
        //     } else {
        //       //清除路线
        //       this.clearZoneBoundary();
        //       //定位缩放
        //       let position = this.currentProject.centerPosition;
        //       this.flyTo(position.lon, position.lat, position.height);

        //       //添加路线
              let fileName = this.currentProject.roadFileName[time];
              this.loadPolygonData(fileName);
        //     }
        //   }
        // });
      });
      //添加最下层影像
      if (serviceIds.length > 1) {
        getlayermeta(serviceIds[0]).then(res1 => {
          this.addImageLayers(res1, 1);
          // res1.forEach(item => {
          //   if (item.type === "wmts") {
          //     item.matrixIds = [];
          //     for (let z = 0; z <= item.zoomStop; z += 1) {
          //       item.matrixIds[z] = `${item.srs}:${z}`;
          //     }
          //     this.addImageLayers(item, 1);
          //   }
          // });
        });
      }
    });
    this.init();
    window.viewer = this.viewer;

    //this.addZoneBoundary(this.zoneObject[0]);
    //this.currentProject = this.projectDetail[0];
    this.addLister();

    this.addSolidCanage();
  },
  methods: {
    removeEntity() {
      this.entitiesList.forEach(item => {
        this.viewer.entities.remove(item);
      });
      this.entitiesList = [];
    },
    //加载多边形数据
    loadPolygonData(fileName) {
      axios.get(`static/data/${fileName}.json`).then(res => {
        // debugger;
        let polygonCoordory = res.data.features[0].geometry.coordinates[0];
        let polyList = [];
        for (let i = 0; i < polygonCoordory.length; i++) {
          polyList.push(polygonCoordory[i][0]);
          polyList.push(polygonCoordory[i][1]);
        }
        this.addPolygon(polyList);
      });
    },
    //加载虚线多边形
    addPolygon(polyList) {
      const poly = this.viewer.entities.add({
        polygon: {
          show: true,
          hierarchy: Cesium.Cartesian3.fromDegreesArray(polyList),
          material: Cesium.Color.GREEN.withAlpha(0),
          outline: true,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 20,
          height: 0
        }
      });
      this.entitiesList.push(poly);
    },
    addPKPoint() {
      Cesium.GeoJsonDataSource.load("static/data/pkx.json").then(dataSource => {
        viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          entity.billboard = undefined;
          entity.point = new Cesium.PointGraphics({
            color: Cesium.Color.RED,
            pixelSize: 10
          });
        }
        let pkxDataUrl = ["dayzzzx", "yjq", "jxyzzzx"];
        //添加面
        //for (let i = 0; i < pkxDataUrl.length; i++) {
        //this.addPKXBoundary(pkxDataUrl[0]);
        //}
      });
    },
    addPKXBoundary(fileName) {
      console.log('fileName',fileName)
      this.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(`static/data/boundary/${fileName}.json`, {
          stroke: Cesium.Color.WHITE,
          fill: Cesium.Color.fromCssColorString("#FF1493").withAlpha(1),
          strokeWidth: 3
        })
      );
    },
    flyCompleteHandle(item) {
      this.addeRsettlementLayer(item, 2, true);
    },
    monitorResultHandle() {
      this.isShowProjectInfo = this.isShowSchedule = false;
      this.isShowResultCompare = true;
      if (this.currentProject) {
        this.tableData = this.currentProject.result;
      }
    },
    addSolidCanage() {
      var slider = document.getElementById("slider");
      var handler = new Cesium.ScreenSpaceEventHandler(slider);
      handler.setInputAction(() => {
        this.moveActive = true;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      handler.setInputAction(this.move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(() => {
        this.moveActive = false;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    },
    addLister() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction(movement => {
        const obj = this.viewer.scene.pick(movement.position);
        if (Cesium.defined(obj) && obj.id instanceof Cesium.Entity) {
          const model = obj.id;
          //出发行政区划
          console.log('addLister',model.name)
          Bus.$emit("click-layer-tree", model.name);
          Bus.$emit("zone-click-event", model.name);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    },
    zoneLocation(zoneName) {
      for (let i = 0; i < this.zoneObject.length; i++) {
        if (this.zoneObject[i].name === zoneName) {
          this.currentZoneObject = this.zoneObject[i];
          break;
        }
      }
      if (this.currentZoneObject) {
        this.clearZoneBoundary();
        this.addZoneBoundary(this.currentZoneObject);
      }
    },
    removeEntity2() {
      this.entitiesList2.forEach(item2 => {
        this.viewer.entities.remove(item2);
      });
      this.entitiesList2 = [];
    },
    projectLocation(projectName) {
      for (let i = 0; i < this.projectDetail.length; i++) {
        if (this.projectDetail[i].name === projectName) {
          this.currentProject = this.projectDetail[i];
          break;
        }
      }
      if (this.currentProject) {
        //复位左右滑动轴
        let slider = document.getElementById("slider");
        slider.style.left = "50%";

        this.showProjectInfoHandle(true);
        let position = this.currentProject.centerPosition;
        this.flyTo(position.lon, position.lat, position.height);
      }
    },
    showScheduleHandle(bool) {
      this.isShowSchedule = bool;
    },
    showProjectInfoHandle(bool) {
      this.isShowProjectInfo = bool;
    },
    //清除影像
    clearLayers() {
      if (!this.currentLayer) {
        return;
      }
      this.showImageIcon = false;
      this.viewer.imageryLayers.remove(this.currentLayer, true);
      this.currentLayer = null;
      if (!this.currentLayer1) {
        return;
      }
      this.viewer.imageryLayers.remove(this.currentLayer1, true);
      this.currentLayer1 = null;
      //this.viewer.scene.postRender.removeEventListener(this.cesiumImgEvent);
    },
    init() {
      this.viewer = new Cesium.Viewer("earth", {
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        shouldAnimate: true,
        timeline: false,
        contextOptions: {
          webgl: {
            preserveDrawingBuffer: true
          }
        }
      });
      this.viewer.cesiumWidget.creditContainer.style.display = "none";
      this.addImageLayer();
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(108.8, 35.5, 22000000)
      });
      /**this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(108.8, 35.5, 22000000),
        duration: 3.0
      });*/
    },
    addImageLayer() {
      const imageLayer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: layer
          //tilingScheme: new Cesium.GeographicTilingScheme()
        })
      );
      /** const imageLayer = new Cesium.ImageryLayer(
            new Cesium.createTileMapServiceImageryProvider({
            url: layer,
            format: "image/jpeg"
            })
        );*/
      this.viewer.imageryLayers.removeAll();
      console.log('imgLayer',imageLayer)
      this.viewer.imageryLayers.add(imageLayer, 0);
    },
    //添加道路
    addRoadBoundary(fileName) {
      this.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(`static/data/${fileName}.json`, {
          stroke: Cesium.Color.WHITE,
          fill: Cesium.Color.fromCssColorString("#3d88c6").withAlpha(0.8),
          strokeWidth: 3
        })
      );
    },
    //加载 行政边界并定位
    addZoneBoundary(obj, isFly = true) {
      /**this.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(
          `static/data/boundary/${obj.zoneName}.json`,
          {
            stroke: Cesium.Color.WHITE,
            fill: Cesium.Color.fromCssColorString("#3d88c6").withAlpha(0.8),
            strokeWidth: 3
          }
        )
      );**/
      let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(
        `static/data/boundary/${obj.zoneName}.json`,
        {
          stroke: Cesium.Color.WHITE,
          fill: Cesium.Color.fromCssColorString("#3d88c6").withAlpha(0.8),
          strokeWidth: 3
        }
      );
      neighborhoodsPromise.then(dataSource => {
        this.viewer.dataSources.add(dataSource);
        let neighborhoods = dataSource.entities;
        let neighborhoodsEntities = dataSource.entities.values;
        let labels = {};
        for (var i = 0; i < neighborhoodsEntities.length; i++) {
          var entity = neighborhoodsEntities[i];
          if (Cesium.defined(entity.polygon)) {
            //entity.name = entity.properties.name.getValue();
            let name = entity.properties.name.getValue();
            if (labels[name]) {
              continue;
            } else {
              labels[name] = name;
            }
            if (
              name === "广西壮族自治区" ||
              name === "右江区" ||
              name === "都安瑶族自治县" ||
              name === "金秀瑶族自治县"
            ) {
              entity.polygon.material = Cesium.Color.fromCssColorString(
                "#ff3300"
              ).withAlpha(0.7);
            }
            var polyPositions = entity.polygon.hierarchy.getValue(
              Cesium.JulianDate.now()
            ).positions;
            var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions)
              .center;
            polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(
              polyCenter
            );
            entity.position = polyCenter;

            entity.label = {
              //创建一个标签，在中心点位置
              text: name,
              color: Cesium.Color.fromCssColorString("#fff"),
              font: "normal 26px MicroSoft YaHei",
              showBackground: true,
              scale: 0.5,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT_CLICK,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                10.0,
                10000000.0
              ),
              disableDepthTestDistance: 10000000.0
            };
          }
        }
      });
      if (isFly) this.flyTo(obj.lon, obj.lat, obj.height);
      //this.viewer.flyTo(dataSource);
    },
    //清除行政区划
    clearZoneBoundary() {
      this.viewer.dataSources.removeAll();
    },
    flyTo(lon, lat, height) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        duration: 3.0
      });
    },
    monitorClickHandle() {
      //弹出监控时间
      Bus.$emit("project-time-course", this.currentProject.name);
      this.showProjectInfoHandle(false);
      this.showScheduleHandle(true);
      //清除行政区划边界
      this.clearZoneBoundary();
    },
    //添加影像
    addImageLayers(data, level) {
      const matrixIds = new Array();
      // this.extent = {
      //   west: data.extent.minx,
      //   south: data.extent.miny,
      //   east: data.extent.maxx,
      //   nonth: data.extent.maxy
      // };
      this.currentLayer1 = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: data.wms,
          layers: data.meta.id,
          parameters: {
            transparent: "true",
            format: "image/png"
          }
          // layer: data.layer,
          // style: "",
          // format: data.format,
          // tileMatrixSetID: data.srs,
          // tileMatrixLabels: data.matrixIds,
          // maximumLevel: data.zoomStop,
          // minimumLevel: data.zoomStart,
          // tilingScheme: new Cesium.GeographicTilingScheme(),
          // rectangle: Cesium.Rectangle.fromDegrees(
          //   this.extent.west,
          //   this.extent.south,
          //   this.extent.east,
          //   this.extent.nonth
          // )
        })
      );
      this.viewer.imageryLayers.add(this.currentLayer1, level);
    },
    addeRsettlementLayer(data, level, bool) {
      this.isShowTimeLine = true;
      const matrixIds = new Array();
      this.extent = {
        west: data.meta.minX,
        south: data.meta.minY,
        east: data.meta.maxX,
        nonth: data.meta.maxY
      };
      this.currentLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: data.wms,
          layers: data.meta.id,
          parameters: {
            transparent: "true",
            format: "image/png"
          }
          // layer: data.mate.id,
          // style: "",
          // format: data.format,
          // tileMatrixSetID: data.srs,
          // tileMatrixLabels: data.matrixIds,
          // maximumLevel: data.zoomStop,
          // minimumLevel: data.zoomStart,
          // tilingScheme: new Cesium.GeographicTilingScheme(),
          // rectangle: Cesium.Rectangle.fromDegrees(
          //   this.extent.west,
          //   this.extent.south,
          //   this.extent.east,
          //   this.extent.nonth
          // )
        })
      );
      this.viewer.imageryLayers.add(this.currentLayer, level);
      if (bool) {
        /**this.currentLayer.minificationFilter =
          Cesium.TextureMinificationFilter.NEAREST;
        this.currentLayer.magnificationFilter =
          Cesium.TextureMagnificationFilter.NEAREST;*/
        this.currentLayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        // this.showImageIcon = true;
        // this.currentPoint = this.WGS84_to_Cartesian3([
        //   this.extent.west,
        //   (this.extent.south + this.extent.nonth) / 2
        // ]);
        // this.viewer.scene.postRender.addEventListener(this.cesiumImgEvent);

        let slider = document.getElementById("slider");
        //slider.style.left = "10px";
        this.viewer.scene.imagerySplitPosition =
          slider.offsetLeft / slider.parentElement.offsetWidth
            ? slider.offsetLeft / slider.parentElement.offsetWidth
            : 0.5;
        this.moveActive = false;
      }
    },
    move(movement) {
      if (!this.moveActive) {
        return;
      }
      let slider = document.getElementById("slider");
      var relativeOffset = movement.endPosition.x;
      var splitPosition =
        (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
      slider.style.left = 100.0 * splitPosition + "%";
      viewer.scene.imagerySplitPosition = splitPosition;
    },
    addPoint(cartesian) {
      const point = this.viewer.entities.add({
        position: cartesian,
        point: {
          color: Cesium.Color.fromCssColorString("#ff0000"),
          pixelSize: 10,
          heightReference: Cesium.HeightReference.clampToGround
        }
      });
      this.entitiesList2.push(point);
    },
    cesiumImgEvent() {
      const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        this.currentPoint
      );
      const point = this.Cartesian3_to_WGS84(this.currentPoint);
      if (point.lng < this.extent.west) {
        this.currentPoint = this.WGS84_to_Cartesian3([
          this.extent.west,
          (this.extent.south + this.extent.nonth) / 2
        ]);
        return;
      }
      if (point.lng > this.extent.east) {
        this.currentPoint = this.WGS84_to_Cartesian3([
          this.extent.east,
          (this.extent.south + this.extent.nonth) / 2
        ]);
        return;
      }
      this.imgPosition.top = picks.y - 5 + "px";
      this.imgPosition.left = picks.x - 13 + "px";
      const slider = document.getElementById("imgIcon");
      this.viewer.scene.imagerySplitPosition =
        picks.x / slider.parentElement.offsetWidth;
    },
    panelShow(points) {
      this.showPanel = true;
      this.currentPoint = points[0];
      this.viewer.scene.postRender.addEventListener(this.cesiumMoveEvent);
      Bus.$emit("panel-positions", points);
    },
    removeCesiumMove() {
      this.viewer.scene.postRender.removeEventListener(this.cesiumMoveEvent);
    },
    cesiumMoveEvent() {
      const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        this.currentPoint
      );
      this.createPanel.top = picks.y - 245 + "px";
      this.createPanel.left = picks.x - 170 + "px";
    },
    drapImg(evt) {
      if (evt.clientX > 0) {
        const picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this.viewer.scene,
          this.currentPoint
        );
        this.currentPoint = this.getCartesian({
          x: evt.clientX,
          y: picks.y
        });
      }
    },
    Cartesian3_to_WGS84(point) {
      var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var alt = cartographic.height;
      return { lat: lat, lng: lng, alt: alt };
    },
    /**
     * WGS84坐标转笛卡尔坐标系
     */
    WGS84_to_Cartesian3(point) {
      var ellipsoid = this.viewer.scene.globe.ellipsoid;

      var cartographic = Cesium.Cartographic.fromDegrees(point[0], point[1], 0);

      var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
      return cartesian3;
    },
    /**
     * 屏幕坐标转Cartesian3
     */
    getCartesian(position) {
      const ray = this.viewer.scene.camera.getPickRay(position);
      const point = this.viewer.scene.globe.pick(ray, this.viewer.scene);
      if (!point) {
        return;
      }
      const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        point
      );
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      return Cesium.Cartesian3.fromDegrees(lon, lat, height);
    }
  }
};

</script>
<style lang="scss" scoped>
#earth {
  #slider {
    position: absolute;
    left: 50%;
    top: 0px;
    background-color: #d3d3d3;
    width: 5px;
    height: 100%;
    z-index: 1999;
  }

  #slider:hover {
    cursor: ew-resize;
  }
  #imgIcon {
    position: absolute;
    z-index: 9999;
  }
  .project-detail {
    padding-bottom: 10px;
    position: absolute;
    top: 30px;
    right: 20px;
    width: 300px;
    height: auto;
    border: solid 1px white;
    background-color: #003251;
    opacity: 0.7;
    z-index: 10;
    color: white;
    border-radius: 1px;
    .detail-head {
      padding: 5px 15px 15px;
      .head-title {
        display: inline-block;
        width: 48%;
      }
      .monitor {
        display: inline-block;
        width: 48%;
        text-align: right;
        .monitor-btn {
          display: inline-block;
        }
      }
    }
    .detail-content {
      font-size: 14px;
      .content-item {
        display: flex;
        padding: 5px;
        .item-title {
          text-align: right;
          width: 100px;
        }
        .item-content {
          width: calc(100% - 100px);
          padding-left: 8px;
        }
      }
    }
  }
  .construction-instructions {
    position: absolute;
    top: 30px;
    left: 20px;
    width: 300px;
    height: auto;
    border: solid 1px white;
    background-color: #003251;
    opacity: 0.7;
    z-index: 10;
    color: white;
    border-radius: 1px;
    padding-bottom: 10px;
    .detail-head {
      padding: 15px;
      .head-title {
        display: inline-block;
        width: 48%;
      }
      .monitor {
        display: inline-block;
        width: 48%;
        text-align: right;
        .monitor-btn {
          display: inline-block;
        }
      }
    }
    .detail-content {
      font-size: 14px;
      .content-item {
        display: flex;
        padding: 2px;
        .item-title {
          text-align: right;
          width: 100px;
        }
        .item-content {
          width: calc(100% - 100px);
          padding-left: 8px;
        }
      }
    }
  }
  .monitor-result-compare {
    width: 60%;
    position: absolute;
    top: 5%;
    left: 20%;
    padding: 5px 15px 15px;
    background-color: #003459;
    opacity: 0.7;
    z-index: 2001;
    table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid white;
      th {
        padding: 10px;
        text-align: center;
        border: 1px solid white;
        font-size: 18px;
      }
      td {
        border: 1px solid white;
        padding: 10px;
        font-size: 16px;
      }
    }
  }
  .monitor-result-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 5px;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    background-color: #003459;
    z-index: 200;
    font-size: 14px;
  }
}
</style>
<style lang="scss"></style>
