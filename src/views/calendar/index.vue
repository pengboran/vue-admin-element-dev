<template>
  <div class="container">
    <full-calendar ref="calendar" :config="config" :events="events"></full-calendar>
  </div>
</template>

<script>
import { FullCalendar } from 'vue-full-calendar'
import "fullcalendar/dist/fullcalendar.css";
export default {
  components: {},
  data() {
    return {
          config: {
         header:{
            left: 'prev,next today',
            center: 'title',
            right: 'month,list'
          },
          buttonText: {today: "今天",month:'月', list: "日程" },
          // header:false,
          locale: "zh-cn",
          defaultView: "month", //显示默认视图
          //weekMode: 'liquid',
          // weekNumbers: true, // 是否在日历中显示周次(一年中的第几周)
          // height: 'auto',
          timeFormat: 'HH:mm',
          editable:true,
          navLinks: true,       // can click day/week names to navigate views
          eventLimit: 3,        // 限制一天中显示的事件数，默认false
          allDayText: '排班',   // 日历上显示全天的文本
          selectable: true,     // 允许用户通过单击或拖动选择日历中的对象，包括天和时间。
          selectHelper: false,  // 当点击或拖动选择时间时，显示默认加载的提示信息，该属性只在周/天视图里可用。
          unselectAuto: true,   // 当点击页面日历以外的位置时，自动取消当前的选中状态。
          eventBackgroundColor: '#3a87ad',    // 设置日程事件的背景色
          select: this.selectHandler,
          eventClick:this.eventClick,
          unselect:this.unselect
       },
       events: [{
          title: '事件内容',  // 事件内容
          start: '2020-03-23 09:00:00', // 事件开始时间
          end: '2020-03-23 12:00:00',   // 事件结束时间
          color: 'rgba(9, 9, 9, 0.2)'       // 事件的显示颜色
        }],
    };
  },
  components: {
    FullCalendar,
  },
  computed: {},
  methods: {
   selectHandler(start, end, allDay){
      let startFormat = this.$moment(start).format('YYYY-MM-DD');
      let endFormat = this.$moment(end).format('YYYY-MM-DD');
      console.log('from === ' +startFormat + '====to === '+endFormat +'====allDay===='+allDay);

      //添加日历
      var json = {
        title: "张三" + ' - ' + "夜班",
        text: "张三",
        allDay: allDay,
        backgroundColor: "#3a87ad",
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      };
      this.events.push('renderEvent', json, true);
           this.$notify({
        title: "成功",
        message: "添加成功",
        type: "success",
      });
  },
  unselect(view, jsEvent) {
     console.log(jsEvent)
  },
     // 更新排班 点击事件
    eventClick(calEvent, jsEvent, view){
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      console.log('calEvent === ' +calEvent + '====jsEvent === '+jsEvent +'====view===='+view);

    }
  },
};
</script>
<style lang='scss' scoped>
</style>