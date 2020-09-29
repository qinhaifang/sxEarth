<template>
  <div>
    <div class="statistic">
      <div class="statistic-content">
        <div class="statisticHead" v-if="!showParameter">
          <i class="cube"></i>
          <span class="statisticName_R">{{currentTab}}</span>
        </div>
        <div v-if="!showParameter">
          <el-tabs type="border-card" @tab-click="tabChange">
            <el-tab-pane v-for="(tabItem, index) in tabList" :key="index">
              <span slot="label" :class="{'is-active': tabItem === currentTab}">
                <el-tooltip class="item" effect="dark" :content="tabItem" placement="bottom">
                  <i :class="('icon'+tabIcon[tabItem])"></i>
                </el-tooltip>
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="tab-inner-content">
            <!-- <el-switch
              v-if="showSwitch"
              size="mini"
              v-model="pointType"
              active-text="倾斜摄影"
              @change="pointTypeChange"
              inactive-text="DEM"
            ></el-switch> -->
            <div v-if="parameterObj[currentTab]" class="parameter">
              <div class="titleClass">{{parameterObj[currentTab].title}}</div>
              <el-form ref="form" :model="form" :rules="rules">
                <el-form-item
                  v-for="(formItem, index) in parameterObj[currentTab].form"
                  :key="index"
                  :prop="formItem.key"
                  :label="formItem.label"
                >
                  <el-input
                    size="mini"
                    v-model="form[formItem.key]"
                    :max="formItem.max"
                    :min="formItem.min"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="tuli" v-if="!showParameter && showTuLi && tuliMessage[currentTab]">
              <div
                class="tuli-title"
                v-if="!tuliMessage[currentTab].titleFlag"
              >{{tuliMessage[currentTab].title}}</div>
              <div class="content">
                <div
                  class="tuli-content"
                  v-for="(tuliItem, index) in tuliMessage[currentTab].content"
                  v-if="!tuliMessage[currentTab].titleFlag"
                  :key="index"
                >
                  <span :class="tuliItem.titleClass">{{tuliItem.title}}</span>
                  <span :class="tuliItem.valueClass">{{tuliItem.value}}</span>
                </div>
              </div>
            </div>
            <div class="wtfClass" v-if="['挖填方'].includes(currentTab) && tuliMessage[currentTab]">
              <div
                class="tuli-content"
                v-for="(tuliItem, index) in tuliMessage[currentTab].content"
                :key="index"
              >
                <span :class="tuliItem.titleClass">{{tuliItem.title}}</span>
                <span class="valClass">{{tuliItem.value}}</span>
              </div>
            </div>
            <div class="pdClass" v-if="['坡度坡向'].includes(currentTab) && tuliMessage[currentTab]">
              <div
                class="tuli-content"
                v-for="(tuliItem, index) in tuliMessage[currentTab].content"
                :key="index"
              >
                <span :class="tuliItem.titleClass">{{tuliItem.title}}</span>
                <span :class="tuliItem.valueClass">{{tuliItem.value}}</span>
              </div>
            </div>
            <div v-if="['距离量测','面积量测','叠置分析','地貌分析'].includes(currentTab)" class="radios">
              <el-radio-group v-model="radioModel" size="mini">
                <el-radio
                  v-for="(item,index) in radioContent[currentTab]"
                  :key="index"
                  :label="item.label"
                >{{item.name}}</el-radio>
              </el-radio-group>
              <div v-if="['距离量测','面积量测'].includes(currentTab)">
                <p>
                  <span v-if="'距离量测'=== currentTab">总距离：</span>
                  <span v-if="'面积量测'===currentTab">总面积：</span>
                  <span class="value-content">
                    <textarea v-if="Object.keys(responseObj).length > 0" id="disVal" readonly>{{(responseObj.l||responseObj.dis||responseObj.area).toFixed(2)}}</textarea>
                  </span>
                  <span>{{responseObj.msg}}</span>
                </p>
                <i class="twoPointIcon" @click="copyCalcVal"></i>
                <p class="copySuccessCls" v-if="copySuccess">复制成功</p>
              </div>
            </div>
            <div v-if="['叠置分析'].includes(currentTab)" class="layers">
              <div class="layer-title">
                <i class="el-icon-menu"></i>
                <span slot="label">选择加载图层</span>
              </div>
              <el-tree
                :data="shpData"
                show-checkbox
                node-key="name"
                :props="defaultProps"
                ref="tree2"
                @check-change="shpTreeClick"
              ></el-tree>
            </div>
            <div v-if="['两点方位角','方位角量测'].includes(currentTab)" class="twoPoint">
              <p>
                <span v-if="'两点方位角'===currentTab">{{currentTab}}：</span>
                <span v-if="'方位角量测'===currentTab">方位角：</span>
                <span class="value-content">
                  <textarea v-if="Object.keys(responseObj).length > 0" id="disVal" readonly>{{responseObj.angle.toFixed(2)}}</textarea>
                </span>
                <span>{{responseObj.msg}}</span>
              </p>
              <i class="twoPointIcon"></i>
            </div>
          </div>
          <div class="analysis-tool">
            <el-button
              v-if="showButton.point"
              class="drawPoint"
              title="画点"
              :class="{'button-background': currentButton.point}"
              size="mini"
              @click="drawPoint"
            >
              <i class="drawIcon"></i>画 点
            </el-button>
            <el-button
              v-if="showButton.line"
              class="drawLine"
              :class="{'button-background': currentButton.line}"
              title="画线"
              size="mini"
              @click="drawLine"
            >
              <i class="drawIcon"></i>画 线
            </el-button>
            <el-button
              v-if="showButton.poly"
              class="drawPoly"
              :class="{'button-background': currentButton.poly}"
              title="画面"
              size="mini"
              @click="drawPoly"
            >
              <i class="drawIcon"></i>画 面
            </el-button>
            <el-button
              v-if="showButton.rect"
              class="drawRect"
              :class="{'button-background': currentButton.rect}"
              title="绘制矩形"
              size="mini"
              @click="drawRect"
            >
              <i class="drawIcon"></i>矩 形
            </el-button>
            <el-button
              v-if="showButton.circle"
              class="drawCircle"
              id="circleBtn"
              :class="{'button-background': currentButton.circle}"
              title="画圆"
              size="mini"
              @click="drawCircle"
            >
              <i class="drawIcon"></i>画 圆
            </el-button>
            <el-button class="drawClear" title="清除" size="mini" @click="clearHandle">
              <i class="deleteIcon"></i>清 除
            </el-button>
          </div>
        </div>
      </div>
      <div v-show="showPouMian" class="poumian">
        <div class="poumianHead">
          <span class="poumianName">剖面分析结果</span>
          <i class="el-icon-close deleteIcon2" @click="clearEcharts"></i>
        </div>
        <div id="echartsDiv"></div>
        <div class="message">
          <el-row>
            <el-col
              v-for="(poumianItem, index) in pouMianData[currentTab]"
              :key="index"
              :span="12"
            >{{poumianItem.name}}{{poumianMessage[poumianItem.key]}}</el-col>
          </el-row>
        </div>
        <div>
          <!-- <el-button @click="clearEcharts" type="primary" size="mini">关闭</el-button> -->
        </div>
      </div>
    </div>
    <div
      class="statistic-tool-tip"
      v-if="showTip"
      :style="{top:tipMessage.top,left:tipMessage.left}"
    >
      <div class="close-icon" @click="showTip = false">×</div>
      <div class="tip-content">
        当前高程为：
        <span>{{tipMessage.height}}</span>
      </div>
      <div class="tip-content">
        当前坡度为：
        <span>{{tipMessage.slope}}</span>
      </div>
      <div class="tip-content">
        当前坡向为：
        <span>{{tipMessage.aspect}}</span>
      </div>
      <div class="down-arrow"></div>
    </div>
  </div>
</template>

<script>
import {
  pointToPointView,
  hideVeilService,
  ShortestPathService,
  visibility2,
  section,
  buffer,
  heightAreaService,
  slope,
  singlept,
  distance,
  grounddistance,
  neargrounddistance,
  projectDisdistance,
  spaArea,
  area,
  groundArea,
  projArea,
  RouterService,
  headFlood,
  azimuthService,
  azimuthDistanceService,
  contour,
  shadowService,
  watchHouse,
  directAim,
  indirectAim,
  kjcxz,
  nuclearProtection,
  overlay,
  getvectornames,
  getmountainTop,
  getsaddlepoint,
  getbottomline,
  getvalleyline,
  getridgeline,
  getterrainType
} from "../api/statistic";

import cesiumCommon from "./js/cesiumCommon";
import viewerAfter from "./js/viewerAfter";
let _this;
const geoserverurl = window.UrlSetting.GEOSERVER_URL;
export default {
  name: "Content",
  data() {
    return {
      currentButton: {},
      currentClick: null,
      currentTab: "点点通视",
      tabIcon: {
        点点通视: 0,
        遮蔽分析: 1,
        路径分析: 2,
        叠置分析: 3,
        点面通视: 4,
        剖面: 5,
        距离量测: 6,
        面积量测: 7,
        缓冲区: 8,
        淹没: 9,
        挖填方: 10,
        坡度坡向: 11,
        点高程坡度坡向: 12,
        两点方位角: 13,
        点预测: 14,
        高程统计: 15,
        等高线提取: 16,
        阴影分析: 17,
        观察所分析: 18,
        直瞄分析: 19,
        间瞄分析: 20,
        空降场选址分析: 21,
        核防护分析: 22,
        道路机动: 23,
        方位角量测: 24,
        地貌分析: 25
      },
      tabList: [
        "点点通视",
        // "遮蔽分析",
        "路径分析",
        // '空间查询',
        // "叠置分析",
        "点面通视",
        "剖面",
        // "距离量测",
        // "面积量测",
        "缓冲区",
        "淹没",
        "挖填方",
        "坡度坡向",
        // "点高程坡度坡向",
        "两点方位角",
        // "点预测",
        // "高程统计",
        "等高线提取",
        // "阴影分析",
        // "观察所分析",
        // "直瞄分析",
        // "间瞄分析",
        // "空降场选址分析",
        // "核防护分析",
        // "道路机动",
        // "方位角量测",
        // "地貌分析"
      ],
      form: {},
      rules: {
        radius: [{ required: true, message: "请输入距离", trigger: "blur" }],
        startAngle: [
          { required: true, message: "请输入开始角度", trigger: "blur" }
        ],
        endAngle: [
          { required: true, message: "请输入结束角度", trigger: "blur" }
        ],
        dis: [{ required: true, message: "请输入距离", trigger: "blur" }],
        height: [
          { required: true, message: "请输入雷达高度", trigger: "blur" }
        ],
        veilAngle: [
          { required: true, message: "请输入最大遮蔽角", trigger: "blur" }
        ],
        length: [
          { required: true, message: "请输入缓冲区距离", trigger: "blur" }
        ],
        floodLevel: [
          { required: true, message: "请输入高程", trigger: "blur" }
        ],
        wafangLevel: [
          { required: true, message: "请输入高程", trigger: "blur" }
        ],
        azimuth: [{ required: true, message: "请输入角度", trigger: "blur" }],
        sunHeightAngle: [
          { required: true, message: "请输入太阳高度角", trigger: "blur" }
        ],
        sunIncidenceAngle: [
          { required: true, message: "请输入太阳入射角", trigger: "blur" }
        ],
        chooseNum: [{ required: true, message: "请输入数量", trigger: "blur" }],
        areaminit: [
          { required: true, message: "请输入最小面积", trigger: "blur" }
        ],
        slopeMax: [
          { required: true, message: "请输入最大坡度", trigger: "blur" }
        ],
        dlsValue: [
          { required: true, message: "请输入核当量", trigger: "blur" }
        ],
        hbgdValue: [
          { required: true, message: "请输入爆炸高度", trigger: "blur" }
        ],
        pDegree: [
          { required: true, message: "请输入程度等级", trigger: "blur" }
        ],
        policy: [{ required: true, message: "请输入策略", trigger: "blur" }]
      },
      parameterObj: {
        点面通视: {
          title: "点面分析参数设置",
          form: [
            {
              label: "距离(米)",
              key: "radius",
              max: 10000,
              value: 0,
              min: 0
            },
            {
              label: "开始角度",
              key: "startAngle",
              max: 360,
              value: 0,
              min: 0
            },
            {
              label: "结束角度",
              key: "endAngle",
              max: 360,
              value: 360,
              min: 0
            }
          ]
        },
        遮蔽分析: {
          title: "遮蔽分析参数设置",
          form: [
            {
              label: "距离(米)",
              key: "dis",
              max: 10000,
              value: 1000,
              min: 0
            },
            {
              label: "雷达高度",
              key: "height",
              max: 1000,
              value: 10,
              min: 0
            },
            {
              label: "最大遮蔽角",
              key: "veilAngle",
              max: 360,
              value: 30,
              min: 0
            }
          ]
        },
        缓冲区: {
          title: "缓冲区分析参数设置",
          form: [
            {
              label: "缓冲区距离（米）",
              key: "length",
              max: 1000000000,
              value: 1,
              min: 0
            }
          ]
        },
        淹没: {
          title: "淹没分析参数设置",
          form: [
            {
              label: "高程（米）",
              key: "floodLevel",
              max: 1000000000,
              value: 0,
              min: 0
            }
          ]
        },
        挖填方: {
          title: "挖填方分析参数设置",
          form: [
            {
              label: "高程（米）",
              key: "wafangLevel",
              max: 1000000000,
              value: 0,
              min: 0
            }
          ]
        },
        点预测: {
          title: "点预测参数设置",
          form: [
            {
              label: "距离（米）",
              key: "dis",
              max: 1000000000,
              value: 0,
              min: 0
            },
            {
              label: "角度（°）",
              key: "azimuth",
              max: 360,
              value: 0,
              min: 0
            }
          ]
        },
        阴影分析: {
          title: "阴影分析参数设置",
          form: [
            {
              label: "太阳高度角（°）",
              key: "sunHeightAngle",
              max: 360,
              value: 0,
              min: 0
            },
            {
              label: "太阳入射角（°）",
              key: "sunIncidenceAngle",
              max: 360,
              value: 0,
              min: 0
            }
          ]
        },
        观察所分析: {
          title: "观察所分析参数设置",
          form: [
            {
              label: "数量（个）",
              key: "chooseNum",
              max: 10000,
              value: 0,
              min: 0
            }
          ]
        },
        直瞄分析: {
          title: "直瞄分析参数设置",
          form: [
            {
              label: "角度（°）",
              key: "angle",
              max: 360,
              value: 0,
              min: 0
            }
          ]
        },
        空降场选址分析: {
          title: "空降场选址分析参数设置",
          form: [
            {
              label: "最小面积（平方公里）",
              key: "areaminit",
              max: 100000,
              value: 0,
              min: 0
            },
            {
              label: "最大坡度",
              key: "slopeMax",
              max: 360,
              value: 0,
              min: 0
            }
          ]
        },
        核防护分析: {
          title: "核防护分析参数设置",
          form: [
            {
              label: "核当量",
              key: "dlsValue",
              max: 100000,
              value: 0,
              min: 0
            },
            {
              label: "爆炸高度",
              key: "hbgdValue",
              max: 1000000,
              value: 0,
              min: 0
            },
            {
              label: "程度等级",
              key: "pDegree",
              max: 3,
              value: 0,
              min: 0
            }
          ]
        },
        道路机动: {
          title: "道路机动参数设置",
          form: [
            {
              label: "策略",
              key: "policy",
              max: 3,
              value: 0,
              min: 0
            }
          ]
        }
      },
      tuliMessage: {
        挖填方: {
          title: "挖填方分析图例",
          titleFlag: true,
          content: [
            {
              key: "wafangVbm",
              title: "挖方区域",
              value: "   "
            },
            {
              key: "tianfangVbm",
              title: "填方区域",
              value: "   "
            }
          ]
        },
        点点通视: {
          title: "点点通视分析图例",
          content: [
            {
              value: "不通视",
              titleClass: "legend-img color9"
            },
            {
              value: "通视",
              titleClass: "legend-img color1"
            }
          ]
        },
        点面通视: {
          title: "点面通视分析图例",
          content: [
            {
              value: "不通视",
              titleClass: "legend-img color9"
            },
            {
              value: "通视",
              titleClass: "legend-img color1"
            }
          ]
        },
        缓冲区: {
          title: "缓冲区分析图例",
          content: [
            {
              value: "缓冲区域",
              titleClass: "legend-img color1"
            }
          ]
        },
        淹没: {
          title: "淹没分析图例",
          content: [
            {
              value: "淹没",
              titleClass: "legend-img color9"
            },
            {
              value: "未淹没",
              titleClass: "legend-img color1"
            }
          ]
        },
        坡度坡向: {
          title: "坡度方分析图例",
          titleFlag: true,
          content: [
            {
              key: "color1",
              value: "≤30°",
              titleClass: "legend-img color11"
            },
            {
              key: "color2",
              value: "30°-45°",
              titleClass: "legend-img color12"
            },
            {
              key: "color3",
              value: "45°-55°",
              titleClass: "legend-img color13"
            },
            {
              key: "color4",
              value: "55°-65°",
              titleClass: "legend-img color14"
            },
            {
              key: "color5",
              value: "65°-70°",
              titleClass: "legend-img color15"
            },
            {
              key: "color6",
              value: "70°-75°",
              titleClass: "legend-img color16"
            },
            {
              key: "color7",
              value: "75°-80°",
              titleClass: "legend-img color17"
            },
            {
              key: "color8",
              value: "80°-85°",
              titleClass: "legend-img color18"
            },
            {
              key: "color9",
              value: "≥85°",
              titleClass: "legend-img color19"
            }
          ]
        },
        遮蔽分析: {
          title: "遮蔽分析图例",
          content: [
            {
              key: "ratio",
              title: "遮蔽度：",
              value: "0"
            },
            {
              value: "遮蔽",
              titleClass: "legend-img color9"
            },
            {
              value: "未遮蔽",
              titleClass: "legend-img color1"
            }
          ]
        },
        直瞄分析: {
          title: "直瞄分析图例",
          content: [
            {
              value: "射程外",
              titleClass: "legend-img color9"
            },
            {
              value: "不通视",
              titleClass: "legend-img color7"
            },
            {
              value: "通视，不可打击",
              titleClass: "legend-img color4"
            },
            {
              value: "可打击",
              titleClass: "legend-img color1"
            }
          ]
        },
        间瞄分析: {
          title: "间瞄分析图例",
          content: [
            {
              value: "不可打击",
              titleClass: "legend-img color9"
            },
            {
              value: "可打击",
              titleClass: "legend-img color1"
            }
          ]
        }
      },
      poumianMessage: {},
      pouMianData: {
        剖面: [
          {
            name: "起点经度:",
            key: "startPointLng"
          },
          {
            name: "起点纬度:",
            key: "startPointLat"
          },
          {
            name: "终点经度:",
            key: "endPointLng"
          },
          {
            name: "终点纬度:",
            key: "endPointLat"
          },
          {
            name: "最大高程:",
            key: "maxHeight"
          },
          {
            name: "最小高程:",
            key: "minHeight"
          }
        ],
        高程统计: [
          {
            name: "最小经度:",
            key: "startPointLng"
          },
          {
            name: "最小纬度:",
            key: "startPointLat"
          },
          {
            name: "最大经度:",
            key: "endPointLng"
          },
          {
            name: "最大纬度:",
            key: "endPointLat"
          },
          {
            name: "最大高程:",
            key: "maxHeight"
          },
          {
            name: "最小高程:",
            key: "minHeight"
          },
          {
            name: "平均高程:",
            key: "averageH"
          }
        ]
      },
      currentAxios: null,
      positions: [],
      showParameter: false,
      showPouMian: false,
      showTuLi: true,
      showSwitch: true,
      pointType: false,
      showTip: false,
      tipMessage: {
        top: null,
        left: null,
        height: 0,
        slope: 0,
        aspect: 0
      },
      showButton: {
        point: true
      },
      radioModel: 1,
      radioContent: {
        距离量测: [
          { label: 1, name: "空间距离" },
          { label: 2, name: "球面距离" },
          { label: 3, name: "贴地距离" },
          { label: 4, name: "投影距离" },
          { label: 5, name: "沿线距离" }
        ],
        面积量测: [
          { label: 1, name: "空间面积" },
          { label: 2, name: "球面面积" },
          { label: 3, name: "贴地面积" },
          { label: 4, name: "投影面积" }
        ],
        叠置分析: [
          { label: 1, name: "交叉分析" },
          { label: 2, name: "联合分析" },
          { label: 3, name: "差异分析" }
        ],
        地貌分析: [
          { label: 1, name: "山顶点" },
          { label: 2, name: "鞍部点" },
          { label: 3, name: "山脚线" },
          { label: 4, name: "山谷线" },
          { label: 5, name: "山脊线" },
          { label: 6, name: "地貌类型" }
        ]
      },
      distanceAxios: {
        1: distance,
        2: grounddistance,
        3: neargrounddistance,
        4: projectDisdistance,
        5: distance
      },
      areaAxios: {
        1: spaArea,
        2: area,
        3: groundArea,
        4: projArea
      },
      morphologicAnalysisAxios: {
        1: getmountainTop,
        2: getsaddlepoint,
        3: getbottomline,
        4: getvalleyline,
        5: getridgeline,
        6: getterrainType
      },
      hasStep1: false,
      step1Point: [],
      commonDataCopy: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
      shpData: [],
      shpLayer: {},
      responseObj: {},
      copySuccess: false
    };
  },
  mounted() {
    _this = this;
    Bus.$on("cs-add-point", (point, text) => {
      const cartesian = _this.WGS84_to_Cartesian3(point);
      _this.positions.push(cartesian);
      _this.pointItem(cartesian, Cesium.Color.WHITE, text);
    });
    Bus.$on("cs-add-line", (point, count, bool) => {
      if (bool) {
        _this.lineItem(_this.positions, Cesium.Color.CORNFLOWERBLUE, 3);
      }
      if (count === 1) {
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      } else if (count === 2) {
        _this.positions.pop();
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      } else {
        _this.positions.pop();
      }
    });
    Bus.$on("cs-add-poly", (point, count, bool) => {
      if (bool) {
        _this.polyItem(_this.positions, Cesium.Color.GREEN.withAlpha(0.5));
      }
      if (count === 1) {
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      } else if (count === 2) {
        _this.positions.pop();
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      }
    });
    Bus.$on("cs-add-rect", (point, count, bool) => {
      if (bool) {
        _this.rectItem(_this.positions, Cesium.Color.GREEN.withAlpha(0.5));
      }
      if (count === 1) {
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      } else if (count === 2) {
        _this.positions.pop();
        _this.positions.push(_this.WGS84_to_Cartesian3(point));
      } else {
        _this.positions.pop();
      }
    });
    Bus.$on("start-fen-xi", () => {
      _this.fenXi();
    });
    Bus.$on("open-parameter", () => {
      // _this.showParameter = true;
      _this.fenXi();
    });
    // const container = document.getElementsByClassName('statistic-content')[0];
    // common.moveDiv(container);
    Bus.$on("changeButton", value => {
      _this.currentButton = value;
    });
    Bus.$on("changeParameterShow", value => {
      // _this.showParameter = value;
      _this.fenXi();
    });
    Bus.$on("clearAll", () => {
      _this.clearHandle();
    });
    Bus.$on("drawRect", value => {
      _this.step1Point = value;
      _this.drawRect();
      _this.hasStep1 = false;
    });
    Bus.$on("drawPoly", value => {
      _this.step1Point = value;
      _this.drawPoly();
      _this.hasStep1 = false;
    });
    _this.commonDataCopy = _this.commonData;
  },
  methods: {
    /**
     * 画点事件
     */
    drawPoint() {
      for (let item in _this.form) {
        if (_this.form[item] === "") {
          _this.$refs.form.validateField(item);
          return false;
        }
      }
      _this.clearHandle();
      _this.currentClick = "Point";
      _this.currentButton = {
        point: true
      };
      Bus.$emit("changeCursor", "point");
      let params;
      switch (_this.currentTab) {
        case "点点通视":
          params = {
            count: 2,
            text: ["观察点", "目标点"]
          };
          break;
        case "路径分析":
          params = {
            count: 2,
            text: ["起点", "终点"]
          };
          break;
        case "点面通视":
          params = {
            count: 1,
            text: ["观察点"],
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
        case "缓冲区":
          params = {
            count: 1,
            text: [],
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
        case "道路机动":
          params = {
            count: 1000,
            text: ["起点", "必经点", "终点"],
            isNeedStep2: "drawRect"
          };
          break;
        case "遮蔽分析":
        case "点预测":
          params = {
            count: 1,
            text: [],
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
        case "点高程坡度坡向":
          params = {
            count: 1,
            text: []
          };
          break;
        case "两点方位角":
          params = {
            count: 2,
            text: []
          };
          break;
        case "方位角量测":
          params = {
            count: 2,
            text: [],
            measureFlag: true
          };
          break;
        case "直瞄分析":
        case "间瞄分析":
          params = {
            count: 1,
            text: ["射击点"],
            isNeedStep2: "drawPoly"
          };
          break;
        case "核防护分析":
          params = {
            count: 1,
            text: ["核爆点"],
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
      }
      _this.positions = [];
      cesiumCommon.buildPoint(params, _this.positions, _this.fenXi);
      Bus.$emit("ol-draw-point", params);
    },
    /**
     * 画线事件
     */
    drawLine() {
      _this.clearHandle();
      _this.currentClick = "LineString";
      _this.currentButton = {
        line: true
      };
      Bus.$emit("changeCursor", "line");
      let params;
      switch (_this.currentTab) {
        case "剖面":
          params = {
            count: 3
          };
          break;
        case "距离量测":
          params = {
            count: 3
          };
          break;
        case "缓冲区":
          params = {
            count: 100000,
            text: [],
            addParameter: true
          };
        // _this.initForm();//edit by niulei
      }
      _this.positions = [];
      cesiumCommon.buildLine(params, _this.positions, _this.fenXi);
      Bus.$emit("ol-draw-line", params);
    },
    /**
     * 画多边形事件
     */
    drawPoly() {
      let params;
      switch (_this.currentTab) {
        case "缓冲区":
        case "观察所分析":
        case "空降场选址分析":
          params = {
            count: 100000,
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
        case "直瞄分析":
          params = {
            count: 100000,
            addParameter: true
          };
          _this.hasStep1 = true;
          break;
        case "面积量测":
        case "地貌分析":
        case "高程统计":
        case "等高线提取":
          params = {
            count: 100000
          };
          break;
        case "间瞄分析":
          params = {
            count: 100000
          };
          _this.hasStep1 = true;
          break;
      }
      if (this.hasStep1 && _this.step1Point.length < 1) {
        _this.clearHandle();
        _this.$message({
          message: "请先做第一步操作",
          type: "warning"
        });
        return;
      }
      _this.currentClick = "Polygon";
      _this.currentButton = {
        poly: true
      };
      Bus.$emit("changeCursor", "poly");
      _this.positions = [];
      cesiumCommon.buildPoly(params, _this.positions, _this.fenXi);
      Bus.$emit("ol-draw-poly", params);
    },
    /**
     * 画矩形事件
     */
    drawRect() {
      let params;
      switch (_this.currentTab) {
        case "坡度坡向":
        case "面积量测":
        case "高程统计":
        case "等高线提取":
        case "叠置分析":
          params = {
            count: 3
          };
          break;
        case "挖填方":
        case "淹没":
        case "阴影分析":
          params = {
            count: 3,
            addParameter: true
          };
          // _this.initForm();//edit by niulei
          break;
        case "道路机动":
          params = {
            count: 3,
            addParameter: true
          };
          _this.hasStep1 = true;
          break;
      }
      if (this.hasStep1 && _this.step1Point.length < 1) {
        _this.clearHandle();
        _this.$message({
          message: "请先做第一步操作",
          type: "warning"
        });
        return;
      }
      _this.currentClick = "Polygon";
      _this.currentButton = {
        rect: true
      };
      Bus.$emit("changeCursor", "rect");
      _this.positions = [];
      cesiumCommon.buildRect(params, _this.positions, _this.fenXi);
      Bus.$emit("ol-draw-rect", params);
    },
    /**
     * 画圆事件
     */
    drawCircle() {
      _this.clearHandle();
      _this.currentClick = "Circle";
      _this.currentButton = {
        circle: true
      };
      Bus.$emit("changeCursor", "circle");
    },
    /**
     * 空间分析发送请求
     */
    fenXi() {
      let pointList = [];
      _this.positions.forEach(item => {
        pointList.push(cesiumCommon.Cartesian3_to_WGS84(item));
      });
      const loading = _this.$loading({
        lock: true,
        text: "正在计算中，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      _this.getAxios();
      const params = _this.buildParams(pointList);
      _this
        .currentAxios(params)
        .catch(function() {
          loading.close();
          _this.$message.error("服务请求失败！");
        })
        .then(resp => {
          loading.close();
          if (resp.data.isSuccess == 1) {
            switch (_this.currentTab) {
              case "点点通视":
                viewerAfter.pointToPointViewAfter(resp.data, pointList);
                break;
              case "遮蔽分析":
                viewerAfter.hideVeilServiceAfter(
                  resp.data,
                  _this.tuliMessage,
                  _this.currentTab,
                  params
                );
                break;
              case "路径分析":
                viewerAfter.ShortestPathServiceViewAfter(resp.data);
                break;
              case "点面通视":
                viewerAfter.visibility2ViewAfter(resp.data);
                break;
              case "剖面":
                _this.showPouMian = true;
                viewerAfter.sectionViewAfter(
                  resp.data,
                  pointList,
                  _this.poumianMessage
                );
                break;
              case "距离量测":
                _this.responseObj = resp.data;
                viewerAfter.distanceViewAfter(resp.data, _this.positions[0]);
                break;
              case "面积量测":
                _this.responseObj = resp.data;
                viewerAfter.areaViewAfter(resp.data, _this.positions[0]);
                break;
              case "缓冲区":
                if (_this.currentClick === "Polygon") {
                  _this.clearHandle();
                }
                viewerAfter.bufferViewAfter(resp.data);
                break;
              case "淹没":
                _this.clearHandle();
                viewerAfter.headFloodViewAfter(resp.data);
                break;
              case "挖填方":
                const maxH = resp.data.maxH === 0 ? 0.0001 : resp.data.maxH;
                _this.clearHandle();
                viewerAfter.wafangViewAfter(
                  maxH,
                  pointList,
                  params,
                  _this.form.wafangLevel,
                  _this.tuliMessage,
                  _this.currentTab
                );
                break;
              case "坡度坡向":
                _this.clearHandle();
                viewerAfter.slopeViewAfter(
                  resp.data,
                  _this.tuliMessage,
                  _this.currentTab
                );
                break;
              case "点高程坡度坡向":
                _this.showTip = true;
                viewerAfter.singleptViewAfter(
                  resp.data,
                  params,
                  _this.tipMessage,
                  _this.positions[0]
                );
                break;
              case "两点方位角":
                _this.responseObj = resp.data;
                viewerAfter.azimuthServiceViewAfter(resp.data, _this.positions);
                break;
              case "方位角量测":
                _this.responseObj = resp.data;
                viewerAfter.azimuthMeasureServiceViewAfter(
                  resp.data,
                  _this.positions
                );
                break;
              case "点预测":
                viewerAfter.azimuthDistanceServiceViewAfter(
                  resp.data,
                  _this.positions
                );
                break;
              case "高程统计":
                _this.showPouMian = true;
                viewerAfter.heightAreaServiceViewAfter(
                  resp.data,
                  pointList,
                  _this.poumianMessage
                );
                break;
              case "等高线提取":
                _this.clearHandle();
                viewerAfter.contourViewAfter(resp.data);
                break;
              case "阴影分析":
                _this.clearHandle();
                viewerAfter.shadowServiceViewAfter(resp.data);
                break;
              case "观察所分析":
                _this.clearHandle();
                viewerAfter.watchHouseViewAfter(resp.data, params.geometry);
                break;
              case "直瞄分析":
                viewerAfter.directAimViewAfter(resp.data);
                break;
              case "间瞄分析":
                viewerAfter.indirectAimViewAfter(resp.data);
                break;
              case "空降场选址分析":
                _this.clearHandle();
                viewerAfter.kjcxzViewAfter(resp.data);
                break;
              case "核防护分析":
                viewerAfter.nuclearProtectionViewAfter(resp.data);
                break;
              case "道路机动":
                viewerAfter.RouterServiceViewAfter(resp.data);
                break;
              case "叠置分析":
                _this.clearHandle();
                viewerAfter.overlayViewAfter(resp.data);
                break;
              case "地貌分析":
                if (_this.radioModel <= 5) {
                  _this.clearHandle();
                }
                viewerAfter.morphologicViewAfter(
                  resp.data,
                  _this.radioModel,
                  _this.positions[0]
                );
                break;
            }
          } else {
            _this.$message.error("服务请求失败！");
          }
        });
    },
    /**
     * 获取调用的接口
     */
    getAxios() {
      switch (_this.currentTab) {
        case "点点通视":
          _this.currentAxios = pointToPointView;
          break;
        case "遮蔽分析":
          _this.currentAxios = hideVeilService;
          break;
        case "路径分析":
          _this.currentAxios = ShortestPathService;
          break;
        case "点面通视":
          _this.currentAxios = visibility2;
          break;
        case "剖面":
          _this.currentAxios = section;
          break;
        case "距离量测":
          _this.currentAxios = _this.distanceAxios[_this.radioModel];
          break;
        case "面积量测":
          _this.currentAxios = _this.areaAxios[_this.radioModel];
          break;
        case "缓冲区":
          _this.currentAxios = buffer;
          break;
        case "淹没":
          _this.currentAxios = headFlood;
          break;
        case "挖填方":
          _this.currentAxios = heightAreaService;
          break;
        case "坡度坡向":
          _this.currentAxios = slope;
          break;
        case "点高程坡度坡向":
          _this.currentAxios = singlept;
          break;
        case "两点方位角":
          _this.currentAxios = azimuthService;
          break;
        case "方位角量测":
          _this.currentAxios = azimuthService;
          break;
        case "点预测":
          _this.currentAxios = azimuthDistanceService;
          break;
        case "高程统计":
          _this.currentAxios = heightAreaService;
          break;
        case "等高线提取":
          _this.currentAxios = contour;
          break;
        case "阴影分析":
          _this.currentAxios = shadowService;
          break;
        case "观察所分析":
          _this.currentAxios = watchHouse;
          break;
        case "直瞄分析":
          _this.currentAxios = directAim;
          break;
        case "间瞄分析":
          _this.currentAxios = indirectAim;
          break;
        case "空降场选址分析":
          _this.currentAxios = kjcxz;
          break;
        case "核防护分析":
          _this.currentAxios = nuclearProtection;
          break;
        case "道路机动":
          _this.currentAxios = RouterService;
          break;
        case "叠置分析":
          _this.currentAxios = overlay;
          break;
        case "地貌分析":
          _this.currentAxios = _this.morphologicAnalysisAxios[_this.radioModel];
          break;
      }
    },
    /**
     * 构建请求参数
     */
    buildParams(pointList) {
      let params;
      let coordinates = [];
      switch (_this.currentTab) {
        case "点点通视":
        case "剖面":
          return {
            "p1.x": pointList[0].lng,
            "p1.y": pointList[0].lat,
            "p1.z": 0,
            "p2.x": pointList[1].lng,
            "p2.y": pointList[1].lat,
            "p2.z": 0,
            demTileLevel: cesiumCommon.getZoom(),
            dataModel: _this.pointType ? 1 : 0
          };
        case "遮蔽分析":
          return {
            dis: _this.form.dis,
            height: _this.form.height,
            veilAngle: _this.form.veilAngle,
            lon: pointList[0].lng,
            lat: pointList[0].lat,
            demTileLevel: cesiumCommon.getZoom(),
            dataModel: _this.pointType ? 1 : 0
          };
        case "路径分析":
          return {
            "startPt.x": pointList[0].lng,
            "startPt.y": pointList[0].lat,
            "endPt.x": pointList[1].lng,
            "endPt.y": pointList[1].lat,
            demTileLevel: cesiumCommon.getZoom() - 2
          };
        case "点面通视":
          params = {
            x: pointList[0].lng,
            y: pointList[0].lat,
            demTileLevel: cesiumCommon.getZoom(),
            dataModel: _this.pointType ? 1 : 0
          };
          for (let key in _this.form) {
            params[key] = _this.form[key];
          }
          params.radius = params.radius / 1000;
          return params;
        case "缓冲区":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          if (_this.currentClick === "Polygon") {
            coordinates.push([pointList[0].lng, pointList[0].lat]);
          }
          return {
            length: _this.form.length,
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "淹没":
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            pSourceX: pointList[0].lng,
            pSourceY: pointList[0].lat,
            demTileLevel: cesiumCommon.getZoom(),
            floodLevel: _this.form.floodLevel,
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "挖填方":
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            dataModel: _this.pointType ? 1 : 0,
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "坡度坡向":
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "点高程坡度坡向":
          return {
            lon: pointList[0].lng,
            lat: pointList[0].lat,
            demTileLevel: cesiumCommon.getZoom(),
            dataModel: _this.pointType ? 1 : 0
          };
        case "距离量测":
          return {
            "p1.x": pointList[0].lng,
            "p1.y": pointList[0].lat,
            "p1.z": pointList[0].lat,
            "p2.x": pointList[1].lng,
            "p2.y": pointList[1].lat,
            "p2.z": pointList[1].lat,
            demTileLevel: cesiumCommon.getZoom(),
            dataModel: _this.pointType ? 1 : 0
          };
        case "面积量测":
          if (pointList.length === 2) {
            coordinates.push([pointList[0].lng, pointList[0].lat]);
            coordinates.push([pointList[0].lng, pointList[1].lat]);
            coordinates.push([pointList[1].lng, pointList[1].lat]);
            coordinates.push([pointList[1].lng, pointList[0].lat]);
            coordinates.push([pointList[0].lng, pointList[0].lat]);
          } else {
            pointList.forEach(item => {
              coordinates.push([item.lng, item.lat]);
            });
            coordinates.push([pointList[0].lng, pointList[0].lat]);
          }
          return {
            dataModel: _this.pointType ? 1 : 0,
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "地貌分析":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "两点方位角":
        case "方位角量测":
          return {
            "start.x": pointList[0].lng,
            "start.y": pointList[0].lat,
            "start.z": pointList[0].alt,
            "end.x": pointList[1].lng,
            "end.y": pointList[1].lat,
            "end.z": pointList[1].alt,
            dataModel: _this.pointType ? 1 : 0
          };
        case "点预测":
          return {
            "start.x": pointList[0].lng,
            "start.y": pointList[0].lat,
            "start.z": pointList[0].alt,
            azimuth: _this.form.azimuth,
            dis: _this.form.dis
          };
        case "高程统计":
        case "等高线提取":
          if (pointList.length === 2) {
            coordinates.push([pointList[0].lng, pointList[0].lat]);
            coordinates.push([pointList[0].lng, pointList[1].lat]);
            coordinates.push([pointList[1].lng, pointList[1].lat]);
            coordinates.push([pointList[1].lng, pointList[0].lat]);
            coordinates.push([pointList[0].lng, pointList[0].lat]);
          } else {
            pointList.forEach(item => {
              coordinates.push([item.lng, item.lat]);
            });
            coordinates.push([pointList[0].lng, pointList[0].lat]);
          }
          return {
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "阴影分析":
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            sunHeightAngle: _this.form.sunHeightAngle,
            sunIncidenceAngle: _this.form.sunIncidenceAngle,
            dataModel: _this.pointType ? 1 : 0,
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "观察所分析":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            chooseNum: _this.form.chooseNum,
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "直瞄分析":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          const point = cesiumCommon.Cartesian3_to_WGS84(_this.step1Point[0]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            },
            lon: point.lng,
            lat: point.lat,
            angle: _this.form.angle
          };
        case "间瞄分析":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          const point1 = cesiumCommon.Cartesian3_to_WGS84(_this.step1Point[0]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            },
            lon: point1.lng,
            lat: point1.lat
          };
        case "空降场选址分析":
          pointList.forEach(item => {
            coordinates.push([item.lng, item.lat]);
          });
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          return {
            demTileLevel: cesiumCommon.getZoom(),
            areaminit: _this.form.areaminit,
            slopeMax: _this.form.slopeMax,
            layerName: "DN10500051_C_A",
            geometry: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
        case "核防护分析":
          return {
            demTileLevel: cesiumCommon.getZoom(),
            dlsValue: _this.form.dlsValue,
            hbgdValue: _this.form.hbgdValue,
            pDegree: _this.form.pDegree,
            ptCentorLon: pointList[0].lng,
            ptCentorLat: pointList[0].lat
          };
        case "道路机动":
          let avoid = [];
          avoid.push([
            Math.min(pointList[0].lng, pointList[1].lng),
            Math.min(pointList[0].lat, pointList[1].lat),
            Math.max(pointList[0].lng, pointList[1].lng),
            Math.max(pointList[0].lat, pointList[1].lat)
          ]);
          cesiumCommon.pointItem(
            Cesium.Cartesian3.fromDegrees(
              (pointList[0].lng + pointList[1].lng) / 2,
              (pointList[0].lat + pointList[1].lat) / 2
            ),
            Cesium.Color.WHITE.withAlpha(0),
            "绕行区域"
          );
          Bus.$emit(
            "addPoint",
            {
              lng: (pointList[0].lng + pointList[1].lng) / 2,
              lat: (pointList[0].lat + pointList[1].lat) / 2
            },
            "绕行区域"
          );
          let lnglats = [];
          _this.step1Point.forEach(item => {
            const point = cesiumCommon.Cartesian3_to_WGS84(item);
            lnglats.push([point.lng, point.lat]);
          });
          return {
            lnglats,
            avoid,
            level: 1,
            policy: _this.form.policy
          };
        case "叠置分析":
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[1].lat]);
          coordinates.push([pointList[1].lng, pointList[0].lat]);
          coordinates.push([pointList[0].lng, pointList[0].lat]);
          let layers = [];
          for (var key in _this.shpLayer) {
            layers.push(key);
          }
          return {
            aname: layers[0],
            bname: layers[1],
            overlayType: _this.radioModel,
            bbox: {
              type: _this.currentClick,
              coordinates: [coordinates]
            }
          };
      }
    },
    /**
     * 初始化页面参数表单数据
     */
    initForm() {
      if (!!_this.parameterObj[_this.currentTab]) {
        _this.parameterObj[_this.currentTab].form.forEach(item => {
          _this.$set(_this.form, item.key, item.value);
        });
      }
    },
    /**
     * 切换tab页
     */
    tabChange(value) {
      _this.clearHandle();
      _this.showButton = {};
      _this.currentTab = _this.tabList[value.index];
      _this.initForm(); //add by niulei
      _this.responseObj = {}; //add by niulei
      switch (_this.currentTab) {
        case "点点通视":
        case "遮蔽分析":
        case "点面通视":
        case "点高程坡度坡向":
        case "两点方位角":
        case "方位角量测":
          _this.showSwitch = true;
          _this.showButton.point = true;
          break;
        case "路径分析":
        case "点预测":
        case "核防护分析":
          _this.showSwitch = false;
          _this.showButton.point = true;
          break;
        case "剖面":
        case "距离量测":
          _this.showSwitch = true;
          _this.showButton.line = true;
          break;
        case "面积量测":
          _this.showSwitch = true;
          _this.showButton.poly = true;
          _this.showButton.rect = true;
          break;
        case "缓冲区":
          _this.showSwitch = false;
          _this.showButton.point = true;
          _this.showButton.line = true;
          _this.showButton.poly = true;
          break;
        case "淹没":
        case "坡度坡向":
          _this.showSwitch = false;
          _this.showButton.rect = true;
          break;
        case "挖填方":
        case "阴影分析":
          _this.showSwitch = true;
          _this.showButton.rect = true;
          break;
        case "高程统计":
          _this.showSwitch = true;
          _this.showButton.rect = true;
          _this.showButton.poly = true;
          break;
        case "等高线提取":
          _this.showSwitch = false;
          _this.showButton.rect = true;
          _this.showButton.poly = true;
          break;
        case "观察所分析":
        case "空降场选址分析":
        case "地貌分析":
          _this.showSwitch = false;
          _this.showButton.poly = true;
          break;
        case "直瞄分析":
        case "间瞄分析":
          _this.showSwitch = false;
          _this.showButton.point = true;
          _this.showButton.poly = true;
          break;
        case "道路机动":
          _this.showSwitch = false;
          _this.showButton.point = true;
          _this.showButton.rect = true;
          break;
        case "叠置分析":
          _this.showSwitch = false;
          _this.showButton.rect = true;
          _this.getVectorNames();
          break;
      }
    },
    /**
     * 叠置分析图层列表
     */
    getVectorNames() {
      getvectornames().then(response => {
        if (response.data.isSuccess == 1) {
          _this.shpData = [];
          response.data.layerNames.forEach(function(item) {
            let obj = { name: item };
            _this.shpData.push(obj);
          });
        } else {
          _this.$message.error("服务请求失败！");
        }
      });
    },
    /**
     * 提交页面表单参数
     */
    // submitParameter() {
    //   _this.showParameter = false;
    //   _this.fenXi()
    // },
    /**
     * 取消页面表单参数
     */
    // quitParameter() {
    //   _this.showParameter = false;
    //   for (let key in _this.from) {
    //     _this.$set(_this.from, key, 0);
    //   }
    // },
    /**
     * 清空echarts数据
     */
    clearEcharts() {
      _this.showPouMian = false;
      Bus.$emit("clearChart");
    },
    /**
     * 清空cesium球上图形
     */
    clearHandle() {
      _this.responseObj = {}; //add by niulei
      Bus.$emit("changeCursor");
      Bus.$emit("clear");
      cesiumCommon.handlerList.forEach(item => {
        if (!item.isDestroyed()) {
          item.destroy();
          _this.currentButton = {};
        }
      });
      cesiumCommon.handlerList = [];
      viewer.scene.globe.depthTestAgainstTerrain = false;
      cesiumCommon.entitiesList.forEach(item => {
        viewer.entities.remove(item);
      });
       cesiumCommon.primitivesList.forEach(item => {
        viewer.scene.primitives.remove(item);
      });
      cesiumCommon.entitiesList = [];
      _this.positions = [];
      _this.showPouMian = false;
      _this.currentClick = null;
      viewer.dataSources.removeAll();
      if (viewer.scene.globe.clippingPlanes != undefined) {
        viewer.scene.globe.clippingPlanes.enabled = false;
      }
    },
    pointTypeChange() {
      cesiumCommon.toggle3dTile(_this.pointType);
    },
    shpTreeClick(node, bool) {
      if (bool) {
        if (Object.getOwnPropertyNames(_this.shpLayer).length > 2) {
          _this.$message.error("最多只能同时加载2个图层,请在树上选择2个图层！");
          let layers = [];
          for (var key in _this.shpLayer) {
            layers.push(key);
          }
          _this.$refs.tree2.setCheckedKeys(layers);
          return;
        }
        _this.shpLayer[node.name] = viewer.imageryLayers.addImageryProvider(
          new Cesium.WebMapServiceImageryProvider({
            url: geoserverurl,
            layers: node.name,
            parameters: {
              service: "WMS",
              format: "image/png",
              transparent: true
            }
          })
        );
      } else {
        viewer.imageryLayers.remove(_this.shpLayer[node.name]);
        delete _this.shpLayer[node.name];
      }
    },
    copyCalcVal() {
      //复制计算出来的结果
      var calDom = document.getElementById("disVal");
      calDom.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      let _this = this;
      this.copySuccess = true;
      setTimeout(function() {
        _this.copySuccess = false;
      }, 3000);
    }
  }
};
</script>

<style lang="scss">
// .drawPoint, .drawLine, .drawPoly, .drawRect, .drawCircle, .drawClear, .drawAna {
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
// }
.statistic i {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: 100% 100%;
}
.drawIcon {
  background-image: url("../../static/images/analysis.png");
}
.deleteIcon {
  background-image: url("../../static/images/delete.png");
}
.icon0 {
  background-image: url("../../static/images/icon0.png");
}
.is-active .icon0 {
  background-image: url("../../static/images/icon0-A.png");
}
.icon1 {
  background-image: url("../../static/images/icon1.png");
}
.is-active .icon1 {
  background-image: url("../../static/images/icon1-A.png");
}
.icon2 {
  background-image: url("../../static/images/icon2.png");
}
.is-active .icon2 {
  background-image: url("../../static/images/icon2-A.png");
}
.icon3 {
  background-image: url("../../static/images/icon3.png");
}
.is-active .icon3 {
  background-image: url("../../static/images/icon3-A.png");
}
.icon4 {
  background-image: url("../../static/images/icon4.png");
}
.is-active .icon4 {
  background-image: url("../../static/images/icon4-A.png");
}
.icon5 {
  background-image: url("../../static/images/icon5.png");
}
.is-active .icon5 {
  background-image: url("../../static/images/icon5-A.png");
}
.icon6 {
  background-image: url("../../static/images/icon6.png");
}
.is-active .icon6 {
  background-image: url("../../static/images/icon6-A.png");
}
.icon7 {
  background-image: url("../../static/images/icon7.png");
}
.is-active .icon7 {
  background-image: url("../../static/images/icon7-A.png");
}
.icon8 {
  background-image: url("../../static/images/icon8.png");
}
.is-active .icon8 {
  background-image: url("../../static/images/icon8-A.png");
}
.icon9 {
  background-image: url("../../static/images/icon9.png");
}
.is-active .icon9 {
  background-image: url("../../static/images/icon9-A.png");
}
.icon10 {
  background-image: url("../../static/images/icon10.png");
}
.is-active .icon10 {
  background-image: url("../../static/images/icon10-A.png");
}
.icon11 {
  background-image: url("../../static/images/icon11.png");
}
.is-active .icon11 {
  background-image: url("../../static/images/icon11-A.png");
}
.icon12 {
  background-image: url("../../static/images/icon12.png");
}
.is-active .icon12 {
  background-image: url("../../static/images/icon12-A.png");
}
.icon13 {
  background-image: url("../../static/images/icon13.png");
}
.is-active .icon13 {
  background-image: url("../../static/images/icon13-A.png");
}
.icon14 {
  background-image: url("../../static/images/icon14.png");
}
.is-active .icon14 {
  background-image: url("../../static/images/icon14-A.png");
}
.icon15 {
  background-image: url("../../static/images/icon15.png");
}
.is-active .icon15 {
  background-image: url("../../static/images/icon15-A.png");
}
.icon16 {
  background-image: url("../../static/images/icon16.png");
}
.is-active .icon16 {
  background-image: url("../../static/images/icon16-A.png");
}
.icon17 {
  background-image: url("../../static/images/icon17.png");
}
.is-active .icon17 {
  background-image: url("../../static/images/icon17-A.png");
}
.icon18 {
  background-image: url("../../static/images/icon18.png");
}
.is-active .icon18 {
  background-image: url("../../static/images/icon18-A.png");
}
.icon19 {
  background-image: url("../../static/images/icon19.png");
}
.is-active .icon19 {
  background-image: url("../../static/images/icon19-A.png");
}
.icon20 {
  background-image: url("../../static/images/icon20.png");
}
.is-active .icon20 {
  background-image: url("../../static/images/icon20-A.png");
}
.icon21 {
  background-image: url("../../static/images/icon21.png");
}
.is-active .icon21 {
  background-image: url("../../static/images/icon21-A.png");
}
.icon22 {
  background-image: url("../../static/images/icon22.png");
}
.is-active .icon22 {
  background-image: url("../../static/images/icon22-A.png");
}
.icon23 {
  background-image: url("../../static/images/icon23.png");
}
.is-active .icon23 {
  background-image: url("../../static/images/icon23-A.png");
}
.icon24 {
  background-image: url("../../static/images/icon24.png");
}
.is-active .icon24 {
  background-image: url("../../static/images/icon24-A.png");
}
.icon25 {
  background-image: url("../../static/images/icon25.png");
}
.is-active .icon25 {
  background-image: url("../../static/images/icon25-A.png");
}
.twoPointIcon {
  background-image: url("../../static/images/twoPoint.png");
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

// .bufferIcon1{
//    background-image: url("../images/bufferIcon1.png");
// }
// .bufferIcon2{
//    background-image: url("../images/bufferIcon2.png");
// }
// .bufferIcon3{
//    background-image: url("../images/bufferIcon3.png");
// }
// .bufferIcon1:hover{
//    background-image: url("../images/bufferIcon1-1.png");
// }
// .bufferIcon2:hover{
//    background-image: url("../images/bufferIcon2-1.png");
// }
// .bufferIcon3:hover{
//    background-image: url("../images/bufferIcon3-1.png");
// }

// .drawLine {
//   background-image: url("../../static/groundlib/mouse/glyphicons_097_vector_path_line.png");

// }

// .drawPoly {
//   background-image: url("../../static/groundlib/mouse/glyphicons_096_vector_path_polygon.png");
// }

// .drawRect {
//   background-image: url("../../static/groundlib/mouse/glyphicons_094_vector_path_square.png");
// }

// .drawCircle {
//   background-image: url("../../static/groundlib/mouse/glyphicons_095_vector_path_circle.png");
// }

// .drawClear {
//   background-image: url("../../static/groundlib/mouse/glyphicons_067_cleaning.png");
// }

.button-background {
  background-color: #008000 !important;
}

.cursor-point {
  cursor: url("../../static/groundlib/mouse/point.png"), auto;
}

.cursor-line {
  cursor: url("../../static/groundlib/mouse/line.png"), auto;
}

.cursor-poly {
  cursor: url("../../static/groundlib/mouse/glyphicons_096_vector_path_polygon.png"),
    auto;
}

.cursor-rect {
  cursor: url("../../static/groundlib/mouse/glyphicons_094_vector_path_square.png"),
    auto;
}

.cursor-circle {
  cursor: url("../../static/groundlib/mouse/glyphicons_095_vector_path_circle.png"),
    auto;
}

.drawAna {
  background-image: url("../../static/groundlib/mouse/analysis.png");
}
</style>
