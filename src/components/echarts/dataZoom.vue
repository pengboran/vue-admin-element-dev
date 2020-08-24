<template>
  <div id="dataZoom" :style="{width:'600px',height:'500px'}"></div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.drawZoom();
  },
  computed: {},
  methods: {
    drawZoom() {
      //创建dataZoom 数据区域缩放组件
      let myChart = this.$echarts.init(document.getElementById("dataZoom"));
      myChart.setOption({
        title: {
          text: "每年销售增长点数",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "axis",//坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "红烧猪蹄",
            "澳洲龙虾",
            "北京烤鸭",
            "鹿肉火烧",
            "大白",
            "鸭血粉丝汤",
            "麻婆豆腐",
            "回锅肉",
            "红烧肉",
            "宫保鸡丁",
            "玉带虾仁",
            "油发豆莛",
          ],
        },
        yAxis: {
          type: "value",
        },
        dataZoom: [
          {
            //dataZoom组件默认控制x轴
            type: "slider", //类型为slider
            start: 10, //左边在10%的位置
            end: 60, //右边在60%的位置
          },
          {
            // 这个dataZoom组件，也控制x轴。
            type: "inside", // 这个 dataZoom 组件是 inside 型 dataZoom 组件,移动端可双指放大 缩小
            start: 10, // 左边在 10% 的位置。
            end: 60, // 右边在 60% 的位置。
          },
        ],
        series: [
          {
            type: "line", //这个是散点图
            itemStyle: {
              opacity: 0.8,
              color: "red",
            },
            showSymbol: true,
            symbol: "rect",
            symboSize: function (val) {
              return val[5] * 40;
            },
            data: [5, 15, 20, 15, 10, 205, 15, 20, 15, 10, 20, 120],
          },
        ],
        textStyle: {
          //设置全局文字样式
          color: "#FFFFFF",
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>