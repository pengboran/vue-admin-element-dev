<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAddRole"
      >新建部门</el-button
    >
    <!-- 部门以表格 下拉树 形式 展示 -->
    <el-table
      ref="table"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="calendarTypeOptions"
      row-key="id"
      v-loading="listLoading"
      highlight-current-row
      fit
      stripe
      border
      style="margin-top: 20px"
    >
      <!-- 选择框 -->
      <!-- <el-table-column :selectable="checkboxT" type="selection" width="55" /> -->
      <el-table-column
        label="部门名称"
        prop="orgName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="部门等级"
        prop="orgLevel"
        align="center"
      ></el-table-column>
      <el-table-column
        label="部门代码"
        prop="orgCode"
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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

    <!-- 编辑弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="编辑" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="部门id值" prop="id">
          <el-input v-model="form.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input v-model="form.orgName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门等级" prop="orgLevel">
          <el-input v-model="form.orgLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门代码" prop="orgCode">
          <el-input v-model="form.orgCode" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog title="添加" :visible.sync="dialogAddVisible">
      <el-form
        :model="formData"
        ref="dataFormAdd"
        :rules="rulesAdd"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="组织机构代码" prop="orgCode">
          <el-input
            v-model="formData.orgCode"
            autocomplete="off"
            placeholder="填写组织机构代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门等级" prop="orgLevel">
          <el-input
            v-model="formData.orgLevel"
            autocomplete="off"
            placeholder="填写部门等级"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名字" prop="orgName">
          <el-input
            v-model="formData.orgName"
            autocomplete="off"
            placeholder="填写部门名字"
          ></el-input>
        </el-form-item>
        <el-form-item label="顶级部门">
          <el-radio-group v-model="formData.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formData.isTop === '0'"
          style="margin-bottom: 0"
          label="上级部门"
          prop="parentId"
        >
          <treeselect
            v-model="formData.parentId"
            :options="depts"
            :normalizer="normalizer"
            style="width: 370px"
            placeholder="选择上级部门"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrganization,
  changeOrganization,
  deleteOrganization,
  addOrganization,
} from "@/api/permissions/permissions";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {},
  data() {
    return {
      calendarTypeOptions: [],
      dialogFormVisible: false,
      dialogAddVisible: false,
      listLoading: true,
      form: {
        id: null,
        orgCode: "",
        orgLevel: "",
        orgName: "",
      },
      rules: {
        orgName: [
          { required: true, message: "部门名字必填", trigger: "change" },
        ],
        orgCode: [
          { required: true, message: "部门代码必填", trigger: "change" },
        ],
      },
      depts: [],
      formData: {
        parentId: null,
        orgCode: "",
        orgLevel: "",
        orgName: "",
        isTop: "",
      },
      rulesAdd: {
        orgName: [
          { required: true, message: "部门名字必填", trigger: "change" },
        ],
        orgLevel: [
          { required: true, message: "部门类型必填", trigger: "change" },
        ],
        orgCode: [
          { required: true, message: "部门代码必填", trigger: "change" },
        ],
      },
    };
  },
  components: { Treeselect },
  computed: {},
  created() {
    this.getOrganization();
  },
  methods: {
    getOrganization() {
      this.listLoading = true;
      getOrganization().then((res) => {
        this.calendarTypeOptions = this.getTreeData(res.data.content.children);
        this.depts = res.data.content.children;
        setTimeout(() => {
          this.listLoading = false;
        }, 1500);
      });
    },
    // children为空时设置为undefined 解决级选择器出现空白选项的问题
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children === []) {
          // children若为空数组，则将children设为undefined
          data[i].children = null;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    normalizer(node) {
      //将里面children=[]为空的时候去掉（如果不加的这句的话 如果里面children属性值为空 数状选择器里就给他默认有下一层  可里面没有所以显示空数据）
      if (node.children && !node.children.length) {
        delete node.children;
      }
      // 将后台传来的数组进行修改
      return {
        id: node.id,
        label: node.orgName,
        children: node.children,
      };
    },
    // 点击增加
    handleAddRole() {
      this.dialogAddVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormAdd"].clearValidate(); // 置空校验
      });
    },
    // 提交增加
    addData() {
      this.$refs["dataFormAdd"].validate((valid) => {
        if (valid) {
          this.formData.parentId = this.formData.isTop == "1" ? 100000 : this.formData.parentId;
          addOrganization(this.formData).then((res) => {
            if (res.data.success) {
              this.dialogAddVisible = false;
              this.getOrganization();
              this.$message({
                type: "success",
                message: "添加成功!",
              });
            }
          });
        }
      });
    },
    // 编辑
    handEdit($index, row) {
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row); // copy obj
    },
    // 更新编辑
    updateData() {
      changeOrganization(this.form).then((res) => {
        if (res.data.success) {
          this.dialogFormVisible = false;
          this.getOrganization();
          this.$message({
            type: "success",
            message: "更新成功!",
          });
        }
      });
    },
    // 删除
    handleDelete($index, row) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOrganization({ id: row.id })
            .then((res) => {
              if (res.data.success) {
                this.getOrganization();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch((err) => {
              this.$notify.error({
                title: "错误",
                message: err.data.message,
              });
            });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang='scss' scoped>
</style>