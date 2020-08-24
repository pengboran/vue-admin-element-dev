<template>
  <div class="dashboard-container">
    <div class="boxName">{{ getName }}<span><i class="icon-touxiang iconfont"></i></span></div>
    <el-button type="primary" @click="setName">改变name</el-button>
    <!-- 中国地图 -->
    <china-map></china-map>
    <!-- 柱状图 -->
    <div class="echart-box">
      <bar id="bar1"></bar>
      <!-- 数据区域缩放组件 -->
      <data-zoom></data-zoom>
      <!-- 图例组件 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。-->
    </div>
    <div class="echart-box legend">
      <echart-Legend></echart-Legend>
    </div>
    
  </div>
  
</template>

<script>
import { mapGetters,mapState , mapMutations} from 'vuex';
import { mutations } from '@/store/modules/user.js';
import "../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
import bar from "@/components/echarts/bar";
import chinaMap from "@/components/echarts/chinaMap";
import dataZoom from "@/components/echarts/dataZoom";
import echartLegend from "@/components/echarts/legend"
export default {
  name: "Dashboard",
  computed: {
    // 通过mapGetters将getters中的值映射到组件中，当组件需要获取多个状态值时 建议使用辅助函数
  ...mapGetters([
  'name',
  'token'
  ]),
  // 通过属性访问
  getName(){
    return this.$store.state.user.name  // or this.$store.getters.name
  },
  // ...mapState([
  //    'name'
  // ])
  },
  data() {
    return {
      
    };
  },
  components: {
    bar,
    chinaMap,
    dataZoom,
    echartLegend
  },
  mounted() {},
  methods: {
    setName(){
      // vuex如果分为几个模块，方法是在模块中的话，如果直接在组件中通过this.$store.commit("方法名")是获取不到，必须要在前面加上模块名，如this.$store.commit("模块名/方法名")才可以获取到
        this.$store.commit('user/SET_NAME', 'pengboran')
        console.log(this.$store.state.user.name)
        console.log(this.$store.state.user)
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    width: 100%;
  }
}
.echart-box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 100px;
}
.legend{
  margin-top: 100px;
}
</style>
