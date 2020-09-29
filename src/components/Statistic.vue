<template>
  <div
    v-show="showAll && !isCha"
    class="statistic"
    :class="{ 'is-village': currentStatistic === 'village' }"
  >
    <div
      :class="'chart' + (index + 1)"
      v-for="(item, index) in statisticTitle[currentStatistic]"
      :key="index"
    >
      <div class="title">{{ item }}</div>
      <div
        class="el-icon-download download-div"
        @click="downloadImage('chart' + (index + 1), item)"
      ></div>
      <div :id="'chart' + (index + 1)"></div>
    </div>
    <div v-if="currentStatistic !== 'village'" class="poverty-people">
      <div class="title">贫困人口</div>
      <div class="content1">{{ dataTarget.num }}</div>
      <div class="title">减贫目标</div>
      <div class="content2">
        <div
          v-for="(item, index) in dataTarget.targets"
          :key="index"
          class="content-box"
          :style="{ width: 100 / dataTarget.targets.length - 1 + '%' }"
        >
          <div class="number">
            <span class="count">{{ item.num }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
          <div class="date">{{ item.year }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  searchData,
  getStatisticData,
  getJsonById,
  getTreeByParent,
  getStatisticData2
} from "../api/api";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      dataTarget: {
        num: "",
        targets: []
      },
      statisticData: null,
      statisticData2: null,
      area: null,
      date: null,
      child: null,
      name: null,
      currentStatistic: "county",
      statisticTitle: {
        // 县级以上（包括县级） 统计数据类型
        county: [
          "贫困村数量统计",
          "主要致贫原因统计",
          "扶贫人口统计",
          "贫困人口统计"
        ],
        // 镇级 统计数据类型
        town: ["安置点搬迁人口统计", "主要致贫原因统计", "安置点资金投入统计"],
        // 安置点 统计数据类型
        village: ["各期搬入人口统计", "主要致贫原因统计", "搬迁户来源统计"]
      },
      showAll: true,
      isCha: false
    };
  },
  mounted() {
    Bus.$on("toggle-div", bool => {
      this.showAll = bool;
    });
    Bus.$on("add-statistic", (area, date, name) => {
      this.area = area;
      this.date = date;
      this.name = name;
      if (!this.statisticData) {
        return;
      }
      this.isCha = false;
      if (this.area === "610726002299") {
        this.isCha = true;
        return;
      }
      this.addStatistic();
      this.getStaisticsByArea(this.area, this.date);
    });
    Bus.$on("add-industry2", (industryData, currentIndustry) => {
      if (currentIndustry === 3) {
        Bus.$emit("add-industry-onEarth2", this.area, this.date);
      } else {
        const countrys = this.statisticData.population.filter(item => {
          return item.areaCode == this.area && item.date == this.date;
        });
        Bus.$emit(
          "add-industry-onEarth",
          currentIndustry,
          industryData,
          countrys,
          this.area
        );
      }
    });
    this.init();
  },
  methods: {
    downloadImage(className, name) {
      html2canvas(document.getElementsByClassName(className)[0]).then(function(
        canvas
      ) {
        const png = canvas.toDataURL("image/png");
        canvas.toBlob(function(blob) {
          saveAs(blob, `${name}.png`);
        });
      });
    },
    init() {
      getStatisticData().then(res => {
        this.statisticData = res;
        this.addStatistic();
        this.getStaisticsByArea(this.area, this.date);
      });
      getStatisticData2().then(res2 => {
        this.statisticData2 = res2;
      });
    },
    //获取村镇统计数据
    getStatisticsDataByLevel(length, callback) {
      let param = {
        page: 1,
        rows: 10000
      };
      const name = this.name.slice(0, this.name.length - 1);
      if (length == 9) {
        param.town = name;
      } else if (length == 12) {
        param.resettlement = name;
      }
      searchData(param).then(res => {
        callback(res.list);
      });
    },
    //柱状图和折线图数据构造
    buildBarOrLineData(areaCode, date, rawData, dataType) {
      var data = {
        titleArr: [],
        numberArr: []
      };
      rawData.forEach(function(item) {
        if (
          areaCode.indexOf(item.areaCode) >= 0 &&
          item.date.indexOf(date) >= 0
        ) {
          data.titleArr.push(item[dataType.title]);
          data.numberArr.push(item[dataType.value]);
        }
      });
      return data;
    },
    //柱状图和折线图数据构造
    buildBarOrLineData2(areaCode, date, rawData, dataType, type) {
      if (type == "cun") {
        type = "1";
      } else if (type == "ren") {
        type = "3";
      }
      var data = {
        titleArr: [],
        numberArr: [],
        numberArr2: []
      };
      rawData.forEach(function(item) {
        if (
          areaCode.indexOf(item.areaCode) >= 0 &&
          item.date.indexOf(date) >= 0 &&
          item.unique == type
        ) {
          data.titleArr.push(item[dataType.title]);
          data.numberArr.push(item[dataType.value]);
          data.numberArr2.push(item[dataType.value2]);
        }
      });
      return data;
    },
    //柱状图和折线图数据构造3  右下贫困人口统计用
    buildBarOrLineData3(areaCode, date, rawData, dataType) {
      var data = {
        titleArr: [],
        numberArr: []
      };
      rawData.forEach(function(item) {
        if (
          areaCode.indexOf(item.areaCode) >= 0 &&
          item.date.indexOf(date) >= 0 &&
          item.unique == "3"
        ) {
          data.titleArr.push(item[dataType.title]);
          data.numberArr.push(item[dataType.value]);
        }
      });
      return data;
    },
    //饼状图数据构造
    buildPieData(areaCode, date, rawData) {
      var data = [];
      rawData.forEach(function(item) {
        if (
          areaCode.indexOf(item.areaCode) >= 0 &&
          item.date.indexOf(date) >= 0
        ) {
          data.push({ name: item.title, value: item.number });
        }
      });
      return data;
    },
    //柱状图和折线图
    buildBarOrLine(data) {
      return {
        color: data.color,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: data.tipType // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: data.xAxis,
        yAxis: data.yAxis,
        series: data.series
      };
    },
    //柱状图和折线图2
    buildBarOrLine2(data) {
      return {
        color: data.color,
        tooltip: data.tooltip,
        grid: {
          left: "3%",
          right: "10%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: data.xAxis,
        yAxis: data.yAxis,
        series: data.series
      };
    },
    //饼状图
    buildPie(data) {
      return {
        title: data.title,
        color: data.color,
        textStyle: data.textStyle, //临时加的白色字体样式
        tooltip: data.tooltip,
        legend: data.legend,
        series: data.series
      };
    },
    //图形和标题插入到页面
    buildAllChart(id, option) {
      let doc = document.getElementById(id);
      if (!doc) {
        setTimeout(() => {
          this.buildAllChart(id, option);
        });
        return;
      }
      let myChart = echarts.init(doc);
      myChart.clear();
      myChart.setOption(option);
      setTimeout(() => {
        myChart.resize();
      }, 500);
      myChart.off("click", this.chartClickEvent);
      if (
        ["town", "village"].includes(this.currentStatistic) &&
        ["chart1", "chart2"].includes(id)
      ) {
        myChart.on("click", this.chartClickEvent);
      }
    },
    chartClickEvent(param) {
      let obj;
      if (param.seriesType === "pie") {
        obj = {
          key: "贫困原因",
          value: param.name
        };
      } else {
        if (this.currentStatistic === "town") {
          obj = {
            key: "安置点",
            value: param.name
          };
        } else {
          obj = {
            key: "搬迁时间",
            value: param.name
          };
        }
      }
      Bus.$emit("chart-search", obj);
    },
    //扶贫村数量统计
    initPoorPopulation(areaCode, date, poorPopulationdata) {
      const dataType = {
        title: "title",
        value: "numberV",
        value2: "numberV2"
      };
      const barData = this.buildBarOrLineData2(
        areaCode,
        date,
        poorPopulationdata,
        dataType,
        "cun"
      );
      const optionData = {
        color: ["#3ebcdb", "#b5db7a"],
        tipType: "shadow",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            let allNum = Number(params[0].value) + Number(params[1].value);
            return (
              "<p>合计：" +
              allNum +
              '</p><p><span style="background: ' +
              params[0].color +
              ';width: 10px;height:10px;display: inline-block;vertical-align: middle;margin-right: 4px"></span>    已出列：' +
              params[0].value +
              '</p><p><span style="background: ' +
              params[1].color +
              ';width: 10px;height:10px;display: inline-block;vertical-align: middle;margin-right: 4px"></span>未出列：' +
              params[1].value +
              "</p>"
            );
          }
        },
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel: {
              interval: 0,
              rotate: 0,
              formatter: function(value) {
                if (
                  (areaCode == "150724000000" || areaCode == "451200000000") &&
                  value.length > 4
                ) {
                  //鄂温克族自治旗    河池市下所有区县处理
                  var list = value.split("");
                  var str = "";
                  list.forEach((item, index) => {
                    str += item;
                    if (index % 2 === 1) {
                      str += "\n";
                    }
                  });
                  return str;
                } else {
                  return value.split("").join("\n");
                }
              }
            },
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: "（个）",
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            name: "已出列",
            type: "bar",
            stack: "sum",
            barWidth: "50%",
            data: barData.numberArr
          },
          {
            name: "未出列",
            type: "bar",
            stack: "sum",
            barWidth: "50%",
            data: barData.numberArr2
          }
        ]
      };
      const option = this.buildBarOrLine2(optionData);
      this.buildAllChart("chart1", option);
    },
    //主要贫困因素
    initPoorGuide(areaCode, date, poorGuide) {
      const pieData = this.buildPieData(areaCode, date, poorGuide);
      const optionData = {
        color: [
          "#DBD388",
          "#B5DB7A",
          "#3EBCDB",
          "#DB2EA8",
          "#9E40C5",
          "#928DDF"
        ],
        textStyle: { color: "#ffffff", fontSize: 12 },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} 人 ({d}%)"
        },
        series: [
          {
            name: "原因占比",
            type: "pie",
            radius: "55%",
            center: ["50%", "70%"],
            data: pieData
          }
        ]
      };
      const option = this.buildPie(optionData);
      this.buildAllChart("chart2", option);
    },
    //扶贫人口统计
    initPoorPopulation2(areaCode, date, poorPopulationdata) {
      const dataType = {
        title: "title",
        value: "numberV",
        value2: "numberV2"
      };
      const barData = this.buildBarOrLineData2(
        areaCode,
        date,
        poorPopulationdata,
        dataType,
        "ren"
      );
      const optionData = {
        color: ["#db2ea8", "#dbd388"],
        tipType: "shadow",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            let allNum = Number(params[0].value) + Number(params[1].value);
            return (
              '<p><span style="background: ' +
              params[0].color +
              ';width: 10px;height:10px;display: inline-block;vertical-align: middle;margin-right: 4px"></span>剩余贫困人口：' +
              params[0].value +
              '</p><p><span style="background: ' +
              params[1].color +
              ';width: 10px;height:10px;display: inline-block;vertical-align: middle;margin-right: 4px"></span>减贫人口：' +
              params[1].value +
              "</p>"
            );
          }
        },
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel: {
              interval: 0,
              rotate: 0,
              formatter: function(value) {
                if (
                  (areaCode == "150724000000" || areaCode == "451200000000") &&
                  value.length > 4
                ) {
                  //鄂温克族自治旗
                  var list = value.split("");
                  var str = "";
                  list.forEach((item, index) => {
                    str += item;
                    if (index % 2 === 1) {
                      str += "\n";
                    }
                  });
                  return str;
                } else {
                  return value.split("").join("\n");
                }
              }
            },
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: "（人）",
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            name: "剩余贫困人口",
            type: "bar",
            stack: "sum",
            barWidth: "50%",
            data: barData.numberArr
          },
          {
            name: "减贫人口",
            type: "bar",
            stack: "sum",
            barWidth: "50%",
            data: barData.numberArr2
          }
        ]
      };
      const option = this.buildBarOrLine2(optionData);
      this.buildAllChart("chart3", option);
    },
    //贫困人口统计
    initPopulation(areaCode, date, population) {
      const dataType = {
        title: "title",
        value: "numberV"
      };
      const barData = this.buildBarOrLineData3(
        areaCode,
        date,
        population,
        dataType
      );
      const optionData = {
        color: ["#3398DB"],
        tipType: "shadow",
        xAxis: [
          {
            name: "万人",
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel: {
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        yAxis: [
          {
            data: barData.titleArr,
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                if (areaCode == "451200000000" && value.length > 4) {
                  //鄂温克族自治旗
                  var list = value.split("");
                  var str = "";
                  list.forEach((item, index) => {
                    str += item;
                    if (index % 4 === 3) {
                      str += "\n";
                    }
                  });
                  return str;
                } else {
                  return value;
                }
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: barData.numberArr
          }
        ]
      };
      const option = this.buildBarOrLine(optionData);
      this.buildAllChart("chart4", option);
    },
    //安置点搬迁人口统计
    initPoolVllagePopulation(areaCode, date, poorPopulationdata) {
      const dataType = {
        title: "title",
        value: "number"
      };
      const barData = this.buildBarOrLineData(
        areaCode,
        date,
        poorPopulationdata,
        dataType
      );
      const optionData = {
        color: ["#3398DB"],
        tipType: "shadow",
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel: {
              interval: 0,
              rotate: 0,
              formatter: function(value) {
                var list = value.split("");
                var str = "";
                list.forEach((item, index) => {
                  str += item;
                  if (index % 2 === 1) {
                    str += "\n";
                  }
                });
                return str;
              }
            },
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: "（人）",
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: barData.numberArr
          }
        ]
      };
      const option = this.buildBarOrLine(optionData);
      this.buildAllChart("chart1", option);
    },
    //安置点资金投入统计
    initRelocationFunds(areaCode, date, poorPopulationdata) {
      if (areaCode != "610726102000") {
        areaCode = "610727113000";
      }
      const dataType = {
        title: "title",
        value: "number"
      };
      const barData = this.buildBarOrLineData(
        areaCode,
        date,
        poorPopulationdata,
        dataType
      );
      const optionData = {
        color: ["#3398DB"],
        tipType: "shadow",
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                var list = value.split("");
                var str = "";
                list.forEach((item, index) => {
                  str += item;
                  if (index % 2 === 1) {
                    str += "\n";
                  }
                });
                return str;
              }
            },
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: "（万）",
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: barData.numberArr
          }
        ]
      };
      const option = this.buildBarOrLine(optionData);
      this.buildAllChart("chart3", option);
    },
    //各期搬入人口统计
    initTimeMove(areaCode, date, poorPopulationdata) {
      let barData = {},
        Company,
        axisLabel = {};
      if (areaCode == "150724111013") {
        //鄂温克受益户统计
        barData = {
          titleArr: ["鄂温克旗", "鄂伦春旗", "扎兰屯"],
          numberArr: [69, 911, 717]
        };
        Company = "（户）";
        axisLabel = {
          interval: 0,
          formatter: function(value) {
            return value.split("-").join("");
          }
        };
      } else if (areaCode == "150724111016") {
        //英伦合作社扶持项目资金投入

        barData = {
          titleArr: [
            "2016年三到村三到户项目",
            "2017年三到村三到户项目",
            "三到村三到户巩固扶持项目",
            "呼伦贝尔短尾羊养殖项目"
          ],
          numberArr: [54.9, 190.8, 42, 270]
        };
        Company = "（万元）";
        axisLabel = {
          interval: 0,
          formatter: function(value) {
            var list = value.split("");
            var str = "";
            list.forEach((item, index) => {
              str += item;
              index = index + 2;
              if (index % 4 === 1) {
                str += "\n";
              }
            });
            return str;
          }
        };
      } else {
        //各期搬入人口统计
        const dataType = {
          title: "title",
          value: "number"
        };
        barData = this.buildBarOrLineData(
          areaCode,
          date,
          poorPopulationdata,
          dataType
        );
        Company = "（人）";
        axisLabel = {
          interval: 0,
          formatter: function(value) {
            return value.split("-").join("");
          },
          rotate: 60 //斜体
        };
      }
      const optionData = {
        color: ["#3398DB"],
        tipType: "shadow",
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel,
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: Company,
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: barData.numberArr
          }
        ]
      };
      const option = this.buildBarOrLine(optionData);
      this.buildAllChart("chart1", option);
    },

    //搬迁户来源统计
    initMoveVillage(areaCode, date, poorPopulationdata) {
      let barData = {},
        Company,
        axisLabel = {};
      if (areaCode == "150724111013") {
        //鄂温克财务指标汇
        barData = {
          titleArr: [
            "总投资",
            "建设期利息",
            "流动资金",
            "销售收入总额,不含增值税",
            "总成本费用",
            "营业税金附加总额",
            "发电利润总额",
            "投资财务净现值,税前",
            "资本金财务净现值",
            "投资财务净现值,税后"
          ],
          numberArr: [
            30494.52,
            245.49,
            127.27,
            84746.42,
            46527.27,
            1075.84,
            37143.31,
            7051.57,
            6238.42,
            7389.93
          ]
        };
        Company = "（万元）";
        axisLabel = {
          interval: 1,
          formatter: function(value) {
            var list = value.split("");
            var str = "";
            list.forEach((item, index) => {
              str += item;
              if (index % 2 === 1) {
                str += "\n";
              }
            });
            return str;
          }
        };
      } else if (areaCode == "150724111016") {
        //英伦合作社帮扶人口统计
        const dataType = {
          title: "title",
          value: "number"
        };
        barData = this.buildBarOrLineData(
          areaCode,
          date,
          poorPopulationdata,
          dataType
        );
        Company = "（人）";
        axisLabel = {
          interval: 1,
          formatter: function(value) {
            var list = value.split("");
            var str = "";
            list.forEach((item, index) => {
              str += item;
              if (index % 2 === 1) {
                str += "\n";
              }
            });
            return str;
          }
        };
      } else {
        //搬迁户来源统计
        const dataType = {
          title: "title",
          value: "number"
        };
        barData = this.buildBarOrLineData(
          areaCode,
          date,
          poorPopulationdata,
          dataType
        );
        let interval;
        if (areaCode == "610726002208") {
          //筒车河安置点
          interval = 6;
        } else if (barData.titleArr.length > 12) {
          interval = 1;
        } else {
          interval = 0;
        }
        axisLabel = {
          interval: interval,
          formatter: function(value) {
            return value.split("").join("\n");
          }
        };
      }
      const optionData = {
        color: ["#3398DB"],
        tipType: "shadow",
        xAxis: [
          {
            data: barData.titleArr,
            nameTextStyle: {
              padding: [0, 0, 0, -12]
            },
            axisLabel,
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            }
          }
        ],
        yAxis: [
          {
            name: Company,
            axisLine: {
              lineStyle: {
                color: "#EAE8E4"
              }
            },
            nameTextStyle: {
              padding: [0, 0, -5, 0]
            },
            splitLine: { show: false } //去掉网格线
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: barData.numberArr
          }
        ]
      };
      const option = this.buildBarOrLine(optionData);
      this.buildAllChart("chart3", option);
    },
    buildStatisticsData(list, type, areaCode) {
      var dataMap = {};
      var dataList = [];
      list.forEach(item => {
        if (dataMap[item[type]]) {
          dataMap[item[type]] += parseInt(item.number);
        } else {
          dataMap[item[type]] = parseInt(item.number);
        }
      });
      for (var j in dataMap) {
        dataList.push({
          areaCode: areaCode,
          title: j,
          number: dataMap[j],
          date: "2018"
        });
      }
      return dataList;
    },
    addStatistic() {
      if (this.area.substr(-6) == "000000") {
        this.currentStatistic = "county";
        const poorPopulationdata = this.statisticData["population"];
        this.initPoorPopulation(this.area, this.date, poorPopulationdata); //扶贫村数量统计
        const poorGuide = this.statisticData["poorGuide"];
        this.initPoorGuide(this.area, this.date, poorGuide); //主要致贫原因
        this.initPoorPopulation2(this.area, this.date, poorPopulationdata); //扶贫人口统计
        const population = this.statisticData["population"];
        this.initPopulation(this.area, this.date, population);
      } else if (this.area.substr(-3) == "000") {
        //镇级行政区划
        this.currentStatistic = "town";

        if (!["150724111013", "150724111016"].includes(this.area)) {
          //临时 规避内蒙
          //安置点资金投入统计
          this.initRelocationFunds(
            this.area,
            this.date,
            this.statisticData["capital"]
          );
          //镇级查询  查询某个镇的数据
          this.getStatisticsDataByLevel(9, statisticsData => {
            const resettlement = this.buildStatisticsData(
              statisticsData,
              "resettlement",
              this.area
            );
            //安置点搬迁人口统计
            this.initPoolVllagePopulation(this.area, "2018", resettlement);
            const reason = this.buildStatisticsData(
              statisticsData,
              "reason",
              this.area
            );
            //主要致贫原因统计
            this.initPoorGuide(this.area, "2018", reason);
          });
        }
      } else {
        //安置点级别统计
        this.currentStatistic = "village";
        // 查询某个安置点数据
        const statisticsData = this.getStatisticsDataByLevel(
          12,
          statisticsData => {
            const movetime = this.buildStatisticsData(
              statisticsData,
              "movetime",
              this.area
            );
            // 各期搬入人口统计
            this.initTimeMove(this.area, "2018", movetime);
            const reason = this.buildStatisticsData(
              statisticsData,
              "reason",
              this.area
            );
            // 主要致贫原因统计
            this.initPoorGuide(this.area, "2018", reason);
            const village = this.buildStatisticsData(
              statisticsData,
              "village",
              this.area
            );
            //搬迁户来源统计
            this.initMoveVillage(this.area, "2018", village);
          }
        );
      }
    },
    getStaisticsByArea(targetArea, year) {
      if (targetArea === "000000000000") {
        this.dataTarget = {
          num: "2864万",
          targets: [
            { num: "1000", unit: "万", year: "2019" },
            { num: "xxxx", unit: "万", year: "2020" }
          ]
        };
      } else {
        let totalNum = 0,
          firstYear = 0,
          secondYear = 0,
          Company = "万",
          fixed = 2;
        this.statisticData.population.forEach(item => {
          if (item.areaCode === targetArea) {
            if (item.date == year && item.unique == "3") {
              totalNum += parseFloat(item.numberV / 10000);
            }
            if (item.date == "2019" && item.unique == "3") {
              firstYear += parseFloat(item["18"]);
              secondYear += parseFloat(item["19"]);
            }
          }
        });
        if (
          targetArea === "150724000000" ||
          (totalNum === 0 && firstYear === 0 && secondYear === 0)
        ) {
          if (!this.statisticData2[targetArea]) {
            return;
          }
          totalNum = this.statisticData2[targetArea].totalNum;
          firstYear = this.statisticData2[targetArea].firstYear;
          secondYear = this.statisticData2[targetArea].secondYear;
          Company = "";
          fixed = 0;
        }
        this.dataTarget = {
          num: totalNum.toFixed(fixed) + Company,
          targets: [
            { num: firstYear.toFixed(fixed), unit: Company, year: "2019" },
            { num: secondYear.toFixed(fixed), unit: Company, year: "2020" }
          ]
        };
      }
    }
  }
};
</script>

<style scoped></style>s
