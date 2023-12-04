<template>
  <div class="Echarts">
    <div id="main" style="width: 1000px; height: 800px"></div>
  </div>
</template>
<script>
import{SelectPro} from "@/api/system/tu"
export default {
  name: "Echarts",
  data(){
    return{
      list:[]
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
        SelectPro().then((response) => {
          this.list = response.rows;
          this.myEcharts()
        });
      },
    myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      //配置图表
      var option = {
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data:this.list.map(z=>z.month)
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data:this.list.map(z=>z.num)
          },
        ],
      };
      myChart.setOption(option);
    },
  },
 
};
</script>
 
 
 