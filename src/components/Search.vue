<template>
  <div>
    <div class="search-div">
      <el-select v-model="currentType" size="small" @change="changeType">
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input class="search-input" v-model="title" size="small" @keyup.enter.native="search"></el-input>
      <i class="el-icon-search" @click="search"></i>
    </div>
    <div class="search-result" v-if="result.length > 0">
      <div class="title">查询结果
        <span class="close" @click="closeDiv">×</span>
         <span class="el-icon-document excel" @click="tableToExcel"></span>
      </div>
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
          <!-- <div v-if="currentType === options[1].value">
            <span style="width:225px;">安置点</span>
            <span style="width:220px;">镇</span>
          </div>
          <div v-if="currentType === options[2].value">
            <span style="width:175px;">贫困村</span>
            <span style="width:170px;">安置点</span>
            <span style="width:100px;">镇</span>
          </div> -->
        </div>
        <div class="body">
          <div class="row" v-for="(item,index) in result" :key="index" @dblclick="viewInPosition(item)">
            <div>
              <span style="width:60px;">{{item.name}}</span>
              <span style="width:65px;">{{item.number}}</span>
              <span style="width:60px;">{{item.help}}</span>
              <span style="width:80px;">{{item.reason}}</span>
              <span style="width:100px;">{{item.movetime}}</span>
              <span style="width:80px;">{{item.village}}</span>
            </div>
            <!-- <div v-if="currentType === options[1].value">
              <span style="width:225px;">{{item.resettlement}}</span>
              <span style="width:220px;">{{item.town}}</span>
            </div>
            <div v-if="currentType === options[2].value">
              <span style="width:175px;">{{item.village}}</span>
              <span style="width:170px;">{{item.resettlement}}</span>
              <span style="width:100px;">{{item.town}}</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="foot">
        <el-pagination
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { searchData, searchResettlement, searcVillage } from "../api/api";
export default {
  data() {
    return {
      title: "",
      options: [
        {
          label: "贫困户",
          value: searchData
        },
        {
          label: "安置点",
          value: searchResettlement
        },
        {
          label: "贫困村",
          value: searcVillage
        }
      ],
      tanslate: {
        searchData: "name",
        searchResettlement: "resettlement",
        searcVillage: "village",
        姓名: "name",
        贫困原因: "reason",
        帮助人: "help",
        镇: "town",
        安置点: "resettlement",
        贫困村: "village",
        搬迁时间: "movetime"
      },
      result: [],
      currentType: searchData,
      currentValue: "searchData",
      currentPage: 1,
      pagesize: 10,
      total: 995,
      currentUser:sessionStorage.getItem("username"),
      userObj:{
        'ningqx':'612326',
        'lueyx':'612327'
      },
      currentLevel:'county',
      label:null
    };
  },
  mounted() {
    Bus.$on('search-area',(area,label)=>{
      if(area.substr(-6) === "000000"){
         this.currentLevel = 'county';
      } else if(area.substr(-3) === "000"){
        this.currentLevel = 'town';
      }else {
         this.currentLevel = 'resettlement';
      }
      this.label = label;
    });
    Bus.$on("chart-search", obj => {
      this.currentType = searchData;
      this.currentPage = 1;
       let param = {
        page: this.currentPage,
        rows: this.pagesize
      };
      param[this.tanslate[obj.key]] = obj.value;
      param[this.currentLevel] = this.label.slice(0,this.label.length - 1);
       searchData(param).then(res => {
        this.result = res.list;
        this.total = res.total;
        Bus.$emit("add-search-point", res.list, this.currentValue);
      });
    });
    this.nameList = this.userObj[this.currentUser];
  },
  methods: {
    closeDiv(){
      this.result = [];
      this.title = '';
      Bus.$emit("clear-entity2");
    },
    viewInPosition(item){
      Bus.$emit('set-view',{
        lon:item.old_long,
        lat:item.old_lat,
        range:1000
      })
    },
    changeType() {
      this.result = [];
      this.total = 0;
      Bus.$emit("clear-entity2");
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.search();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },
    buiidParams() {
      let param = {
        page: this.currentPage,
        rows: this.pagesize
      };
       param[this.tanslate[this.currentValue]] = this.title;

      if(this.currentLevel === 'county'){
        param['id_number'] = this.userObj[this.currentUser];
      } else {
        param[this.currentLevel] = this.label.slice(0,this.label.length - 1);

      }
      return param;
    },
    getData() {
      if (this.currentType === this.options[0].value) {
        this.currentValue = "searchData";
      } else if (this.currentType === this.options[1].value) {
        this.currentValue = "searchResettlement";
      } else {
        this.currentValue = "searcVillage";
      }
      Bus.$emit("clear-entity2");
      const param = this.buiidParams();
      searchData(param).then(res => {
        this.result = res.list;
        this.total = res.total;
        Bus.$emit("add-search-point", res.list, this.currentValue);
      });
    },
    search() {
      if (this.title.trim() === "") {
        this.changeType();
        return;
      }
      this.currentPage = 1;
      this.getData();
    },
    tableToExcel(){
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let str = `id,镇,村,户主,户主身份证号,家庭人数,建档时间,贫困原因,帮扶人,住房面积,旧址纬度,旧址经度,安置点,搬迁时间,新址纬度,新址经度\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for(let i = 0 ; i < this.result.length ; i++ ){
        for(let item in this.result[i]){
          if(!['page','rows'].includes(item)){
            str+=`${this.result[i][item] + '\t'},`;   
          }  
        }
        str+='\n';
      }
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      var link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download =  "贫困户数据.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }
};
</script>

<style scoped>
</style>
