<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/workOrderManager">工单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>工作台</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <div style="margin: 20px;"></div>
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="workOrder"
      ref="addFormRef"
      :rules="addFormRules"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="序号">
            <el-input v-model="workOrder.workOrderNumber" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开单时间">
            <el-date-picker
              v-model="workOrder.beginTime"
              align="right"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日 HH时mm分ss秒"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="开单人员">
            <el-input v-model="workOrder.operator.userName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总时长(分钟)">
            <el-input v-model="workOrder.totalServiceTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 客户信息 -->
      <el-row :gutter="20">
        <el-col :span="3">客户信息</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="客户姓名"
           placeholder="请选择或输入客户姓名"
          >
            <el-input v-model="workOrder.customer.customerName  "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系方式">
             <el-select
              v-model="workOrder.customer.phone"
              :multiple="false"
              filterable
              allow-create
              clearable 
              default-first-option
              @change="customerChange"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.phone"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否会员">
            <el-switch
              v-model="workOrder.customerIsVip"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"
              disabled
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 服务信息 -->
      <el-row :gutter="20">
        <el-col :span="3">服务信息</el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="3">
          <el-form-item label="项目名称"></el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="开始时间"></el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item label="服务时长(分钟)"></el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="标准价格"></el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item label="折后(实际金额)"></el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="技师"></el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="支付卡"></el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="操作项目"></el-form-item>
        </el-col>
      </el-row>
      <!-- 动态添加项目 -->
      <el-row :gutter="10" v-for="(serviceRecord, index) in workOrder.serviceRecords" :key="index">
        <!-- 选择服务项目 -->
        <el-col :span="3">
          <el-select
            v-model="serviceRecord.servicePrice.id"
            :multiple="false"
            filterable
            default-first-option
            placeholder="请选择项目名称"
            @change="servicePriceChange(index,serviceRecord)"
          >
            <el-option
              v-for="item in servicePriceOptions"
              :key="item.id"
              :label="item.serviceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 选择服务开始时间 -->
        <el-col :span="5">
          <el-date-picker
            v-model="serviceRecord.beginTime"
            align="right"
            type="datetime"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy 年 MM 月 dd 日 HH时mm分ss秒"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <!-- 服务时长 -->
        <el-col :span="2">
          <el-input v-model="serviceRecord.serviceTime" @change="countTotalServiceTime"></el-input>
        </el-col>
        <!-- 标准价格 -->
        <el-col :span="2">
          <el-input v-model="serviceRecord.servicePrice.standardPrice" :disabled="true"></el-input>
        </el-col>
        <!-- 促销价格，实际金额 -->
        <el-col :span="2">
          <el-input v-model="serviceRecord.servicePrice.promotionPrice"></el-input>
        </el-col>
        <!-- 技师 -->
        <el-col :span="3">
          <el-select
            v-model="serviceRecord.waiter.id"
            :multiple="false"
            filterable
            default-first-option
            placeholder="请选择技师姓名"
          >
            <el-option
              v-for="item in waiterOptions"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- VIP卡选择 -->
        <el-col :span="3">
          <el-select
            v-model="serviceRecord.vipCard.id"
            :multiple="false"
            clearable
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入VIP卡号"
          >
            <el-option
              v-for="item in cardTypeOptions"
              :key="item.id"
              :label="item.cardNumber"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button @click.prevent="removeServiceRecord(serviceRecord)">删除</el-button>
        </el-col>
      </el-row>

      <!-- 其他收款信息 -->
      <el-row :gutter="20">
        <el-col :span="3">收款信息</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="支付方式">
            <el-select
              v-model="workOrder.payType"
              :multiple="false"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入VIP卡号"
            >
              <el-option
                v-for="item in payTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="支付金额">
            <el-input v-model="workOrder.payAmount"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="备注">
            <el-input v-model="workOrder.payRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 提交保存 -->
      <el-row :gutter="20">
        <el-col :span="3"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-button type="primary" @click="handelCreateWorkOrder()">提交</el-button>
          <el-button type="primary" @click="addServiceRecord()">新增服务项目</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      labelPosition: "top",
      customerOptions: {},
      cardTypeOptions: {},
      servicePriceOptions: {},
      waiterOptions: {},
      payTypeOptions: [
        {
          value: "1",
          label: "现金"
        },
        {
          value: "2",
          label: "支付宝"
        },
        {
          value: "3",
          label: "微信"
        },
        {
          value: "4",
          label: "美团"
        },
        {
          value: "5",
          label: "携程"
        },
        {
          value: "6",
          label: "QQ钱包"
        },
        {
          value: "7",
          label: "京东"
        },
        {
          value: "8",
          label: "云闪付"
        },
        {
          value: "9",
          label: "Ipay"
        }
      ],
      workOrder: {
        id: "",
        workOrderNumber: "20191222001",
        operator: { userName: "11" },
        beginTime: "new Date()",
        totalServiceTime: 0,
        customer: { id: "0", customerName: "刘柳", phone: "13111111" },
        customerIsVip: "false",
        serviceRecords: [
          {
            id: "",
            beginTime: new Date(),
            waiter: { id: "", userName: "" },
            serviceTime: 100,
            vipCard: { id: "", cardNumber: "" },
            servicePrice: {
              id: "",
              serviceType: "",
              serviceName: "",
              standardPrice: 110,
              promotionPrice: 100
            }
          }
        ],
        payType: "会员卡",
        payAmount: 500,
        payRemark: ""
      },
      //时间属性设置
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 14;
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "两周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 14);
              picker.$emit("pick", date);
            }
          },
          {
            text: "30天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          },
          {
            text: "90天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", date);
            }
          },
          {
            text: "半年后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      addFormRules: {}
    };
  },

  created() {
    this.getOprator();
    this.getCustomerList();
    this.getServicePriceOptions();
    this.getWaiterOptions();
    this.countTotalServiceTime();
    this.workOrder.beginTime = this.workOrder.serviceRecords[0].beginTime = this.getDateTime();
  },
  methods: {
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
        (day < 10 ? "0" + day : day) +
        " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (min < 10 ? "0" + min : min) +
        ":" +
        (sec < 10 ? "0" + sec : sec);

      console.log("clock" + newTime);
      return newTime;
    },
    // 获取开单人信息
    getOprator() {
      this.workOrder.operator = JSON.parse(
        window.localStorage.getItem("currentLoginUser")
      );
      console.log(this.workOrder.operator.userName);
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
    // 获取当前用户的所有vip卡
    getCardTypeOptions() {
      this.cardTypeOptions={};
      if (this.workOrder.customer.id == 0) return;
      this.$http
        .get("/api/rest/card/queryCustomerAllCard/?1=1", {
          params: {
            startIndex: 0,
            pageSize: 5,
            status: 1,
            customerId: this.workOrder.customer.id
          }
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.cardTypeOptions = res.data.data;
          if(this.cardTypeOptions.length>0)
           this.workOrder.customerIsVip = "true";
        });
    },
    // 获取所有项目列表
    getServicePriceOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: {   servicePurposeType: "项目价格",queryString:""   }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.servicePriceOptions = res.data.data;
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

    //会员信息发生变化
    customerChange(customerId) {
      this.workOrder.customerIsVip = "false";
      this.workOrder.customer.id = "";
      this.workOrder.customer.customerName = "";
      this.cardTypeOptions = {};
      this.customerOptions.forEach((item, index, arr) => {
        if (item.id == customerId) {
          this.workOrder.customer.customerName = item.customerName;
          this.workOrder.customer.id = item.id;
          this.workOrder.customer.phone = item.phone;
          
          //获取会员卡
          this.getCardTypeOptions();
          
        }
      });
    },
    //服务类容发生变化
    servicePriceChange(index, serviceRecord) {
      //根据选择的项目价格变更标准价格德国
      this.servicePriceOptions.forEach((item, index, arr) => {
        if (item.id == serviceRecord.servicePrice.id) {
          serviceRecord.servicePrice.serviceType = item.serviceType;
          serviceRecord.servicePrice.serviceName = item.serviceName;
          serviceRecord.servicePrice.standardPrice = item.standardPrice;
          serviceRecord.servicePrice.promotionPrice = item.promotionPrice;
          serviceRecord.servicePrice.valuationUnit = item.valuationUnit;
          serviceRecord.servicePrice.vipPrice = item.vipPrice;
          serviceRecord.servicePrice.employeePercentageAmount =
            item.employeePercentageAmount;
          serviceRecord.servicePrice.employeePercentageType =
            item.employeePercentageType;
        }
      });
    },
    //添加服务项目
    addServiceRecord() {
      this.workOrder.serviceRecords.push({
        id: "0",
        beginTime: this.getDateTime(),
        waiter: { id: "0", userName: "" },
        serviceTime: 100,
        vipCard: { id: "0", cardNumber: "" },
        servicePrice: {
          id: "",
          serviceType: "项目1",
          serviceName: "按摩",
          standardPrice: 110,
          promotionPrice: 100
        }
      });
      this.countTotalServiceTime();
    },
    // 移除服务内容
    removeServiceRecord(serviceRecord) {
      var index = this.workOrder.serviceRecords.indexOf(serviceRecord);
      if (index !== -1) {
        this.workOrder.serviceRecords.splice(index, 1);
      }
      this.countTotalServiceTime();
    },
    // 提交工单
    handelCreateWorkOrder() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 添加用户其他信息
          this.$http.post("/api/rest/work_order/", this.workOrder).then(res => {
            if (res.status > 300)
              return this.$messag.error(
                "新建工单失败：未知异常，resultStatusCode:" + res.status
              );
            this.handelFailCallBackMessage(res.data);
          });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    //计算总服务时长
    countTotalServiceTime() {
      this.workOrder.totalServiceTime = 0;
      this.workOrder.serviceRecords.forEach((item, index, arr) => {
        this.workOrder.totalServiceTime =
          parseInt(this.workOrder.totalServiceTime) +
          parseInt(item.serviceTime);
      });
    },
    handelFailCallBackMessage(data) {
      console.log(data);
      if (data.result == "SUCCESS") {
        this.$messag.success("新建成功");
      } else if (data.result == "WARN") {
        this.$notify({
          title: "警告",
          message: "警告信息："+data.description,
          type: "warn"
        });
      } else {
        this.$notify({
          title: "错误",
          message: "错误信息："+data.description,
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-form-item__label {
  color: red !important;
}
</style>