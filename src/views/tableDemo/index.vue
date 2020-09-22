<template>
  <div class="container">
    <div class="filter-container">
      <el-input v-model="searchValue" placeholder="请输搜索的入内容" class="searchInput"></el-input>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        :loading="downloadLoading"
      >导出</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table :data="tableData" stripe border highlight-current-row style="width:100%" fit>
      <el-table-column label="序号" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职日期" prop="date" width="180px" align="center"></el-table-column>
      <el-table-column label="姓名" prop="name" width="100px" align="center"></el-table-column>
      <el-table-column label="部门" prop="section" width="120px" align="center"></el-table-column>
      <el-table-column label="年龄" prop="age" width="120px" align="center"></el-table-column>
      <el-table-column label="描述" prop="dec" width="300px" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogStatus === 'create'?'添加':'编辑'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="入职日期">
          <el-date-picker v-model="form.date" type="datetime" placeholder="选择一个日期" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="section">
          <el-input v-model="form.section" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.dec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
export default {
  components: {},
  data() {
    return {
      searchValue: "",
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      form: {
        date: "",
        id: undefined,
        name: "",
        section: "",
        age: "",
        dec: "",
      },
      formLabelWidth: "120px",
      rules: {
        name: [
          { required: true, message: "名字必填", trigger: "change" },
        ],
        section: [
          {
            required: true,
            message: "描述必填",
            trigger: "change",
          },
        ],
        age: [
          { required: true, message: "年龄必填", trigger: "blur" },
        ],
      },
      tableData: [
        {
          date: "2020-08-27 20:43",
          id: "1",
          name: "小王",
          section: "研发中心",
          dec: "Fdfblgwc Jhvzfkw Vlqesy Lnyz Rsasjd Xybjit Myzwvilx Nuqu Vyvbs",
          age: "24",
        },
        {
          date: "1999-01-04 15:19",
          id: "2",
          name: "小张",
          section: "研发中心",
          dec: "Fdfblgwc Jhvzfkw Vlqesy Lnyz Rsasjd Xybjit Myzwvilx Nuqu Vyvbs",
          age: "25",
        },
        {
          date: "2020-08-27 15:36",
          id: "3",
          name: "小胖",
          section: "研发中心",
          dec: "Fdfblgwc Jhvzfkw Vlqesy Lnyz Rsasjd Xybjit Myzwvilx Nuqu Vyvbs",
          age: "28",
        },
        {
          date: "2020-08-27",
          id: "4",
          name: "小李",
          section: "研发中心",
          dec: "Fdfblgwc Jhvzfkw Vlqesy Lnyz Rsasjd Xybjit Myzwvilx Nuqu Vyvbs",
          age: "29",
        },
      ],
    };
  },
  computed: {},
  methods: {
    // 编辑
    handEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.form = Object.assign({}, row); // copy obj
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
      });
    },
    //   导出表格
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["日期", "姓名", "部门", "描述", "年龄"];
        const filterVal = ["date", "name", "section", "dec", "age"];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-down",
        });
        console.log(data);
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === "date") {
            return parseTime(v[j]); 
          } else {
            return v[j];
          }
        })
      );
    },
    resetTemp() {
      this.form = {
        date: "",
        id: undefined,
        name: "",
        section: "",
        age: "",
        dec: "",
      };
    },
    // 添加按钮
    handleCreate() {
      this.resetTemp(); // 置空表单
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();// 置空校验
      });
    },
    // 确定创建
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.form.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // createArticle(this.temp).then(() => { // 请求添加接口
      
          // });
            this.form.date = parseTime(+new Date(this.form.date));
            this.tableData.unshift(this.form);
            console.log(this.form)
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
        }
      });
    },
    // 确定修改
    updateData() {
      const tempData = Object.assign({}, this.form); // 将form对象深度复制给tempata
      tempData.date = parseTime(+new Date(tempData.date)); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464 将选择的时间转化为毫秒
      const index = this.tableData.findIndex((v) => v.id === this.form.id);
      this.form.date = tempData.date;
      this.tableData.splice(index, 1, this.form);
      this.dialogFormVisible = false;
      console.log(this.form);
      this.$notify({
        title: "成功",
        message: "更新成功",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.container {
  width: 70%;
  padding: 20px;
  margin: 0 auto;
  .filter-container {
    width: 50%;
    margin-bottom: 20px;
    .searchInput {
      width: 200px;
    }
  }
}
</style>