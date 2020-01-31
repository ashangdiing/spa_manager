<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/permissionManager">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索行 -->
      <el-row :gutter="10" class="search">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryParams.queryString"
            @clear="clearSearch"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="13">
          <el-select
            v-model="queryParams.types"
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
      <!-- 主体 -->
      <el-row :gutter="10">
        <!-- 左边树形 -->
        <el-col :span="8">
          <el-tree
            :data="treeData"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterTreeNode"
            ref="tree"
            :default-expanded-keys="defaultExpandedKeys"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            accordion
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @mouseover="handelLeafEditShow(data)"
              @mouseleave="handelLeafEditHidden(data)"
              @click="showNodeDetials(node, data)"
            >
              <span>
                <i :class="data.iconClass"></i>
                {{ node.label }}
              </span>
              <span>
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="() => preAddNode(node, data)"
                  v-show="data.leafAddShow"
                >
                  <i class="el-icon-circle-plus-outline"></i>
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="() => preEditNode(node, data)"
                  v-show="data.leafEditShow"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="() => preRemoveNode(node, data)"
                  v-show="data.leafDeleteShow"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
        <!-- 编辑区 -->
        <el-col :span="16">
          <el-collapse v-model="collapseCctiveNames" accordion>
            <el-collapse-item name="1">
              <template slot="title">
                <el-col :span="4" class="permissionInfoTitle">资源信息管理</el-col>
              </template>
              <div>
                <el-form
                  :rules="addFormRules"
                  ref="addFormRef"
                  :model="addForm"
                  label-width="80px"
                  :disabled="addForm.disabled"
                >
                  <el-form-item label="编号" v-show="false">
                    <el-input v-model="addForm.id"></el-input>
                  </el-form-item>
                  <!--  第一行 -->
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="资源编码" prop="permissionId">
                        <el-input v-model="addForm.permissionId" placeholder="资源编码的英文名"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="资源名称" prop="permissionName">
                        <el-input v-model="addForm.permissionName" placeholder="资源名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="描述信息">
                        <el-input v-model="addForm.description" placeholder="描述信息"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--  第二行 -->
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="权限类型">
                        <el-select v-model="addForm.type" placeholder="请选择">
                          <el-option
                            v-for="(item, index) in typeOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="权限标识">
                        <el-select
                          v-model="addForm.permsTemp"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请选择权限识别"
                        >
                          <el-option
                            v-for="item in permsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="权重">
                        <el-input-number
                          v-model.number="addForm.orderNum"
                          :step="1"
                          autocomplete="off"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第三行 -->
                  <el-row>
                    <el-col :span="16">
                      <el-form-item label="路径">
                        <el-input v-model="addForm.url" placeholder="需要拦截的路径"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="图标">
                        <el-select
                          v-model="addForm.icon"
                          :multiple="false"
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请选择图标"
                        >
                          <el-option
                            v-for="item in iconOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-col :span="4" :offset="13">
                    <el-button type="primary" size="mini" @click="handelNode()">保存</el-button>
                  </el-col>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import qs from "qs";
export default {
  watch: {
    queryParams: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val.queryString) this.$refs.tree.filter("search");
        else {
          this.$refs.tree.filter("typeChage");
        }
      },
      deep: true
    }
  },
  data() {
    return {
      addFormRules: {
        permissionId: [
          {
            required: true,
            message: "请输入唯一的，权限英文编码",
            trigger: "blur"
          },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符", trigger: "blur" }
        ],
        permissionName: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符", trigger: "blur" }
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
          label: "方法"
        },
        {
          value: "10",
          label: "URL"
        }
      ],
      permsOptions: [
        {
          value: "*",
          label: "*"
        },
        {
          value: "GET",
          label: "GET"
        },
        {
          value: "PUT",
          label: "PUT"
        },
        {
          value: "POST",
          label: "POST"
        },
        {
          value: "DELETE",
          label: "DELETE"
        },
        {
          value: "HEAD",
          label: "HEAD"
        },
        {
          value: "OPTIONS",
          label: "OPTIONS"
        },
        {
          value: "PATHC",
          label: "PATHC"
        },
        {
          value: "COPY",
          label: "COPY"
        },
        {
          value: "LINK",
          label: "LINK"
        },
        {
          value: "UNLINK",
          label: "UNLINK"
        },
        {
          value: "PURGE",
          label: "PURGE"
        },
        {
          value: "LOCK",
          label: "LOCK"
        },
        {
          value: "UNLOCK",
          label: "UNLOCK"
        },
        {
          value: "PROPFIND",
          label: "PROPFIND"
        },
        {
          value: "VIEW",
          label: "VIEW"
        }
      ],
      iconOptions: [
        {
          value: "el-icon-delete",
          label: "el-icon-delete"
        },
        {
          value: "el-icon-setting",
          label: "el-icon-setting"
        },
        {
          value: "el-icon-user",
          label: "el-icon-user"
        },
        {
          value: "el-icon-phone-outline",
          label: "el-icon-phone-outline"
        },
        {
          value: "el-icon-more-outline",
          label: "el-icon-more-outline"
        },
        {
          value: "el-icon-star-off",
          label: "el-icon-star-off"
        },
        {
          value: "el-icon-goods",
          label: "el-icon-goods"
        },
        {
          value: "el-icon-warning-outline",
          label: "el-icon-warning-outline"
        },
        {
          value: "el-icon-zoom-in",
          label: "el-icon-zoom-in"
        },
        {
          value: "el-icon-zoom-out",
          label: "el-icon-zoom-out"
        },
        {
          value: "el-icon-remove-outline",
          label: "el-icon-remove-outline"
        },
        {
          value: "el-icon-circle-plus-outline",
          label: "el-icon-circle-plus-outline"
        },
        {
          value: "el-icon-circle-check",
          label: "el-icon-circle-check"
        },
        {
          value: "el-icon-circle-close",
          label: "el-icon-circle-close"
        },
        {
          value: "el-icon-help",
          label: "el-icon-help"
        },
        {
          value: "el-icon-minus",
          label: "el-icon-minus"
        },
        {
          value: "el-icon-plus",
          label: "el-icon-plus"
        },
        {
          value: "el-icon-check",
          label: "el-icon-check"
        },
        {
          value: "el-icon-close",
          label: "el-icon-close"
        },
        {
          value: "el-icon-picture-outline",
          label: "el-icon-picture-outline"
        },
        {
          value: "el-icon-picture-outline-round",
          label: "el-icon-picture-outline-round"
        },
        {
          value: "el-icon-upload2",
          label: "el-icon-upload2"
        },
        {
          value: "el-icon-download",
          label: "el-icon-download"
        },
        {
          value: "el-icon-camera",
          label: "el-icon-camera"
        },
        {
          value: "el-icon-video-camera",
          label: "el-icon-video-camera"
        },
        {
          value: "el-icon-bell",
          label: "el-icon-bell"
        },
        {
          value: "el-icon-finished",
          label: "el-icon-finished"
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
        types: []
      },
      addForm: {
        id: 0,
        permissionId: "",
        permissionName: "",
        description: "",
        url: "",
        perms: "",
        permsTemp: ["*"],
        parentId: 0,
        type: "3",
        orderNum: 1000,
        icon: "el-icon-finished",
        authority: "421088198509113322",
        label: "",
        status: 1,
        leafAddShow: false,
        leafEditShow: false,
        leafDleteShow: false,
        emptyText: false,
        expandAll: false,
        autoExpandParent: false,
        accordion: false,
        iconClass: [],
        disabled: false,
        children: [],
        leaf: false
      },
      collapseCctiveNames: ["1"],
      treeData: [],
      defaultExpandedKeys: [257],
      operationType: "",
      currentNode: {},
      currentData: {}
    };
  },
  created() {
    this.getPermissionTree();
  },
  methods: {
    clearSearch() {},
    filterTreeNode(queryString, data, node) {
      if (queryString != "search") {
        if (this.queryParams.types.length == 0) return true;
        const typesString = this.queryParams.types.join(",");
        return typesString.indexOf(data.data.type) != -1;
      } else {
        //处理搜索
        if (!this.queryParams.queryString) return true;
        return data.label.indexOf(this.queryParams.queryString) !== -1;
      }
    },
    //拖拽完成时触发
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", draggingNode, dropNode, dropType);
      var tmpParentId = "";
      if (dropType == "inner") tmpParentId = dropNode.data.id;
      else tmpParentId = dropNode.parent.data.id;
      this.updateparent(draggingNode.data.id, tmpParentId);
    },
    // 修改拖拽的父节点
    updateparent(dropNodeId, parentId) {
      this.$http
        .put("/api/rest/permission/" + dropNodeId, { parentId: parentId })
        .then(res => {
          if (res.status != 200)
            return this.messag.error(
              "修改父节点失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
          // this.getPermissionTree();
        });
    },
    // 是否能拖拽到对应的子节点
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.data.type > 3) {
        //  console.log("目标节点type 大于3，不能有子节点",dropNode)
        return type !== "inner";
      } else {
        return true;
      }
    },

    //获取权限树
    getPermissionTree() {
      this.treeData = [];
      console.log("getPermissionTree", this.treeData);
      this.$http
        .get("/api/rest/permission/tree?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.treeData = res.data.data;
        });
    },
    //叶子节点显示增加删除修改按钮
    handelLeafEditShow(data) {
      //   console.log("handelLeafEditShow:", data.id, data.leafEditShow);
      data.leafAddShow = true;
      data.leafEditShow = true;
      if (data.id != 1) data.leafDeleteShow = true;
    },
    //叶子节点隐藏增加删除修改按钮
    handelLeafEditHidden(data) {
      //   console.log("handelLeafEditHidden:", data.id, data.leafEditShow);
      data.leafAddShow = false;
      data.leafEditShow = false;
      data.leafDeleteShow = false;
    },
    //查看节点
    showNodeDetials(node, data) {
      //   this.operationType = "showNode";
      this.currentNode = node;
      this.currentData = data;
      this.copyDataToAddForm(data);
      this.addForm.disabled = true;
    },
    //准备添加节点
    preAddNode(node, data) {
      this.operationType = "addNode";
      this.currentNode = node;
      this.currentData = data;
      this.copyDataToAddForm(data);
      this.addForm.disabled = false;
      console.log(this.addForm);
    },
    // 准备编辑节点
    preEditNode(node, data) {
      console.log("-------------->>>>");
      this.operationType = "editNode";
      this.currentNode = node;
      this.currentData = data;
      this.copyDataToAddForm(data);
      this.addForm.disabled = false;
    },
    // 准备删除节点
    preRemoveNode(node, data) {
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.operationType = "removeNode";
          this.currentNode = node;
          this.currentData = data;
          this.copyDataToAddForm(data);
          this.handeRemoveNode();
        })
        .catch(_ => {});
    },
    // 执行节点操作
    handelNode() {
      console.log(this.operationType);

      if (this.operationType == "addNode") this.handeAddNode();
      else if (this.operationType == "editNode") this.handeEditNode();
      this.getPermissionTree();

      //关闭，避免误操作
      //   this.operationType="";
      //    this.currentNode={};
      //   this.currentData={};
    },
    //添加节点
    handeAddNode() {
      this.addForm.id = "";
      this.addForm.parentId = this.currentData.id;

      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 添加信息信息
          this.$http.post("/api/rest/permission/", this.addForm).then(res => {
            if (res.status != 200)
              return this.messag.error(
                "添加权限失败：未知异常，resultStatusCode" + res.status
              );
            if (res.data.result != "SUCCESS")
              this.$messag.error(res.data.description);
            else this.$messag.success(res.data.description);
            this.getPermissionTree();
          });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 编辑节点
    handeEditNode() {
      console.log("--->", this.addForm);
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 修改权限管理信息
          this.$http
            .put("/api/rest/permission/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status != 200)
                return this.messag.error(
                  "修改权限失败：未知异常，resultStatusCode" + res.status
                );
              if (res.data.result != "SUCCESS")
                this.$messag.error(res.data.description);
              else this.$messag.success(res.data.description);
              this.getPermissionTree();
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 删除节点
    handeRemoveNode() {
      // 删除权限信息
      this.$http
        .put(
          "/api/rest/permission/soft_delete/" + this.addForm.id,
          this.addForm
        )
        .then(res => {
          if (res.status != 200)
            return this.messag.error(
              "删除权限失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
          this.getPermissionTree();
        });
      console.log("handeRemoveNode", this.addForm);
    },
    //初始化表单
    copyDataToAddForm(data) {
      this.addForm.id = data.id;
      this.addForm.permissionId = data.data.permissionId;
      this.addForm.permissionName = data.data.permissionName;
      this.addForm.description = data.data.description;
      this.addForm.url = data.data.url;
      if (typeof data.data.perms == "string")
        this.addForm.permsTemp = data.data.perms.split(",");
      if (this.addForm.perms instanceof Array)
        this.addForm.perms = this.addForm.perms.join(",");
      this.addForm.parentId = data.data.parentId;
      this.addForm.type = data.data.type + "";
      this.addForm.orderNum = data.data.orderNum;
      this.addForm.status = data.data.status;
      this.addForm.icon = data.data.icon;
      this.addForm.authority = data.data.authority;
      this.addForm.label = data.label;
      this.addForm.leafAddShow = data.leafAddShow;
      this.addForm.leafEditShow = data.leafEditShow;
      this.addForm.leafDleteShow = data.leafDleteShow;
      this.addForm.emptyText = data.emptyText;
      this.addForm.expandAll = data.expandAll;
      this.addForm.autoExpandParent = data.autoExpandParent;
      this.addForm.accordion = data.accordion;
      this.addForm.iconClass = data.data.iconClass;
      // this.addForm.disabled = data.disabled;
      this.addForm.children = data.children;
      this.addForm.leaf = data.leaf;
    }
  }
};
</script>
<style lang="less" scoped>
.permissionInfoTitle {
  font-size: 1.5em;
}
</style>
