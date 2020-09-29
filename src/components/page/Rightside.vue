<template>
  <div class="rightside-wrapper">
    <div class="rightside-container">
    	
			<div class="rightside-fund">
				<div class="rightside-fund-title">
					<span>财政分配资金</span>
					<span>></span>
				</div>
				<div class="rightside-fund__total-account">
					<p>总数（万元）</p>
					<p>{{total}}</p>
				</div>

				<div class="rightside-fund-overflow">
					<div class="rightside-fund-layout">
						<div class="rightside-fund-content" 
							v-for="(item, index) in fundDataList" 
							:key="item.id" 
							@mouseover="showDetail(item)"
							@mouseleave="hideDetail(item)">
							<p class="rightside-fund-content__info">
								<span>{{ item.name }}</span>
								<span>{{ item.value }}%</span>
							</p>
							<p class="progress">
								<span :style="{
									width: '100%', 
									height: '5px', 
									backgroundColor: '#126399', 
									display: 'inline-block', 
									position: 'absolute'}">
								</span>
								<span :style="{
									width: Math.floor(220 * (item.value / 100)) + 'px', 
									height: '5px', 
									backgroundColor: '#3aade6', 
									display: 'inline-block',
									position: 'absolute'}" 
									class="current-progress">
								</span>
							</p>

							<div class="detail" v-if="item.show">
								<p>项目总量：{{item.total}}个</p>
								<p>财政分配资金：{{item.Data}}万元</p>
								<p>支付总额：{{item.Pay}}万元</p>
								<p>支付率：{{item.PayRate}}%</p>
							</div>

						</div>
					</div>
				</div>

			</div>

			<div class="rightside-overview">
				<div class="rightside-overview-title">
					<span>项目总览</span>
					<span @click="linkTo">></span>
				</div>	
				<div id="project-statistics-chart"></div>		
				<div class="project-statistics-chart-total-account">
					<p>项目总数</p>
					<p>{{project_total}}个</p>
				</div>	
			</div>

    </div>
  </div>
</template>

<script>

import echarts from 'echarts'

export default {
  name: "Rightside",
  components: {

  },
  data() {
  	return {
			fundDataList: [],
			fundDataList_list:[],
			color: ['#3aade6', '#47e1ad', '#ffdb4d', '#ff844d'],
			total:113158.0534,
			project_total:243,
			total_list:[113158.0534,16224.44],
			project_total_list:[243,88],
			showid:0
  	}
  },
  mounted() {
  	this.axios.get('../../../static/sampleData/right-1.json').then(res => {
			this.fundDataList_list[0] = res.data;
			this.fundDataList=this.fundDataList_list[0]
		})
		this.axios.get('../../../static/sampleData/right-2.json').then(res => {
  		console.log(res);
  		this.fundDataList_list[1] = res.data;
  	})

		this.drawProjectStatistics();
		Bus.$on("fundaccount_show",id=>{
			this.showid=id
			this.total=this.total_list[id]
			this.project_total=this.project_total_list[id]
			this.fundDataList=this.fundDataList_list[id]
			this.drawProjectStatistics();
		})
  },
  methods: {
  	linkTo() {
  		this.$router.push({
  			path: '/index1'
  		})
  	},
  	showDetail(item) {
		  item.show = true;
  		this.fundDataList.splice(item.id, 1, item);
  	},
  	hideDetail(item) {
  		item.show = false;
  		this.fundDataList.splice(item.id, 1, item);  		
  	},
  	drawProjectStatistics() {
			let chart = echarts.init(document.getElementById('project-statistics-chart'));
			chart.clear();
			let datas=[
				[
					{value: 194, name: '其他'},
					{value: 4, name: '低保政策兜底一批'},
					{value: 8, name: '医疗救助解困一批'},
					{value: 19, name: '教育扶智帮助一批'},
					{value: 10, name: '扶持生产发展一批'},
					{value: 1, name: '移民搬迁安置一批'},
					{value: 5, name: '转移就业扶持一批'},
					{value: 2, name: '生态补偿脱贫一批'},
					{value: 0, name: '边贸政策扶助一批'}
				],
				[
					{value: 76, name: '其他'},
					{value: 0, name: '低保政策兜底一批'},
					{value: 0, name: '医疗救助解困一批'},
					{value: 2, name: '教育扶智帮助一批'},
					{value: 8, name: '扶持生产发展一批'},
					{value: 0, name: '移民搬迁安置一批'},
					{value: 2, name: '转移就业扶持一批'},
					{value: 0, name: '生态补偿脱贫一批'},
					{value: 0, name: '边贸政策扶助一批'}
				]
			]
			let data=datas[this.showid]
			let option = {
				color: this.color,
		    tooltip: {
	        trigger: 'item',
	        formatter: '{b}<br/>{c} ({d}%)',
	        transitionDuration: 0
		    },
		    // legend: {
	     //    orient: 'horizontal',
	     //    left: 10,
	     //    data: ['其他', '低保政策兜底一批', '医疗救助解困一批', '教育扶智帮助一批', '扶持生产发展一批', '移民搬迁安置一批', '转移就业扶持一批', '生态补偿脱贫一批', '边贸政策扶助一批'],
	     //    textStyle: {
      //       color: '#ffffff'
      //     }
		    // },
		    series: [
	        {
            name: '访问来源',
            type: 'pie',
            center: ['60%', '60%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: true,
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            data: data
	        }
		    ]
			};

			chart.setOption(option);
  	}
  }
}

</script>

<style scoped>

.rightside-wrapper{
	width: 17%;
	height: calc(100% - 72px);
	background-color: #003459;
	float: right;
}
.rightside-container{
	width: 100%;
	height: 100%;
	/*background-color: #0a4b7a;*/
}

.rightside-fund{
	width: calc(100% - 10px);
	height: calc(67% - 5px);
	background-color: #0a4b7a;
	margin: 0 5px 5px;
}
.rightside-overview{
	width: calc(100% - 10px);
	height: 33%;
	background-color: #0a4b7a;
	margin: 0 5px;	
	position: relative;
}

.rightside-fund__total-account{
	padding: 10px 10px 0;
}
.rightside-fund__total-account p:nth-child(1){
	font-size: 18px;
}
.rightside-fund__total-account p:nth-child(2){
	font-size: 22px;
	color: #ffd633;
	font-weight: bolder;
}

.rightside-fund-title, .rightside-overview-title{
	position: relative;
	height: 40px;
	line-height: 40px;
	padding-left: 10px;
  font-size: 20px;
  font-weight: bolder;
	background-color: #126494;	
}
.rightside-fund-title span:nth-child(1){

}
.rightside-fund-title span:nth-child(2), .rightside-overview-title span:nth-child(2){
	position: absolute;
	right: 0;
	display: inline-block;
	width: 40px;
	height: 40px;
	background-color: #3aade6;
	text-align: center;
}
.rightside-fund-overflow{
	overflow: auto;
  width: 100%;
  height: calc(100% - 81px);
}
.rightside-fund-layout{
	padding: 10px;
}
.rightside-fund-content{
	width: 100%;
	height: 52px;
	font-size: 18px;
	position: relative;
}
.rightside-fund-content__info span:nth-child(1){
	float: left;
}
.rightside-fund-content__info span:nth-child(2){
	float: right;
}
.rightside-fund-content .progress{
	position: relative;
	top: -28px;
	width: 100%;
	height: 5px;
}

#project-statistics-chart{
	width: 100%;
	height: calc(100% - 40px);
}
.project-statistics-chart-total-account{
	position: absolute;
  top: calc(50% - -17px);
  left: calc(50% - 6px);
	text-align: center;
	font-size: 18px;
}

.detail{
	background-color: #003459;
  padding: 10px;
  z-index: 10;
  position: relative;
}

</style>
