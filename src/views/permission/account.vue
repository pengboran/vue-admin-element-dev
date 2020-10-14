<template>
  <div class="container">
    <div class="filter-container">
      <el-input
        v-model="searchValue"
        placeholder="请输搜索的名字"
        class="searchInput"
        @keyup.enter.native="serch"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="serch">搜索</el-button>
      <!-- <el-button
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        :loading="downloadLoading"
      >导出</el-button> -->
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-permission="['admin1']"
        >添加</el-button
      >
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      highlight-current-row
      style="width: 100%"
      fit
      v-loading="listLoading"
    >
      <el-table-column label="序号" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账号"
        prop="userId"
        width="200px"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        label="入职日期"
        prop="date"
        width="200px"
        align="center"
      ></el-table-column> -->
      <el-table-column
        label="姓名"
        prop="userName"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="电话"
        prop="phoneNumber"
        width="200px"
        align="center"
      ></el-table-column>
      <el-table-column label="部门" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orgName || "研发中心" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="300px" align="center">
        <template slot-scope="scope">
          <span
            type="info"
            v-for="(item, index) in scope.row.roleNameList"
            :key="index"
            >{{ scope.row.roleNameList.length == 1 ? item : item + "/" }}</span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户类型" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{
            scope.row.userType == 0 ? "普通用户" : "管理员"
          }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogStatus === 'create' ? '添加' : '编辑'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="入职日期">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            placeholder="选择一个日期"
          />
        </el-form-item> -->
        <el-form-item label="账号" prop="userId">
          <el-input
            v-model="form.userId"
            autocomplete="off"
            :disabled="dialogStatus === 'create' ? false : true"
            placeholder="输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model="form.userName"
            autocomplete="off"
            placeholder="输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input
            v-model="form.phoneNumber"
            autocomplete="off"
            placeholder="输入电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="orgRankId">
          <!-- <el-select v-model="form.orgName" placeholder="请选择部门">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.display_name"
            />
          </el-select> -->
          <!-- <el-select v-model="mineStatus" placeholder="请选择" multiple collapse-tags @change="selectChange">
                <el-option  :value="mineStatusValue" style="height: auto">
       	          <el-tree :data="calendarTypeOptions" show-checkbox accordion node-key="id" ref="tree" highlight-current :props="defaultProps" @check-change="handleCheckChange"></el-tree>
	             </el-option>
          </el-select> -->
          <el-cascader
            v-model="form.orgRankId"
            :options="calendarTypeOptions"
            :props="defaultProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <!-- 人员拥有的角色字段为数组类型 才能显示默认 -->
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="请选择角色标签"
          >
            <el-option
              v-for="(item, index) in allRoles"
              :key="'info-' + index"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户属性" prop="userType" label-width="100px">
          <el-radio-group v-model="form.userType">
            <el-radio :label="num1">普通用户</el-radio>
            <el-radio :label="num2">管理员</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getUserList"
    />
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import {
  getUserList,
  getRolesList,
  getOrganization,
  changeAccount,
  addAccount,
  deleteAccount,
} from "@/api/permissions/permissions";
export default {
  components: {},
  data() {
    return {
      num1: 0,
      num2: 1,
      searchValue: "", // 搜索值
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      listLoading: true,
      disabledId: false,
      defaultProps: {
        children: "children",
        label: "orgName",
        value: "id",
        checkStrictly: true, // 任意选择一项
        expandTrigger: "hover",
      },
      mineStatus: "",
      mineStatusValue: [],
      form: {
        identitycard: "",
        userName: "",
        phoneNumber: "",
        orgId: "",
        userId: "",
        orgRankId: [], //组织机构层级id数组
        userType: "",
        roleIds: [], // 角色Id数组
      },
      total: 0, // 人员信息接口总的数据条数
      listQuery: {
        page: 1,
        pageSize: 20,
      },
      tableData: [], // 人员表格数据
      otableData:[],
      calendarTypeOptions: [], // 可选的所有部门
      allRoles: [], // 可选的所有角色
      formLabelWidth: "120px",
      rules: {
        userId: [{ required: true, message: "账号必填", trigger: "change" }],
        userName: [{ required: true, message: "名字必填", trigger: "change" }],
        phoneNumber: [
          { required: true, message: "电话必填", trigger: "change" },
        ],
        orgRankId: [{ required: true, message: "部门必填", trigger: "change" }],
        roleIds: [{ required: true, message: "角色必填", trigger: "change" }],
        // userType: [
        //   { required: true, message: "用户属性必填", trigger: "change" },
        // ],
      },
      addList: ["admin1"], // 可操作添加按钮的角色列表 前端定义
    };
  },
  created() {
    this.getUserList();
    this.getroleList();
    this.getOrganization();
  },
  computed: {
    checkAdd() {
      return JSON.parse(localStorage.getItem("roleIdList")).some((role) =>
        this.addList.includes(role)
      );
    },
  },
  methods: {
    // 获取组织机构用于 部门选择 为一个树结构
    getOrganization() {
      getOrganization().then((res) => {
        this.calendarTypeOptions = this.getTreeData(res.data.content.children);
        // console.log(res.data.content.children);
      });
    },
    // children为空时设置为undefined 解决级选择器出现空白选项的问题
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = null;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 获取部门选择器选择的值
    handleChange(value) {
      console.log(value);
      console.log(this.form);
    },
    //获取人员列表
    getUserList() {
      this.listLoading = true;
      getUserList(this.listQuery).then((res) => {
        this.tableData = res.data.content;
        this.otableData = res.data.content;
        this.total = res.data.pagination.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1500);
      });
    },
    // 获取所有角色列表
    getroleList() {
      getRolesList().then((res) => {
        this.allRoles = res.data.content;
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
    resetform() {
      this.form = {
        identitycard: "",
        userName: "",
        phoneNumber: "",
        orgId: "",
        userId: "",
        orgRankId: [], //组织机构层级id数组
        userType: "",
        roleIds: [], // 角色Id数组
      };
    },
    // 搜索
    serch(){
         this.tableData = this.otableData.filter( item => (~item.userName.indexOf(this.searchValue))) 
    },
    // 点击 编辑
    handEdit(index, row) {
      // console.log(index, row);
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.form = Object.assign({}, row); // copy obj
    },
    // 点击添加按钮
    handleCreate() {
      // console.log( this.form)
      this.resetform(); // 置空表单
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); // 置空校验
      });
    },
    // 添加数据
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //this.form.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.form.date = parseTime(+new Date(this.form.date));
          //this.tableData.push(this.form); // 添加数据到页面不请求
          console.log(this.form);
          this.form.orgId = this.form.orgRankId[this.form.orgRankId.length - 1];
          this.form.identitycard = "420923199601015236"; // 暂时默认
          addAccount(this.form)
            .then(res => {
              if (res.data.success) {
                this.getUserList();
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
              }
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: err.data.message,
              });
            });
        }
      });
    },
    // 修改数据
    updateData() {
      //const tempData = Object.assign({}, this.form); // 将form对象深度复制给tempata
      //tempData.date = parseTime(+new Date(tempData.date)); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464 将选择的时间转化为毫秒
      const index = this.tableData.findIndex((v) => v.id === this.form.id); // 找到当前索引
      // this.form.date = tempData.date;
      // this.tableData.splice(index, 1, this.form);
      this.form.orgId = this.form.orgRankId[this.form.orgRankId.length - 1];
      // const putData = {
      //     email:this.form.email,
      //     id:this.form.id,
      //     orgId:this.form.orgId,
      //     phoneNumber:this.form.phoneNumber,
      //     roleIds:this.form.roleIds,
      //     userName:this.form.userName,
      //     userType:this.form.userType
      // }
      //console.log(this.form);
      // 修改请求
      changeAccount(this.form)
        .then(res => {
          if (res.data.success) {
            this.getUserList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: err.data.message,
          });
        });
    },
    // 删除
    handleDelete(index, row) {
      // this.tableData.splice(index, 1);
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAccount({ id: row.id })
            .then(res => {
              if (res.data.success) {
                this.getUserList();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: err.data.message,
              });
            });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
      // console.log(row);
    },
  },
};
</script>
<style lang='scss' scoped>
.container {
  width: 100%;
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