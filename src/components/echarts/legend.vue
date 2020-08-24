<template>
  <!-- 图例组件 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。-->
  <div id="ech-legend" :style="{width:'800px',height:'500px'}"></div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
        data: Object
    };
  },
  mounted(){
      this.drawLegend()
  },
  computed: {

  },
  methods: {
    drawLegend() {
       let list = [
          '食材开销','员工工资','店面租金','员工工装费','员工福利','宴请来宾','水电费','日常送洗','易耗品','维修费','会议费','差旅费'
      ]
      let seriesData = [],//series里的data 也就是饼图 里面要展示的数据
          selected = {}      //legend图例初始化显示的数据
      for(var i = 0;i < list.length;i++){
          var name = list[i]
          seriesData.push({
              name:name,
              value: Math.round(Math.random() * 100000),
          })
          selected[name] = i < 6; //初始化显示6个
      }
      let myEchart = this.$echarts.init(document.getElementById("ech-legend"));
      myEchart.setOption({
        title: {
          text: "公司各项支出",
          subtext: "纯属虚构",
          left: "center",
          textStyle:{
              color:'#FFF'
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}元 ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          right: 10,
          top: 50,
          bottom: 20,
          data: list, //人员名字 即展示在图标上方
          selected: selected,//图例选中状态表。
          textStyle:{   //图例的公用文本样式。
              color:'#fff'
          },
           icon:'roundRect', //图例的形状 可自定义图标
           pageIconColor: '#FFF',//翻页按钮的颜色
           pageTextStyle:{ //翻页显示的数字 的颜色
               color:'#FFF'
           },
           inactiveColor:'#000' //图例没选中时 即关闭时的颜色 默认是ccc
          //  backgroundColor:'#000' //图例的背景色 默认透明
        },
        series: [
          {
            name: "费用",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "#fff",
              },
            },
          },
        ],
        textStyle:{
            color:'#fff'
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>