<template>
  <div class="leftside-wrapper">
    <div class="leftside-container">
      <div class="leftside__overview">
        <div class="ledtside__overview-title">概况</div>
        <div class="ledtside__overview-overflow">
          <div
            class="ledtside__overview-content"
            v-for="(item, index) in overviewDataList"
            :key="item.id"
            v-show="item.id==overview_show"
          >
            <div v-if="item.prefecture === 0 ? false : true">
              <p>贫困县：</p>
              <p>{{ item.prefecture}}个</p>
            </div>
            <div>
              <p>建档立卡人口：</p>
              <p>{{ item.people }}人</p>
            </div>
            <div>
              <p>安排资金总量：</p>
              <p>{{ item.fundAccount }}万元</p>
            </div>
            <div>
              <p>扶贫总项目数：</p>
              <p>{{ item.projectAccount }}个</p>
            </div>
            <div>
              <p>受益人口：</p>
              <p>{{ item.peopleAccount }}人</p>
            </div>
            <div>
              <p>人均受益：</p>
              <p>{{ item.averageAccount }}万元</p>
            </div>
          </div>
        </div>
      </div>

      <div class="leftside__fund-account">
        <div class="ledtside__fund-account-title">
          <span>资金来源</span>
          <span>></span>
        </div>
        <div id="leftside__fund-account__chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "Leftside",
  components: {},
  data() {
    return {
      overviewDataList: [],
      fund_accountList:[], //资金来源
      color: ["#3aade6", "#47e1ad", "#ffdb4d", "#ff844d"],
      overview_show:1,//概况显示
      fundaccount_show:0
    };
  },
  mounted() {
    this.axios.get("../../../static/sampleData/left-1.json").then(res => {
      console.log(res);
      this.overviewDataList = res.data;
    });
    this.axios.get("../../../static/sampleData/left-2.json").then(res => {
      console.log('资金来源',res);
      this.fund_accountList = res.data;
      this.drawProjectStatistics();
    });
    Bus.$on("overview_show",id=>{
      this.overview_show=id
    })
    Bus.$on("fundaccount_show",id=>{
      this.fundaccount_show=id
      this.drawProjectStatistics()
    })
  },
  methods: {
    drawProjectStatistics() {
      let chart = echarts.init(document.getElementById("leftside__fund-account__chart"));
      chart.clear();
      let data=this.fund_accountList[this.fundaccount_show]
      let option = {
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: '{b}:<br/>{c}-{d}%',
          transitionDuration: 0
        },
        legend: {
          orient: 'horizontal',
          left: 10,
          data: ['中央', '市级', '县级', '自治区'],
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            color: '#ffffff',
            fontSize:16
          }
        },
        series: [
          {
            name: '资金来源',
            type: 'pie',
            center: ["50%", "60%"],
            radius: ["40%", "60%"],
            avoidLabelOverlap: true,
            label: {
              show: true,
              formatter: '{b}: \n{d}%'
            },
            data: data
          }
        ]
      };

      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.leftside-wrapper {
  width: 17%;
  height: calc(100% - 72px);
  background-color: #003459;
  float: left;
}
.leftside-container {
  width: 100%;
  height: 100%;
  /*background-color: #0a4b7a;*/
}

.leftside__overview {
  width: calc(100% - 10px);
  height: 33%;
  background-color: #0a4b7a;
  margin: 0 5px;
}
.leftside__fund-account {
  width: calc(100% - 10px);
  height: calc(34% - 10px);
  background-color: #0a4b7a;
  margin: 5px 5px;
}

.ledtside__overview-title {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: bolder;
  background-color: #126494;
}
.ledtside__overview-overflow {
  overflow: auto;
  padding: 10px;
  height: calc(100% - 60px);
}
.ledtside__overview-content {
  font-size: 18px;
}
.ledtside__overview-content div {
  height: fit-content;
  display: flex;
  margin-bottom: 10px;
}
.ledtside__overview-content p {
  width: 45%;
}

.ledtside__fund-account-title {
  position: relative;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: bolder;
  background-color: #126494;
}
.ledtside__fund-account-title span:nth-child(1) {
}
.ledtside__fund-account-title span:nth-child(2) {
  position: absolute;
  right: 0;
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: #3aade6;
  text-align: center;
}

#leftside__fund-account__chart {
  width: 100%;
  height: calc(100% - 40px);
}

</style>
