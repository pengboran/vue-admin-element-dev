<template>
  <div class="app-container">
      <div class="headNavigation">
      <!-- 选择负责范围 -->
    <div class="clients">
      <span>客户</span>
      <el-select v-model="value" placeholder="请选择" @change="changeSelect">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 选择业务类型 -->
     <div class="clients">
      <span>业务类型</span>
      <el-select v-model="value" placeholder="请选择" @change="changeSelect">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      value:'',
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  computed: {},
  methods: {
    //   下拉框选中时的事件
      changeSelect(data){
          console.log(data)
      }
  },
};
</script>
<style lang='scss' scoped>
.headNavigation{
    display: flex;
}
.clients{
   margin-right: 15px;
}
</style>