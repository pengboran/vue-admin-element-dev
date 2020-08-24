<template>
    <div :id="id" class="dashboard-bar" :style="{width: '600px', height: '500px'}"></div>
</template>
<script>
export default {
    name:'bar',
    props:{
        id:{
            type:String
        }
    },
    data(){
        return {

        }
    },
    mounted(){
       this.drawLine()
    },
    methods:{
        drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.id));
      // 绘制图表
      myChart.setOption({
        title: {
          //标题
          text: "菜品销售排行数据",
          show: true,
          subtext: "食物中的美好时光,销售单位万/份", //副标题
          textStyle: {
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily:"Courier New"
          },
        },
        tooltip: {},
        xAxis: {
          data: [
            "红烧猪蹄",
            "澳洲龙虾",
            "北京烤鸭",
            "鹿肉火烧",
            "大白",
            "鸭血粉丝汤",
          ],
          nameTextStyle: {
            //这个文字颜色设置好像无效
            color: "#000",
          },
          axisLine: {
            //设置坐标轴文字颜色
            lineStyle: {
              color: "#FFFFFF",
            },
          },
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
            showBackground:true,
            backgroundStyle:{
                color:'#50514F'
            },
            emphasis:{
                itemStyle:{
                    
                }
            },
            label:{
                backgroundColor:'rgba(0,23,11,0.3)'
            },
            color:['#759aa0','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
          },
        ],
        textStyle: {
          //设置全局文字样式
          color: "#FFFFFF",
        },
      });
    },
    }
}
</script>
<style lang="scss" scoped>

</style>