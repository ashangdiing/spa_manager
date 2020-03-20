<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/roleManager">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索行 -->
      <el-row :gutter="10" class="search">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" clearable v-model="queryParams.queryString">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加角色 -->
        <el-col :span="3">
          <el-button type="primary" @click="handelDialogAddVisibleShow()">添加角色</el-button>
        </el-col>
         <el-col :span="10">
          <el-select
            v-model="permissionTypes"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 工具区 -->
      <el-row class="tools">
        <el-col :span="2">
          <el-button type="danger" @click="handelDeleteAll">删除选中</el-button>
        </el-col>
      </el-row>
      <!-- 主体 -->
      <el-row :gutter="10">
        <!-- 左边列表 -->
        <el-col :span="16">
          <!-- 列表区 -->
          <el-table
            ref="multipleTable"
            :data="role.roleList"
            :border="true"
            :highlight-current-row="true"
            :stripe="true"
            @selection-change="handleSelectionChange"
            :reserve-selection="true"
          >
            <el-table-column label="编号" type="selection" width="60px"></el-table-column>
            <el-table-column label="编号" type="index" width="60px"></el-table-column>
            <el-table-column label="名字" prop="roleName"></el-table-column>
            <el-table-column label="角色ID" prop="roleId"></el-table-column>
            <el-table-column label="描述信息" prop="description"></el-table-column>
            <el-table-column label="操作" width="190px">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑角色信息" placement="top" :enterable="false">
                  <el-button
                    type="warning"
                    icon="el-icon-edit"
                    size="mini"
                    @click="handelDialogVisibleUpdateShowRow(scope.row)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="删除角色信息" placement="top" :enterable="false">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="handelConfirmDelete(scope.row)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="显示角色的权限" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-magic-stick"
                    size="mini"
                    @click="handelGetRolePermission(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.currentPage"
            :page-sizes="[5, 10,20, 30, 50]"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="role.total"
          ></el-pagination>
        </el-col>
        <!-- 编辑区 -->
        <el-col :span="8">
          <el-tree
            :data="treeData"
            node-key="id"
            :expand-on-click-node="false"
            ref="tree"
            show-checkbox
           :filter-node-method="filterTreeNode"
            @check-change="treeCheckChange"
            :default-expanded-keys="defaultExpandedKeys"
            accordion
            :check-strictly=true
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                 <i :class="data.iconClass"></i>
                {{ node.label }}</span>
            </span>
          </el-tree>

          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="handelSaveRolePermission"
          >修改权限</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 信息展示对话框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.dialogVisible"
      width="60%"
      @close="handleDialogClose"
    >
      <span>
        <el-form
          :rules="addFormRules"
          ref="addFormRef"
          :model="addForm"
          label-width="80px"
          :disabled="addForm.disabled"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色ID" prop="roleId">
            <el-input v-model="addForm.roleId" :disabled="addForm.roleIdDisabled"></el-input>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
          <!--  form结束 -->
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
export default {
  watch: {
    queryParams: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if(val.queryString!=null)
        this.getRoleList();
      },
      deep: true
    },
    permissionTypes:{
       handler(val, oldVal) {
        this.$refs.tree.filter();
      },
      deep: true
    }
  },
  data() {
    return {
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 40, message: "长度在 2 到 40 个字符", trigger: "blur" }
        ]
      },
      // 权限类型枚举
      typeOptions: [
        {
          value: "0",
          label: "目录"
        },
        {
          value: "1",
          label: "菜单"
        },
        {
          value: "2",
          label: "按钮"
        },
        {
          value: "3",
          label: "URL"
        },
        {
          value: "4",
          label: "其他"
        }
      ],
      queryParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        expirestime: "",
        queryString: "",
        currentPage: 1,
        allStatus: "正常",
        targetNodeId: 0,
        expandAll: true,
      },
       permissionTypes: [],
      addForm: {
        id: 0,
        roleId: "",
        roleName: "",
        description: "",
        status: "1",
        allPermission: []
      },
      role: { roleList: [], total: 0 },
      dialog: { dialogVisible: false, title: "添加" },
      roleIdDisabled: false,

      // 多选参数接受属性
      multipleSelection: [],
      collapseCctiveNames: ["1"],
      treeData: [],
      defaultExpandedKeys:[1],
      operationType: "",
      currentNode: {},
      currentData: {},
      rolePermissionChange: false
    };
  },
  created() {
    this.getPermissionTree();
    this.getRoleList();
  },
  methods: {
     filterTreeNode(dd, data, node) {
        if (this.permissionTypes.length==0) return true;
      const typesString = this.permissionTypes.join(",");
      return typesString.indexOf(data.data.type) != -1;
    },
    getRoleList() {
      this.$http
        .get("/api/rest/role/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.role.roleList = res.data.data;
          this.role.total = res.data.total;
        });
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize;
      this.getRoleList();
    },
    // 当前页的改变 changeStatus
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryParams.startIndex =
        this.queryParams.pageSize * (this.currentPage - 1);
      this.getRoleList();
    },
    // 显示添加对话框
    handelDialogAddVisibleShow() {
      this.dialog.title = "添加角色信息";
      this.dialog.dialogVisible = true;
      this.addForm.disabled = false;
      this.addForm.roleIdDisabled = false;
    },
    // 显示当前数据
    handelDialogVisibleShowRow(row) {
      this.dialog.title = "查看角色信息";
      this.dialog.dialogVisible = true;
      this.dialogInitRow(row);
      this.addForm.disabled = true;
    },
    // 修改前的显示
    handelDialogVisibleUpdateShowRow(row) {
      this.dialog.title = "编辑角色信息";
      this.dialog.dialogVisible = true;
      this.dialogInitRow(row);
      this.addForm.disabled = false;
      this.addForm.roleIdDisabled = true;
    },
    //对话框提交按钮
    dialogSubmit() {
      console.log(this.dialog.title);
      if (
        this.dialog.title.indexOf("添加") > -1 ||
        this.dialog.title.indexOf("增加") > -1
      )
        this.handelAddRole();
      else if (
        this.dialog.title.indexOf("修改") > -1 ||
        this.dialog.title.indexOf("编辑") > -1
      )
        this.handelUpdateRole();
      else if (this.dialog.title.indexOf("删除") > -1)
        this.handelConfirmDelete();
    },

    // 多选时属性的添加
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除所有
    handelDeleteAll() {
      if (this.$refs.multipleTable.selection.length < 1) return;
      this.$confirm("确认删除选中？")
        .then(_ => {
          // 如果确认则删除
          this.$refs.multipleTable.selection.forEach(row => {
            this.handelDeleteRole(row);
          });
        })
        .catch(_ => {});
    },
    //关闭对话框之后的情况表单
    handleDialogClose(done) {
      this.$refs.addFormRef.resetFields();
    }, // 确认删除
    handelConfirmDelete(row) {
      this.dialogInitRow(row);
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.handelDeleteRole(row);
        })
        .catch(_ => {});
    },
    //添加提交
    handelAddRole() {
      // 新加角色
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 添加用户管理信息
          this.$http.post("/api/rest/role/", this.addForm).then(res => {
            if (res.status != 200)
              return this.$messag.error(
                "添加角色失败：未知异常，resultStatusCode" + res.status
              );
            if (res.data.result != "SUCCESS")
              this.$messag.error(res.data.description);
            else this.$messag.success(res.data.description);
            this.getRoleList();
          });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 执行删除
    handelDeleteRole(row) {
      this.dialogInitRow(row);
      this.addForm.status = 2;
      // 删除角色信息
      this.$http
        .put("/api/rest/role/soft_delete/" + this.addForm.id, this.addForm)
        .then(res => {
          if (res.status != 200)
            return this.$messag.error(
              "删除角色失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
          this.getRoleList();
        });
    },
    // 执行修改
    handelUpdateRole() {
      // 修改人员 默认生效
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 修改角色管理信息
          this.$http
            .put("/api/rest/role/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status != 200)
                return this.$messag.error(
                  "修改角色失败：未知异常，resultStatusCode" + res.status
                );
              if (res.data.result != "SUCCESS")
                this.$messag.error(res.data.description);
              else this.$messag.success(res.data.description);
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    //treeCheckChange 当前节点状态改变时，如果为选中，则父节点需要被选中
    treeCheckChange(data,checked,childrenChecked){
        if(checked) 
        {
          this.setParentNodeChecked(data);
        }
    },
    // 设置父节点为选中
    setParentNodeChecked(node){
            if(node != undefined && node != null && node.parentId>1){
           let parentNode=this.$refs.tree.getNode(node.parentId);
            this.$refs.tree.setChecked(node.parentId, true);
            this.setParentNodeChecked(parentNode);
          }
    },
    //权限信息
    getPermissionTree() {
      this.$http
        .get("/api/rest/permission/tree?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.$messag.error("获取数据异常");
          this.treeData = res.data.data;
        });
    },
    // 查看角色的权限信息
    handelGetRolePermission(row) {
      this.dialogInitRow(row);
      if (this.addForm.allPermission == undefined) {
        // 根据角色id获取权限信息
        this.$http
          .get("/api/rest/role/" + this.addForm.id + "/permission", {
            params: this.queryParams
          })
          .then(res => {
            if (res.status != 200) return this.$messag.error("获取数据异常");
            row.allPermission = this.addForm.allPermission =
              res.data.data.allPermission;
            this.handelShowRolePermission();
          });
      } else {
        this.handelShowRolePermission();
      }
    },
    //展示勾选角色已有权限
    handelShowRolePermission() {
      // this.addForm.allPermission.lab
      this.treeData[0].label="《"+this.addForm.roleName+"》的所有权限";
      let permissionIds = [];
      this.addForm.allPermission.forEach((item, index, arr) => {
        permissionIds[index] = item.id;
      });
      // 设置选中的节点
      this.$refs.tree.setCheckedKeys(permissionIds, true);
    },

    // 修改角色的权限
    handelSaveRolePermission() {
      let permissionIds = this.$refs.tree.getCheckedKeys(false);
       permissionIds.push(1);
      this.$http
        .put("/api/rest/role/" + this.addForm.id + "/permission", permissionIds)
        .then(res => {
          if (res.status != 200)
            return this.$messag.error(
              "修改角色失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
        });
    },
    //初始化表单
    // 给addfrom统一赋值
    dialogInitRow(row) {
      this.addForm.id = row.id;
      this.addForm.roleName = row.roleName;
      this.addForm.roleId = row.roleId;
      this.addForm.description = row.description;
      this.addForm.status = row.status;
      this.addForm.allPermission = row.allPermission;
    }
  }
};
</script>
<style lang="less" scoped>
.permissionInfoTitle {
  font-size: 1.5em;
}
</style>
