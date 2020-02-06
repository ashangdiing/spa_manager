<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/transaction">交易管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>流水列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="10" class="search">
        
         
        <!-- //显示所有用户 -->

        <el-col :span="10">交易类型
          <el-radio-group v-model="queryParams.type" size="mini" @change="changeStatus">
            <el-radio-button label="显示所有"></el-radio-button>
            <el-radio-button label="会员卡"></el-radio-button>
            <el-radio-button label="现金"></el-radio-button>
             <el-radio-button label="支付宝"></el-radio-button>
              <el-radio-button label="微信"></el-radio-button>
            <el-radio-button label="美团"></el-radio-button>
             <el-radio-button label="携程"></el-radio-button>
            <el-radio-button label="支出"></el-radio-button>
          </el-radio-group>
        </el-col>

      <el-col :span="3">
          <!-- 搜索框 -->
          <el-select
            v-model="queryParams.serviceName"
            :multiple="false"
            default-first-option
            placeholder="请选择项目名称"
        clearable 
          allow-create
          >
            <el-option
              v-for="item in allServicePriceOptions"
              :key="item.id"
              :label="item.serviceName"
              :value="item.serviceName"
            ></el-option>
          </el-select>
        </el-col>

        <!-- 添加支出 -->
        <el-col :span="3">
          <el-button type="primary" @click="handelDialogAddVisibleShow()">添加支出</el-button>
        </el-col>
      </el-row>
      <!-- 工具区 -->
      <el-row class="tools">
         <el-col :span="8">
          <el-date-picker
            v-model="dateTimeValue"
            align="right"
            type="datetimerange"
            range-separator="至"
            placeholder="选择日期"
            :picker-options="dateTimePickerOptions"
            format="yyyy年MM月dd日 HH时mm分ss秒"
            value-format="yyyy-MM-dd HH:mm:ss"
             start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="changeDateTimeChange"
          ></el-date-picker>
        </el-col>

         <el-col :span="2">
                <el-select
                  v-model="queryParams.employeePercentageType"
                  :multiple="false"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="提成类别"
                  clearable 
                >
                  <el-option
                    v-for="item in employeePercentageTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </el-col>

            <el-col :span="3">
           <el-select
              v-model="queryParams.customerId"
              :multiple="false"
              allow-create
              clearable
              default-first-option
              placeholder="请选择客户的手机号码"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.phone"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-col>


         <!-- 技师 -->
        <el-col :span="3">
          <el-select
            v-model="queryParams.salesId"
            :multiple="false"
            clearable
            allow-create
            default-first-option
            placeholder="请选择服务人员"
          >
            <el-option
              v-for="item in waiterOptions"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

          <el-col :span="3">
          <!-- 搜索框 -->
          <el-input placeholder="请输入卡号" clearable v-model="queryParams.cardNumber">
          </el-input>
        </el-col>

         <el-col :span="5">
          <!-- 搜索框 -->
          <el-input placeholder="请输入备注内容" clearable v-model="queryParams.remark">
            <el-button slot="append" icon="el-icon-search"  @click="search"></el-button>
          </el-input>
        </el-col>

      </el-row>
      <el-table
        ref="multipleTable"
        :data="transactionRecord.list"
        :border="true"
        :highlight-current-row="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :reserve-selection="true"
        show-summary
      >
        <el-table-column label="编号" type="selection" width="40px"></el-table-column>
        <el-table-column label="编号" prop="id" width="60px"></el-table-column>
        <el-table-column label="交易时间" prop="transactionTime" width="180px"></el-table-column>
        <el-table-column label="交易类型" prop="type" width="100px"></el-table-column>
         <el-table-column label="交易金额" prop="transactionAmount" width="60px"></el-table-column>
        <el-table-column label="用途" prop="purpose" width="150px"></el-table-column>
         <el-table-column label="服务项目" prop="serviceName" width="150px"></el-table-column>
         <el-table-column label="服务员工" prop="salesName" width="200px"></el-table-column>
          <el-table-column label="员工提成" prop="employeePercentageAmount" width="60px"></el-table-column>
           <el-table-column label="提成类型" prop="employeePercentageType" width="200px"></el-table-column>
        <el-table-column label="客户姓名" prop="customerName" width="150px"></el-table-column>
        <el-table-column label="卡号" prop="cardNumber" width="250px"></el-table-column>
        <el-table-column label="操作人员" prop="operatorName" width="200px"></el-table-column>
        <el-table-column label="备注信息" prop="remark" width="200px"></el-table-column>
         
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.currentPage"
        :page-sizes="[5, 10,20, 30, 50,500,1000,5000,10000]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="transactionRecord.total"
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
          <!-- 选择服务项目 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目类别" prop="serviceName">
                <el-select
                  v-model="addForm.serviceName"
                  :multiple="false"
                  filterable
                  default-first-option
                  placeholder="请选择项目名称"
                >
                  <el-option
                    v-for="item in servicePriceOptions"
                    :key="item.id"
                    :label="item.serviceName"
                    :value="item.serviceName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="用途" prop="purpose">
            <el-input v-model="addForm.purpose" placeholder="请输入用途"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="5">
              <el-form-item label="金额" prop="transactionAmount">
                <el-input-number
                  v-model.number="addForm.transactionAmount"
                  :step="5"
                  :min="0"
                  autocomplete="off"
                ></el-input-number>
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
        this.getTransactionRecordList();
      },
      deep: true
    }
  },
  data() {
    return {
      servicePriceOptions: {},
       
      queryParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        queryString: "",
        currentPage: 1,
        type: "显示所有",
        allStatus: "正常",
        beginTime: "",
        endTime: "",
        cardNumber: "",
        customerId: "",
        employeePercentageType: "",
        salesId : "",
        operatorId :"",
        serviceId:"",
        serviceName:"",
        remark: ""
      },
      customerOptions: {},
       waiterOptions: {},
      allServicePriceOptions: {},
       dateTimeValue: [],
      //生日属性设置
      dateTimePickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
             const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
           {
            text: "两周前",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "30天前",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "90天前",
            onClick(picker) {
             const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "半年前",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: "一年前",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
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
      transactionRecord: { list: [], total: 0, multipleSelection: [] },
      addFormRules: {
        purpose: [
          { required: true, message: "请输入用途", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        servieName: [
          { required: true, message: "请选择支出类别", trigger: "blur" }
        ]
      },
      addForm: {
        id: 0,
        transactionAmount: 0,
        purpose: "日常支出",
        serviceName: "聚餐费用",
        //备注
        remark: "",
        disabled: false
      },
      dialog: { dialogVisible: false, title: "添加" }
    };
  },
  created() {
    this.getTransactionRecordList();
    this.getServicePriceOptions();
    this.getCustomerList();
     this.getWaiterOptions();
     this.getAllServicePriceOptions();
    this.dateTimeValue=[this.getDateTime()+" 00:00:00",this.getDateTime()+" 23:59:59"];
  },
  methods: {
     search() {
     this.getTransactionRecordList();
    },
    // 获取所有支出列表
    getServicePriceOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: { servicePurposeType: "3", queryString: "" }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.servicePriceOptions = res.data.data;
        });
    },
    getTransactionRecordList() {
           this.queryParams.beginTime=this.dateTimeValue[0];
      this.queryParams.endTime=this.dateTimeValue[1];
      console.log("queryParams:",this.dateTimeValue,this.queryParams);
      this.$http
        .get("/api/rest/transaction_record/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.transactionRecord.list = res.data.data;
          this.transactionRecord.total = res.data.total;
          console.log(
            "getTransactionList",
            this.transactionRecord.list
          );
        });
    },
      // 获取客户信息
    getCustomerList() {
      this.$http
        .get("/api/rest/customer/?1=1", {
          params: {
            startIndex: 0,
            pageSize: 50000000,
            status: 1,
            queryString: ""
          }
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.customerOptions = res.data.data;
        });
    },
     //获取所有技师
    getWaiterOptions() {
      this.$http
        .get("/api/rest/employee/?1=1", {
          params: {
            startIndex: 0,
            pageSize: 50000,
            status: 1,
            expirestime: "",
            queryString: ""
          }
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.waiterOptions = res.data.data;
           
        });
    },
        // 获取所有项目列表
    getAllServicePriceOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: { servicePurposeType: "", queryString: "" }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.allServicePriceOptions = res.data.data;
        });
    },
     // 显示所有人状态 正常 或删除
    changeStatus() {
      this.queryParams.startIndex=0;
      this.getTransactionRecordList();
    },
    //时间发生改变时触发
    changeDateTimeChange(){
      console.log("ChangeDateTimeChange",this.dateTimeValue);
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize;
      this.getTransactionRecordList();
    },
    // 当前页的改变 changeStatus
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryParams.startIndex =
        this.queryParams.pageSize * (this.currentPage - 1);
    },
    // 多选时属性的添加
    handleSelectionChange(val) {
      this.transactionRecord.multipleSelection = val;
      console.log("-->", this.transaction.multipleSelection);
    },
    // 显示添加对话框
    handelDialogAddVisibleShow() {
      this.dialog.title = "添加支出信息";
      this.dialog.dialogVisible = true;
      this.addForm.disabled = false;
    },
    //关闭之后的情况表单
    handleDialogClose(done) {
      this.$refs.addFormRef.resetFields();
    },
    //对话框提交按钮
    dialogSubmit() {
      console.log(this.dialog.title);
      if (
        this.dialog.title.indexOf("添加") > -1 ||
        this.dialog.title.indexOf("增加") > -1
      )
        this.handelAddForm();
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
        if (valid) {
          // 添加用户其他信息
          this.$http
            .post("/api/rest/transaction_record/", this.addForm)
            .then(res => {
              console.log(res);
              if (res.status > 300)
                return this.$messag.error(
                  "添加项目失败：未知异常，resultStatusCode:" + res.status
                );
              this.$messag.success("添加支出信息成功");
              this.getTransactionRecordList();
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
      console.log(row);
      this.copyDataToAddForm(row);
    },
    copyDataToAddForm(row) {
      this.addForm.id = row.id;
      this.addForm.transactionAmount = row.transactionAmount;
      this.addForm.purpose = row.purpose;
      this.addForm.serviceName = row.serviceName;
      this.addForm.operatorName = row.operatorName;
      this.addForm.remark = row.remark;
      this.addForm.operatorName = JSON.parse(
        window.localStorage.getItem("currentLoginUser")
      );
    },
     // 时间格式
    getDateTime() {
      var t = new Date();
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day) ;
      return newTime;
    }
  }
};
</script>