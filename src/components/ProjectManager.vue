<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/servicePriceManager">项目管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
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

        <!-- 添加用户 -->
        <el-col :span="3">
          <el-button type="primary" @click="handelDialogAddVisibleShow()">添加项目</el-button>
        </el-col>
      </el-row>
      <!-- 工具区 -->
      <el-row class="tools">
        <el-col :span="2">
          <el-button type="danger" @click="handelDeleteAll">删除选中</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        ref="multipleTable"
        :data="servicePrice.servicePriceList"
        :border="true"
        :highlight-current-row="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :reserve-selection="true"
      >
        <el-table-column label="编号" type="selection" width="60px"></el-table-column>
        <el-table-column label="编号" type="index" width="60px"></el-table-column>
        <el-table-column label="类别" prop="serviceType"></el-table-column>
        <el-table-column label="项目名" prop="serviceName" width="150px"></el-table-column>
        <el-table-column label="项目编号" prop="id" width="80px"></el-table-column>
        <el-table-column label="标准价格" prop="standardPrice"></el-table-column>
        <!-- <el-table-column label="促销价格" prop="promotionPrice" width="80px"></el-table-column> -->
        <el-table-column label="会员价格\折扣" prop="vipPrice" width="80px"></el-table-column>
        <el-table-column label="提成比例" prop="employeePercentageAmount" width="80px"></el-table-column>
        <!-- <el-table-column label="项目用途" prop="servicePurposeType" width="80px"></el-table-column> -->
        <el-table-column label="备注" prop="remark" width="200px"></el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑项目信息" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="handelDialogVisibleUpdateShowRow(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除项目信息" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handelConfirmDelete(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="查看项目信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-magic-stick"
                size="mini"
                @click="handelDialogVisibleShowRow(scope.row)"
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
        :total="servicePrice.total"
      ></el-pagination>
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
          <el-form-item label="编号" v-show="addForm.idShow">
            <el-input v-model="addForm.id"></el-input>
          </el-form-item>
          <el-form-item
            :label="addForm.serviceNameLabel"
            prop="serviceName"
            v-show="addForm.serviceNameShow"
          >
            <el-input v-model="addForm.serviceName" placeholder="请输入项目名字"></el-input>
          </el-form-item>
          <el-row v-show="addForm.serviceTypeShow">
            <el-col :span="8">
              <el-form-item :label="addForm.serviceTypeLabel">
                <el-select
                  v-model="addForm.serviceType"
                  :multiple="false"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择项目类别"
                  @change="serviceTypeChange"
                >
                  <el-option
                    v-for="item in serviceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="addForm.standardPriceShow">
            <el-form-item :label="addForm.standardPriceLabel" prop="standardPrice">
              <el-col :span="5">
                <el-input-number
                  v-model.number="addForm.standardPrice"
                  :step="20"
                  :min="0"
                  autocomplete="off"
                ></el-input-number>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row v-show="addForm.promotionPriceShow">
            <el-form-item :label="addForm.promotionPriceLabel" prop="promotionPrice">
              <el-col :span="5">
                <el-input-number
                  v-model.number="addForm.promotionPrice"
                  :step="20"
                  :min="0"
                  autocomplete="off"
                ></el-input-number>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row v-show="addForm.vipPriceShow">
            <el-form-item :label="addForm.vipPriceLabel" prop="vipPrice">
              <el-col :span="5">
                <el-input-number
                  v-model.number="addForm.vipPrice"
                  :step="20"
                  :min="0"
                  autocomplete="off"
                ></el-input-number>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row v-show="addForm.valuationUnitShow">
            <el-col :span="8">
              <el-form-item :label="addForm.valuationUnitLabel">
                <el-select
                  v-model="addForm.valuationUnit"
                  :multiple="false"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择计价单位"
                  @change="valuationUnitChange"
                >
                  <el-option
                    v-for="item in valuationUnitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="addForm.employeePercentageAmountShow">
            <el-form-item
              :label="addForm.employeePercentageAmountLabel"
              prop="employeePercentageAmount"
            >
              <el-col :span="5">
                <el-input-number
                  v-model.number="addForm.employeePercentageAmount"
                  :step="5"
                  :min="0"
                  :max="100"
                  autocomplete="off"
                ></el-input-number>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row v-show="addForm.employeePercentageTypeShow">
            <el-col :span="8">
              <el-form-item :label="addForm.employeePercentageTypeLabel">
                <el-select
                  v-model="addForm.employeePercentageType"
                  :multiple="false"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="提成类别"
                >
                  <el-option
                    v-for="item in employeePercentageTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="addForm.servicePurposeTypeShow">
            <el-col :span="8">
              <el-form-item :label="addForm.servicePurposeTypeLabel">
                <el-select
                  v-model="addForm.servicePurposeType"
                  :multiple="false"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="用途类别"
                  @change="servicePurposeTypeChange"
                >
                  <el-option
                    v-for="item in servicePurposeTypeOptions"
                    :key="item.id"
                    :label="item.serviceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注信息">
            <el-input v-model="addForm.remark"></el-input>
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
        this.getServicePriceList();
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
        allStatus: "正常",
        servicePurposeType: ""
      },
      addForm: {
        id: 0,
        serviceType: "养生部",
        serviceName: "头疗",
        //标准金额
        standardPrice: "100",
        // 促销价格
        promotionPrice: "90",
        // 计价单位
        valuationUnit: "次数",
        //		vip价格
        vipPrice: "80",
        // 员工提成百分比
        employeePercentageAmount: 10,
        // 员工提成类别。 物品和手工
        employeePercentageType: "",
        // 项目用途类别
        servicePurposeType: 1,
        //备注
        remark: "1",

        idShow: false,
        serviceTypeShow: true,
        serviceNameShow: true,
        //标准金额
        standardPriceShow: true,
        // 促销价格
        promotionPriceShow: true,
        // 计价单位
        valuationUnitShow: true,
        //		vip价格
        vipPriceShow: true,
        // 员工提成百分比
        employeePercentageAmountShow: true,
        // 员工提成类别。 物品和手工
        employeePercentageTypeShow: true,
        // 项目用途类别
        servicePurposeTypeShow: true,
        //备注
        remarkShow: true,
        //Label  标签显示
        serviceTypeLabel: "项目类型",
        serviceNameLabel: "项目名称",
        //标准金额Label
        standardPriceLabel: "标准价格",
        // 促销价格Label
        promotionPriceLabel: "促销价格",
        // 计价单位Label
        valuationUnitLabel: "计价类型",
        //		vip价格Label
        vipPriceLabel: "会员价格",
        // 员工提成百分比Label
        employeePercentageAmountLabel: "提成比例",
        // 员工提成类别。 物品和手工Label
        employeePercentageTypeLabel: "提成类别",
        // 项目用途类别Label
        servicePurposeTypeLabel: "用途类别",
        disabled: false
      },
      servicePrice: { servicePriceList: [], total: 0, multipleSelection: [] },
      addFormRules: {
        serviceName: [
          { required: true, message: "请输入项目名字", trigger: "blur" },
          { min: 2, max: 40, message: "长度在 2 到 40 个字符", trigger: "blur" }
        ]
      },
      dialog: { dialogVisible: false, title: "添加" },
      serviceTypeOptions: [
        {
          value: "养生部",
          label: "养生部"
        },
        {
          value: "足浴部",
          label: "足浴部"
        },
        {
          value: "美容部",
          label: "美容部"
        },
        {
          value: "产品部",
          label: "产品部"
        },
        {
          value: "其他",
          label: "其他"
        },
        {
          value: "VIP卡",
          label: "VIP卡"
        },
        {
          value: "内置项目",
          label: "内置项目"
        },
        {
          value: "支出项目",
          label: "支出项目"
        }
      ],
      valuationUnitOptions: [
        {
          value: "次数",
          label: "次数卡"
        },
        {
          value: "金额",
          label: "折扣卡"
        }
      ],
      employeePercentageTypeOptions: [
        {
          value: "手工项目提成",
          label: "手工项目提成"
        },
        {
          value: "产品销售提成",
          label: "产品销售提成"
        },
        {
          value: "储值卡提成",
          label: "储值卡提成"
        },
        {
          value: "无提成",
          label: "无提成"
        }
      ],
      servicePurposeTypeOptions: []
    };
  },
  created() {
    this.getServicePriceList();
    this.getAllServicePriceList();
  },
  methods: {
    getServicePriceList() {
      this.$http
        .get("/api/rest/service_price/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.servicePrice.servicePriceList = res.data.data;
          this.servicePrice.total = res.data.total;
        });
    },
    getAllServicePriceList() {
      this.$http
        .get("/api/rest/service_price/?1=1", {
          params: {
            startIndex: 0,
            pageSize: 100000,
            status: 1,
            queryString: "",
            servicePurposeType: ""
          }
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.servicePurposeTypeOptions = res.data.data;
          console.log(
            "servicePurposeTypeOptions",
            this.servicePurposeTypeOptions
          );
        });
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize;
      this.getServicePriceList();
    },
    // 当前页的改变 changeStatus
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryParams.startIndex =
        this.queryParams.pageSize * (this.currentPage - 1);
      this.getServicePriceList();
    },
    // 多选时属性的添加
    handleSelectionChange(val) {
      this.servicePrice.multipleSelection = val;
    },
    // 显示添加对话框
    handelDialogAddVisibleShow() {
      this.dialog.title = "添加项目信息";
      this.dialog.dialogVisible = true;
      this.addForm.disabled = false;
      this.serviceTypeChange();
      this.valuationUnitChange();
    },
    // 显示当前数据
    handelDialogVisibleShowRow(row) {
      this.dialog.title = "查看项目信息";
      this.dialog.dialogVisible = true;
      this.copyDataToAddForm(row);
      this.addForm.disabled = true;
      this.serviceTypeChange();
      this.valuationUnitChange();
    },
    // 修改前的显示
    handelDialogVisibleUpdateShowRow(row) {
      this.dialog.title = "编辑项目信息";
      this.dialog.dialogVisible = true;
      this.copyDataToAddForm(row);
      this.addForm.disabled = false;
      this.serviceTypeChange();
      this.valuationUnitChange();
    },
    //关闭之后的情况表单
    handleDialogClose(done) {
      this.$refs.addFormRef.resetFields();
    },
    // 服务类型的改变
    serviceTypeChange() {
      if (this.addForm.serviceType.indexOf("VIP卡") > -1) {
        (this.addForm.serviceNameShow = true),
          (this.addForm.standardPriceShow = false);
        // 促销价格
        this.addForm.promotionPriceShow = false;
        // 计价单位
        this.addForm.valuationUnitShow = true;
        //		vip价格
        this.addForm.vipPriceShow = true;
        // 员工提成百分比
        this.addForm.employeePercentageAmountShow = true;
        // 员工提成类别。 物品和手工
        this.addForm.employeePercentageTypeShow = true;
        // 项目用途类别
        this.addForm.servicePurposeTypeShow = true;
      } else {
        (this.addForm.serviceNameShow = true),
          (this.addForm.standardPriceShow = true);
        // 促销价格
        this.addForm.promotionPriceShow = false;
        // 计价单位
        this.addForm.valuationUnitShow = false;
        //		vip价格
        this.addForm.vipPriceShow = false;
        // 员工提成百分比
        this.addForm.employeePercentageAmountShow = true;
        // 员工提成类别。 物品和手工
        this.addForm.employeePercentageTypeShow = true;
        // 项目用途类别
        this.addForm.servicePurposeTypeShow = true;
      }
    },
    // 卡片计价类型的改变
    valuationUnitChange() {
      if (this.addForm.valuationUnit.indexOf("次数") > -1) {
        this.addForm.vipPriceLabel = "会员价格";
      } else {
        this.addForm.vipPriceLabel = "折扣比率";
      }
    },
    // 用途类别发生变化
    servicePurposeTypeChange() {
      if (this.addForm.serviceType.indexOf("VIP卡") > -1) {
        // 将选中项目基本价格信息赋给VIP卡
        console.log(
          "this.addForm.servicePurposeType id:",
          this.addForm.servicePurposeType
        );
        this.servicePurposeTypeOptions.forEach((item, index, arr) => {
          if (item.id == this.addForm.servicePurposeType) {
            //标准金额
            this.addForm.standardPrice = item.standardPrice;
            // 促销价格
            this.addForm.promotionPrice = item.promotionPrice;
          }
        });
      }
    },
    //对话框提交按钮
    dialogSubmit() {
      console.log(this.dialog.title);
      if (
        this.dialog.title.indexOf("添加") > -1 ||
        this.dialog.title.indexOf("增加") > -1
      )
        this.handelAddForm();
      else if (
        this.dialog.title.indexOf("修改") > -1 ||
        this.dialog.title.indexOf("编辑") > -1
      )
        this.handelUpdateUser();
      else if (this.dialog.title.indexOf("删除") > -1)
        this.handelConfirmDelete();
      this.getServicePriceList();
    },
    // 删除所有
    handelDeleteAll() {
      console.log(this.$refs.multipleTable.selection);
      if (this.$refs.multipleTable.selection.length < 1) return;
      this.$confirm("确认删除选中？")
        .then(_ => {
          // 如果确认则删除
          this.$refs.multipleTable.selection.forEach(row => {
            this.handelDelete(row);
          });
        })
        .catch(_ => {});
    },
    //添加提交
    handelAddForm() {
      this.$refs.addFormRef.validate(valid => {
        this.addForm.id = 0;
        if (valid) {
          // 添加项目路
          this.$http
            .post("/api/rest/service_price/", this.addForm)
            .then(res => {
              console.log(res);
              if (res.status > 300)
                return this.$messag.error(
                  "添加项目失败：未知异常，resultStatusCode:" + res.status
                );
                console.log("res.data.data:",res.data);
                if(res.data.result=="SUCCESS"){
              this.$messag.success("添加项目信息成功");
              this.getServicePriceList();
              }else this.$messag.error("添加失败"+res.data.description);
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 执行修改
    handelUpdateUser() {
      this.addForm.status = this.addForm.statusType;
      // 修改人员 默认生效
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 修改用户其他信息
          this.$http
            .put("/api/rest/service_price/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改项目失败：未知异常，resultStatusCode" + res.status
                );
              this.$messag.success("修改项目信息成功");
              this.getServicePriceList();
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 确认删除
    handelConfirmDelete(row) {
      this.copyDataToAddForm(row);
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.handelDelete(row);
        })
        .catch(_ => {});
    },
    // 执行删除
    handelDelete(row) {
      this.copyDataToAddForm(row);
      // 删除用户其他信息
      this.$http
        .put("/api/rest/service_price/soft_delete/" + row.id, this.addForm)
        .then(res => {
          console.log(res);
          if (res.status > 300)
            return this.$messag.error(
              "删除失败：未知异常，resultStatusCode" + res.status
            );
          this.getServicePriceList();
          this.$messag.success("删除成功");
        });
    },
    copyDataToAddForm(row) {
      this.addForm.id = row.id;
      this.addForm.serviceType = row.serviceType + "";
      this.addForm.serviceName = row.serviceName;
      this.addForm.standardPrice = row.standardPrice;
      this.addForm.promotionPrice = row.promotionPrice;
      this.addForm.valuationUnit = row.valuationUnit;
      this.addForm.servicePurposeType = Number(row.servicePurposeType);
      this.addForm.vipPrice = row.vipPrice;
      this.addForm.employeePercentageAmount = row.employeePercentageAmount;
      this.addForm.employeePercentageType = row.employeePercentageType + "";
      this.addForm.remark = row.remark;
    }
  }
};
</script>