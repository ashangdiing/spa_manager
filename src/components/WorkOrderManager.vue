<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/workOrderManager">工单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>工单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="10" class="search">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" clearable v-model="queryParams.queryString">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <!-- 添加工单 -->
        <el-col :span="3">
          <a type="button" href="/workbench">新建工单</a>
        </el-col>
      </el-row>
      <!-- 工具区 -->
      <el-row class="tools" >
        <el-col :span="2">
          <el-button type="danger" v-if="false">删除选中</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        ref="multipleTable"
        :data="workOrder.workOrderList"
        :border="true"
        :highlight-current-row="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :reserve-selection="true"
      >
        <el-table-column label="编号" type="selection" width="40px"></el-table-column>
        <!-- 隐藏vip卡区域 -->
        <el-table-column type="expand" label="详情" width="60px">
          <template slot-scope="scope">
            <el-table
              ref="multipleTable"
              :data="scope.row.serviceRecords"
              :border="true"
              :highlight-current-row="true"
              :stripe="true"
              @selection-change="handleSelectionChange"
              :reserve-selection="true"
            >
             <el-table-column label="编号" prop="id" width="60px"></el-table-column>
             <el-table-column label="服务技师" prop="waiter.userName" width="150px"></el-table-column>
             <el-table-column label="开始时间" prop="beginTime" width="160px"></el-table-column>
             <el-table-column label="服务时长" prop="serviceTime" width="100px"></el-table-column>
             <el-table-column label="服务项目" prop="servicePrice.serviceName" width="150px"></el-table-column>
             <el-table-column label="支付卡号" prop="vipCard.cardNumber" width="100px"></el-table-column>
             <el-table-column label="支付金额" prop="vipCard.payAmount" width="100px"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="工单号" prop="workOrderNumber" width="130px"></el-table-column>
        <el-table-column label="时间" prop="beginTime" width="160px"></el-table-column>
        <el-table-column label="客户名字" prop="customer.customerName" width="160px"></el-table-column>
        <el-table-column label="客户电话" prop="customer.phone" width="130px" show-overflow-tooltip></el-table-column>
        <el-table-column label="服务总时长" prop="totalServiceTime" width="70px"></el-table-column>
        <el-table-column label="其他支付金额" prop="payAmount" width="70px"></el-table-column>
        <el-table-column label="其他支付方式" prop="payType" width="70px"></el-table-column>
        <el-table-column label="备注" prop="payRemark" width="200px"></el-table-column>

        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="dark" content="编辑工单信息" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="handelDialogVisibleUpdateShowRow(scope.row)"
              ></el-button>
            </el-tooltip> -->

            <el-tooltip effect="dark" content="删除工单信息" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handelConfirmDelete(scope.row)"
              ></el-button>
            </el-tooltip>

            <!-- <el-tooltip effect="dark" content="查看工单信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-magic-stick"
                size="mini"
                @click="handelDialogVisibleShowRow(scope.row)"
              ></el-button>
            </el-tooltip> -->
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
        :total="workOrder.total"
      ></el-pagination>
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
        this.getWorkOrderList();
      },
      deep: true
    }
  },
  data() {
    return {
      queryParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        queryString: "",
        currentPage: 1,
        allStatus: "正常"
      },
      workOrder: { workOrderList: [], total: 0, multipleSelection: [] },
        addForm: {
        id: 0,
      },
    };
  },
  created() {
    this.getWorkOrderList();
  },
  methods: {
    getWorkOrderList() {
      this.$http
        .get("/api/rest/work_order/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.workOrder.workOrderList = res.data.data;
          this.workOrder.total = res.data.total;
          console.log("getWorkOrderList", this.workOrder.workOrderList);
        });
    },
     // 确认删除
    handelConfirmDelete(row) {
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.handelDelete(row);
        })
        .catch(_ => {});
    },
     // 执行删除
    handelDelete(row) {
      console.log("WorkOrder:",row);
      // 删除客户信息
      this.$http
        .put("/api/rest/work_order/soft_delete/" + row.id, this.addForm)
        .then(res => {
          // console.log(res);
          if (res.status > 300)
            return this.$messag.error(  "删除失败：未知异常，resultStatusCode" + res.status  );
          this.getWorkOrderList();
          this.$messag.success("删除成功");
        });
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize;
      this.getCustomerList();
    },
    // 当前页的改变 changeStatus
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryParams.startIndex =
        this.queryParams.pageSize * (this.currentPage - 1);
    },
    // 多选时属性的添加
    handleSelectionChange(val) {
      this.workOrder.multipleSelection = val;
      console.log("-->", this.workOrder.multipleSelection);
    }
  }
};
</script>