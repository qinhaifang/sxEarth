<template>
  <div class="bottomside-wrapper">
    <div class="bottomside-container">

      <div class="bottomside__area-statistic">
         <div class="title"><span style="margin-left:10px;">受益人口</span></div>
        <div class="jdlk_content">
          <div id="echarts2"></div>
          <div class="jdlk_right">
            受益贫困人口<br> 
            <span style="">{{sypkrk}}人</span>
            <hr style="width:80%;border-bottom:0">
            受益非贫困人口<br> 
            <span style="">{{syfpkrk}}人</span>
          </div>
        </div>
        <div class="jdlk">
          <span style="margin-left:10px">建档立卡人口（人）</span> 
          <br> 
          <span style="color:yellow;font-weight:bold;font-size:20px;margin-left:10px">{{jdlk}}</span>
        </div>
      </div>

      <div class="bottomside__area-people">
        <div class="title"><span style="margin-left:10px;">财政分配资金</span></div>
        <div id="echarts1"></div>
        <div style="position:absolute;top:50px;left:30px;font-size:12px;">(单位：万元)</div>
      </div>

      <div class="bottomside__area-fund">
        <div style="position:absolute;top:50px;right:30px;font-size:12px;z-index:100">(单位：万元)</div>
        <div class="title"><span style="margin-left:10px;">财政支付资金</span></div>
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
import axios from 'axios'
export default {
  name: "Bottomside",
  components: {

  },
  data() {
  	return {
      project:null,
      project1:null,
      project2:null,
      jdlk:0,//建档立卡
      syhs:0,//受益户数
      syrc:0,//受益人次
      zfzj:0,//支付资金
      dr:0,//到人
      dh:0,//到户
      dqy:0,//到企业
      djjzz:0,//到经济组织
      fpzj:0,//分配资金
      syl:0.13,//受益率
      zfl:0,//支付率
      sypkrk:54,
      syfpkrk:53
  	}
  },
  mounted(){
    axios.get('../../../static/sampleData/stat.json')
    .then(res=>{
      this.project=res.data.Project
      this.project1=res.data.ProjectOne
      this.project2=res.data.ProjectTwo
      this.updateData(this.project)
    })
    Bus.$on('select_project',()=>{
      this.syl=0.13
      this.sypkrk=53
      this.syfpkrk=54
      this.updateData(this.project)
    })
    Bus.$on('select_project1',()=>{
      this.syl=35.24
      this.sypkrk=61
      this.syfpkrk=123
      this.updateData(this.project1)
    })
    Bus.$on('select_project2',()=>{
      this.syl=0
      this.sypkrk=0
      this.syfpkrk=0
      this.updateData(this.project2)
    })
  },
  methods: {
    updateData(data){
      this.loadData(data)
      this.echarts_1();
      this.echarts_2();
      this.echarts_3();
      this.echarts_4();
    },
    loadData(data){
      this.jdlk=data[0].Data//建档立卡
      // this.syhs=data[1].Data//受益户数
      // this.syrc=data[2].Data//受益人次
      this.zfzj=data[3].Data//支付资金
      this.dr=data[4].Data//到人
      this.dh=data[5].Data//到户
      this.dqy=data[6].Data//到企业
      this.djjzz=data[7].Data//到经济组织
      this.fpzj=data[8].Data//分配资金
      // this.syl=data[9].Data//受益率
      this.zfl=data[10].Data//支付率
    },
    echarts_1(){
      let data=this.fpzj
      let charts=echarts.init(document.getElementById("echarts1"));
      charts.clear();
      charts.setOption({
          title: {
              text: "分配金额\n"+data,
              x: 'center',
              y: 'center',
              textStyle: {
                  fontWeight: 'normal',
                  color: '#fff',
                  fontSize: '18'
              }
          },
          color: ['#282c40'],
          hoverAnimation: false,
          tooltip : {
              trigger: 'item',
              formatter: "分配金额："+data
          },
          series: [{
            name: '分配金额',
            type: 'pie',
            clockWise: true,
            radius: ['60%', '90%'],
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
                value: 100,
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
              }]
          }]
      })
    },
    echarts_2(){
      let data=this.syl
      let charts=echarts.init(document.getElementById("echarts2"));
      charts.clear();
      charts.setOption({
        title: {
          text: data+"%\n受益",
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#fff',
            fontSize: '18'
          }
        },
        color: ['#282c40'],
        hoverAnimation: false,
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/> {d}%"
        },
        series: [{
            name: '受益率',
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
    echarts_3(){
      let data=this.zfl
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
      let dr=this.dr 
      let dh=this.dh
      let dqy=this.dqy
      let djjzz=this.djjzz
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
                      fontSize:'14'
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
    }
  },
}

</script>

<style scoped>

.bottomside-wrapper{
  position: absolute;
  left: 17%;
  right: 17%;
  bottom: 0;
	height: 25%;
	background-color: #003353;
}
.bottomside-container{
  width: 100%;
  height: calc(100% - 5px);
  /*background-color: #15384E;*/
}
.title{
	height: 40px;
	line-height: 40px;
	width: 100%;
	background-color: #126494;
	font-size: 20px;
	font-weight:600;
	font-family: MicrosoftYaHei;
}
/* 财政分配资金 */
.bottomside__area-statistic{
  width: 25%;
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 0 0;
  float: left;
}
#echarts1{
  width: 100%;
  height: calc(100% - 40px);
}
/* 受益人口 */
.bottomside__area-people{
  width: calc(25% - 10px);
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 5px 0;
  float: left;  
}
.jdlk{
  width: 100%;
  height: 45px;
  font-size: 16px;
  padding-top: 10px;
  background-image: linear-gradient(to bottom,#0a4b7a,#1b72b1,#0a4b7a);
}
.jdlk_content{
  display: flex;
  height: calc(100% - 100px);
}
#echarts2{
  width: 50%;
  height: 100%;
}
.jdlk_right{
  width: 50%;
  height: fit-content;
  margin: auto 0;
  font-size: 16px;
  text-align: center;
}
/*　财政支付资金 */
.bottomside__area-fund{
  width: 50%;
  height: 100%;
  background-color: #0a4b7a;
  margin: 5px 0 0;
  float: left;  
}
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
</style>
