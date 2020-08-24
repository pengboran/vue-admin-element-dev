<template>
    <div id="chart-map"></div>
</template>
<script>
export default {
    name:'chinaMap',
    data(){
        return {

        }
    },
    mounted(){
         this.chinaConfigure();
    },
    methods:{
          // 绘制中国地图
    chinaConfigure() {
      let myChart = this.$echarts.init(document.getElementById("chart-map")); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({
        // 进行相关配置
        tooltip: {
          backgroundColor: "#240B36",
        }, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 1000,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["#FBD786"],
        },
        visualMap: {
          color: "#000",
        },
        geo: {
          // 这个是重点配置区
          map: "china", // 表示中国地图
          roam: true,
          // center: [115.97, 30.71],
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: "rgba(0,0,0,0.4)",
              },
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              areaColor: "#24cbff", //鼠标移动到地图区域 该区域显示的背景色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
        series: [
          {
            name:'成都',
            type: "scatter",
            coordinateSystem: "geo", // 对应上方配置
            markPoint: {    //定义标注
              symbol: "pin",
              symbolSize: 30, //标注图标大小
              data: [
                {
                  // name: "成都",
                  coord: [104.066143,30.573095],//标注地点的经纬度
                  runConut: "50",
                  num: "120",
                },
              ],
            },
          },
          {
            name: "销量排行", // 浮动框的标题
            type: "map",
            geoIndex: 0,
            data: [
              {
                name: "四川",
                value: 205,
              },
              {
                name: "湖北",
                value: 453,
              },
            ],
          },
        ],
      });
    },
    }
}
</script>
<style lang="scss" scoped>
#chart-map{
   width: 100%;
   height: 500px;
   display: flex;
   justify-content: center;
}
</style>