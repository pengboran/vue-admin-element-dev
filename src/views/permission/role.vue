<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAddRole"
      >新建角色</el-button
    >
    <!-- 获取角色列表 -->
    <el-table
      :data="rolesList"
      style="width: 100%; margin-top: 30px"
      border
      stripe
      border
      highlight-current-row
      fit
      v-loading="listLoading"
    >
      <el-table-column label="序号" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.roleDesc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handlePermission(scope)"
          >
            权限配置
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑或添加弹框-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="dialogStatus === 'create' ? '添加' : '编辑'"
      width="30%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="角色编码" prop="roleId">
          <el-input
            v-model="form.roleId"
            autocomplete="off"
            placeholder="输入角色编码"
            :disabled="dialogStatus === 'create' ? false : true"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            autocomplete="off"
            placeholder="输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="form.roleDesc"
            autocomplete="off"
            placeholder="输入对此角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色类别" prop="roleType">
          <el-input
            v-model="form.roleType"
            autocomplete="off"
            placeholder="输入角色类别 1.财务 2.工程 3库管"
          ></el-input>
        </el-form-item>
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
    <!-- 权限分配弹框 -->
    <el-dialog title="权限分配" :visible.sync="dialogPerisVisible">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="权限分配">
          <el-tree
            ref="tree"
            :data="roleMenuData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogPerisVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRole"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <pagination
      v-show="total > 20"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getroleList"
    />
  </div>
</template>

<script>
import {
  getRolesListPage,
  changeRole,
  addRole,
  deleteRole,
  getAllMenu,
  getRoleMenu,
  changeRoleMenu,
} from "@/api/permissions/permissions";
import { data } from "autoprefixer";
export default {
  components: {},
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
      },
      listLoading: true,
      rolesList: [], // 表格角色数据
      dialogFormVisible: false,
      dialogPerisVisible: false,
      form: {
        roleId: "",
        roleName: "",
        roleDesc: "",
        roleType: "",
        id: "",
      },
      role: {
        id: "",
        menuIdArray: [],
      },
      routes: [],
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      rules: {
        roleId: [
          { required: true, message: "角色编码必填", trigger: "change" },
        ],
        roleName: [{ required: true, message: "名字必填", trigger: "change" }],
        roleType: [{ required: true, message: "类别必填", trigger: "change" }],
      },
      dialogStatus: "",
    };
  },
  components: {},
  computed: {
    roleMenuData() {
      return this.routes;
    },
  },
  created() {
    this.getroleList();
    this.getMenuTree();
  },
  methods: {
    resetform() {
      this.form = {
        roleId: "",
        roleName: "",
        roleDesc: "",
        roleType: "",
        id: "",
      };
    },
    // 获取菜单树
    getMenuTree() {
      getAllMenu({ parentId: 0 }).then((res) => {
        if (res.data.success) {
          this.routes = res.data.content.children;
        }
      });
    },
    // 获取所有角色列表
    getroleList() {
      this.listLoading = true;
      getRolesListPage(this.listQuery).then((res) => {
        this.rolesList = res.data.content;
        this.total = res.data.pagination.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1500);
      });
    },
    // 点击新建
    handleAddRole() {
      this.resetform();
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); // 置空校验
      });
    },
    // 新建提交
    createData() {
      // console.log(this.form)
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addRole(this.form)
            .then((res) => {
              if (res.data.success) {
                this.getroleList();
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
              }
            })
            .catch((err) => {
              this.$notify.error({
                title: "错误",
                message: err.data.message,
              });
            });
        }
      });
    },
    // 点击编辑
    handleEdit({ $index, row }) {
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.form = Object.assign({}, row); // copy obj
    },
    // 修改提交
    updateData() {
      console.log(this.form);
      changeRole(this.form)
        .then((res) => {
          if (res.data.success) {
            this.getroleList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err.data.message,
          });
        });
    },
    // 点击删除
    handleDelete({ $index, row }) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole({ id: row.id })
            .then((res) => {
              if (res.data.success) {
                this.getroleList();
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
    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route.id);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },
    // 点击权限配置
    handlePermission({ $index, row }) {
      // this.role = Object.assign({}, row);
      this.role.id = row.id;

      getRoleMenu({ id: row.id, parentId: 0 }).then((res) => {
        if (res.data.success) {
          this.dialogPerisVisible = true;
          let that = this;
          that.$nextTick(() => {
            that.$refs.tree.setCheckedKeys([]); // 点击的时候先置空勾选
            setTimeout(() => {
              that.generateArr(res.data.content.children).forEach((value) => {
                that.$refs.tree.setChecked(value, true, false);
              });
            }, 500);
          });
        }
      });
      // this.$nextTick(() => {});
    },
    confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys(); // 获取勾选的值 值为路由中的id 返回一个数组
      const parentKeys = this.$refs.tree.getHalfCheckedKeys(); // 获取子节点半选状态下 父节点id
      this.role.menuIdArray = parentKeys.concat(checkedKeys); // 合并数组
      //this.role.menuIdArray = checkedKeys;
      this.role.menuIdArray.push(100000);
      changeRoleMenu({
        id: this.role.id,
        menuid: this.role.menuIdArray,
      }).then((res) => {
        if (res.data.success) {
          this.dialogPerisVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    handleCheck(data) {
      if (data.menuType == 2 || data.menuType == 3) {
        this.checkStrictly = false;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
</style>