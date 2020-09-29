<template>
  <div class="bottomside-wrapper">
    <div class="bottomside-container">

      <div class="bottomside__area-statistic">
        <div class="bottomside__area-people__title">
          <span>受益人口</span>
          <span>></span>
        </div>
        <div class="bottomside__area-people__center-chart">
          <div id="center-chart__content"></div>
          <div class="center-chart__desc">
            <p>{{syl}}%</p>
            <p>受益</p>
          </div>
        </div>
        <div class="bottomside__area-people__info">
          <div>
            <p>受益贫困人口</p>
            <p>{{bottom_middle.sypkrk}}人</p>
          </div>
          <div class="line"></div>
          <div>
            <p>受益非贫困人口</p>
            <p>{{bottom_middle.syfpkrk}}人</p>
          </div>
        </div>
        <div class="bottomside__area-people__total">
          <div>
            <p>建档立卡人口（人）<span style="color:yellow;font-weight:bold">{{bottom_middle.jdlk}}</span></p>
          </div>
        </div> 
      </div>

      <div class="bottomside__area-people">
        <div class="bottomside__area-statistic__title">分类资金统计</div>
        <div id="bottomside__area-statistic__left-chart"></div>
      </div>

      <div class="bottomside__area-fund">
        <div style="position:absolute;top:50px;right:30px;font-size:12px;z-index:100">(单位：万元)</div>
        <div class="bottomside__area-fund__title">
          <span>财政支付资金</span>
          <span>></span>
        </div>
        <div class="paybox">
          <div class="pay_left">
            <div class="total">
            <span style="margin-left:10px">总数（万元）</span>
            <br> 
            <span style="color:yellow;font-weight:bold;font-size:20px;margin-left:10px">{{zfzj}}</span>
            </div>
            <div id="echarts3"></div>
          </div>
          <div class="pay_right">
            <div id="echarts4"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import echarts from 'echarts'

export default {
  name: "Bottomside",
  components: {

  },
  data() {
  	return {
      color: ['#3aade6', '#47e1ad', '#ffdb4d', '#ff844d'],
      axisLine: {
        lineStyle: {
          color: '#ffffff'
        }
      },
      showid:0,//要显示数据的序号
      syl:2.67,
      syl_list:[2.67,0.13],
      bottom_middle:{jdlk:6417826,sypkrk:171218,syfpkrk:153108},
      bottom_middle_list:[
        {jdlk:6417826,sypkrk:171218,syfpkrk:153108},
        {jdlk:41691,sypkrk:54,syfpkrk:53}
      ],
      zfzj_list:[   //财政支付资金
        {
          total:76269.708171,
          zfl:67.4,
          dr:29914.279063,
          dh:4801.9645,
          dqy:37776.065408,
          djjzz:3777.3992
        },
        {
          total:11911.135269,
          zfl:73.41,
          dr:214.200663,
          dh:3000,
          dqy:8292.299706,
          djjzz:404.6349
        }
      ],
      zfzj:0
  	}
  },
  mounted() {
    this.drawAreaStatistics(); //分类资金统计
    this.drawAreaPeople(); //受益人口
    // this.drawAreaFund();
    this.echarts_3();
    this.echarts_4();
    Bus.$on("fundaccount_show",id=>{
     this.showid=id 
     this.syl=this.syl_list[id]
     this.zfzj=this.zfzj_list[id].total
     this.drawAreaStatistics();
      // this.drawAreaFund();
      this.echarts_3();
      this.echarts_4();
      this.bottom_middle=this.bottom_middle_list[id]
      
    })
  },
  methods: {
    /* ****************************************** */
    echarts_3(){
      let data=this.zfzj_list[this.showid].zfl
      let charts=echarts.init(document.getElementById("echarts3"));
      charts.clear();
      charts.setOption({
          title: {
              text: data+"%\n支付率",
              x: 'center',
              y: 'center',
              textStyle: {
                  fontWeight: 'normal',
                  color: '#fff',
                  fontSize: '18'
              }
          },
          tooltip : {
              trigger: 'item',
              formatter: "支付率 <br/>"+data+"%"
          },
          hoverAnimation: false,
          color: ['#282c40'],
          series: [{
              name: '支付率',
              type: 'pie',
              clockWise: true,
              radius: ['50%', '80%'],
              itemStyle: {
                  normal: {
                      label: {
                          show: false
                      },
                      labelLine: {
                          show: false
                      }
                  }
              },
              data: [{
                  value: data,
                  name: '',
                  itemStyle: {
                      normal: {
                          color: { // 完成的圆环的颜色
                              colorStops: [{
                                  offset: 0,
                                  color: '#02d6fc' // 0% 处的颜色
                              }, {
                                  offset: 1,
                                  color: '#367bec' // 100% 处的颜色
                              }]
                          },
                          label: {
                              show: false
                          },
                          labelLine: {
                              show: false
                          }
                      }
                  }
              }, {
                  name: '',
                  value: 100-data
              }]
          }]
      })
    },
    echarts_4(){
      let data=this.zfzj_list[this.showid]
      let dr=data.dr 
      let dh=data.dh
      let dqy=data.dqy
      let djjzz=data.djjzz
      let charts=echarts.init(document.getElementById("echarts4"));
      charts.clear();
      charts.setOption({
          color: ['#4D81E4'],
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'      
              },
          },
          grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              top:'20%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['到人', '到户', '到企业', '到经济组织'],
                  axisTick: {
                      alignWithLabel: true
                  },
                  axisLine: {
                      show: true,
                      lineStyle: {
                          color: 'white'
                      }
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize:'13'
                    }
                }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  color: '#fff',axisLine: {
                      show: true,
                      lineStyle: {
                          color: 'white'
                      }
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize:'14'
                    }
                }
              }
          ],
          series: [
              {
                  name: '支付资金',
                  type: 'bar',
                  barWidth: '25%',
                  data: [dr,dh,dqy,djjzz]
              }
          ]
      })
    },
    /* ************************************** */
    drawAreaStatistics() {
      let chart = echarts.init(document.getElementById('bottomside__area-statistic__left-chart'));
      chart.clear();

      let option = null;

      if (this.showid == 0) {
        let datas=[
          [113158.0534, 76269.708171],
          [6224.44, 11911.135269]
        ]
        let data=datas[this.showid]
        console.log('分类资金统计',data);
        option = {
          color: this.color,
          grid: {
            top: 30,
            left: 70,
            right: 30,
            bottom: 30
          },
          // legend: {
          //   orient: 'horizontal',
          //   data: ['财政分配资金', '项目支付资金'],
          //   icon: 'circle',
          //   itemWidth: 10,
          //   itemHeight: 10,
          //   itemGap: 5,
          //   textStyle: {
          //     color: '#ffffff'
          //   }
          // },
          tooltip: {
            trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'      
              },
            formatter: '{b}: {c}',
            transitionDuration: 0
          },
          xAxis: {
            type: 'category',
            data: ['财政分配资金', '项目支付资金'],
            axisLine: this.axisLine
          },
          yAxis: {
            type: 'value',
            axisLine: this.axisLine
          },
          series: [
            {
              name: '资金',
              barWidth: 30,
              data: data,
              type: 'bar'
            }
          ]
        };
      } else {
        option = {
          color: this.color,
          grid: {
            top: 30,
            left: 70,
            right: 30,
            bottom: 30
          },
          tooltip: {
            trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'      
              },
            formatter: '{b}: {c}',
            transitionDuration: 0
          },
          xAxis: {
            type: 'category',
            data: ['安排资金总量', '财政分配资金', '项目支付资金'],
            axisLine: this.axisLine
          },
          yAxis: {
            type: 'value',
            axisLine: this.axisLine
          },
          series: [
            {
              name: '资金',
              barWidth: 20,
              data: [71308.85321, 16224.44, 11911.135269],
              type: 'bar'
            }
          ]
        };
      }
      chart.setOption(option);
    },
    drawAreaPeople() {
      let chart = echarts.init(document.getElementById('center-chart__content'));
      let data=this.syl
      let option = {
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: '{a}:{d}%',
          transitionDuration: 0
        },
        series: [
          {
            name: '受益人口',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '75%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: data, name: ''},
              {value: 100-data, name: ''}
            ]
          }
        ]
      };

      chart.setOption(option);
    },
    drawAreaFund() {
      let chart = echarts.init(document.getElementById('bottomside__area-fund__right-chart'));

      let option = {
        color: this.color,
        grid: {
          top: 30,
          left: 40,
          right: 40,
          bottom: 30
        },
        legend: {
          orient: 'horizontal',
          data: ['到人', '到户', '到企业', '到经济组织'],
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
          transitionDuration: 0
        },
        xAxis: {
          type: 'category',
          data: ['桐木镇', '金秀镇', '忠良乡'],
          axisLine: this.axisLine
        },
        yAxis: {
          type: 'value',
          axisLine: this.axisLine
        },
        series: [
          {
            name: '到人',
            barWidth: 10,
            data: [120, 200, 120],
            type: 'bar'
          },
          {
            name: '到户',
            barWidth: 10,
            data: [90, 220, 70],
            type: 'bar'
          },
          {
            name: '到企业',
            barWidth: 10,
            data: [20, 270, 50],
            type: 'bar'
          },
          {
            name: '到经济组织',
            barWidth: 10,
            data: [30, 340, 50],
            type: 'bar'
          }
        ]
      };

      chart.setOption(option);      
    }
  }
}

</script>

<style scoped>

.bottomside-wrapper{
  position: absolute;
  left: 17%;
  right: 17%;
  bottom: 0;
	height: 25%;
	background-color: #003459;
}
.bottomside-container{
  width: 100%;
  height: calc(100% - 5px);
  /*background-color: #0a4b7a;*/
}

.bottomside__area-statistic{
  width: 30%;
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 0 0;
  float: left;
}
.bottomside__area-people{
  position: relative;
  width: calc(25% - 10px);
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 5px 0;
  float: left;  
  font-size: 14px;
}
.bottomside__area-people__total{
  width: 100%;
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  padding-left: 10px;
  box-sizing: border-box;
}
.bottomside__area-people__info{
  float: right;
  width: 50%;
  height: calc(100% - 77px); 
  font-size: 18px;
  padding: 10px 10px;
  box-sizing: border-box;
}
.line{
  width: 100%;
  height: 1px;
  background-color: #126494;
  margin: 5px 0;
}
.bottomside__area-fund{
  width: 45%;
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 0 0;
  float: left;  
}

.bottomside__area-statistic__title{
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: bolder;
  background-color: #126494;
}
.bottomside__area-fund__title, .bottomside__area-people__title{
  position: relative;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: bolder;
  background-color: #126494;  
}
.bottomside__area-fund__title span:nth-child(2), .bottomside__area-people__title span:nth-child(2){
  position: absolute;
  right: 0;
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: #3aade6;
  text-align: center;
}
/* ****************************************************************************** */
.paybox{
  display: flex;
  width: 100%;
  height: calc(100% - 50px);
}
.pay_left{
  width: 30%;
  height: 100%;
}
.total{
  width: 100%;
  height: 45px;
  font-size: 16px;
  padding-top: 10px;
  background-image: linear-gradient(to bottom,#0a4b7a,#1b72b1,#0a4b7a);
}
#echarts3{
  width: 100%;
  height: calc(100% - 50px);
}
.pay_right{
  width: 70%;
  height: 100%;
}
#echarts4{
  width: 100%;
  height: 100%;
}
/* ****************************************************************************** */
#bottomside__area-statistic__left-chart, #bottomside__area-fund__right-chart{
  width: 100%;
  height: calc(100% - 40px);
}
.bottomside__area-people__center-chart{
  width: 50%;
  height: calc(100% - 77px);  
  float: left;
  position: relative;
}
#center-chart__content{
  width: 100%;
  height: 100%;
}
.center-chart__desc{
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 14px);
}

</style>
