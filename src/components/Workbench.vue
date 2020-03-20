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
          <el-form-item label="客户姓名" placeholder="请选择或输入客户姓名">
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
          <el-input v-model="serviceRecord.servicePrice.promotionPrice" :disabled="serviceRecord.servicePrice.promotionPriceDisabled"></el-input>
        </el-col>
        <!-- 技师 -->
        <el-col :span="3">
          <el-select
            v-model="serviceRecord.waiter.id"
            :multiple="false"
            filterable
            default-first-option
            placeholder="请选择技师姓名"
             @change="waiterChange(index,serviceRecord)"
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
           <el-form-item   prop="vipCard">
          <el-select
            v-model="serviceRecord.vipCard.id"
            :multiple="false"
            clearable
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入VIP卡号"
            @change="vipCardChange(index,serviceRecord)"
          >
            <el-option
              v-for="item in cardTypeOptions"
              :key="item.id"
              :label="item.cardLabel"
              :value="item.id"
            ></el-option>
          </el-select>
           </el-form-item>
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
          <el-form-item label="其他支付方式">
            <el-select
              v-model="workOrder.payType"
              :multiple="false"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入VIP卡号"
              @change="payTypeChange(index,serviceRecord)"
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
          <el-form-item label="其他支付金额" prop="payAmount">
            <el-input v-model="workOrder.payAmount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="总金额">
            <el-input v-model="workOrder.totalPayAmount" disabled></el-input>
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
    watch: {
    workOrder: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.settleAccounts();
      },
      deep: true
    }
  },
  data() {
    // 结账校验是否成功
    var settleAccountsIsSuccess = (rule, value, callBack) => {
      this.settleAccounts();
      if (this.settleAccountsResult.status == 0) {
        return callBack();
      }
      callBack(new Error(this.settleAccountsResult.errorInfo));
    };

    // 会员卡校验是否成功
    var vipCardValidate = (rule, value, callBack) => {
       console.log("this.currentSelectServiceRecord---》",this.currentSelectServiceRecord);
         //--------------------》服务项目获取开始
        let serviceRecordServicePrice = this.getServicePriceById(this.currentSelectServiceRecord.servicePrice.id );
        //提示没有选择项目类型
        if (serviceRecordServicePrice == undefined) {
        return  callBack(new Error("没有选择项目类型，请选择后再选择卡"));
        }
        //《------------------服务项目获取完成

         //获取VIP卡信息
        let serviceRecordVipCard = this.getVipCardById(this.currentSelectServiceRecord.vipCard.id);
        // ————————————————————————————————》如果有卡的情况
        if (serviceRecordVipCard != undefined) {
            
          //获取VIP 卡对应的卡类型,来查找卡是次卡还是折卡    |||  获取到卡类型 serviceRecordVipCard.servicePriceCardType
          serviceRecordVipCard.servicePriceCardType = this.getServicePriceById( serviceRecordVipCard.cardTypeId  );
          if (serviceRecordVipCard.servicePriceCardType == undefined) {
            return callBack(new Error( "VIP卡" +  serviceRecordVipCard.cardNumber + "没有绑定VIP卡的卡片类型，请到会员卡管理先绑定"));
          }

          console.log( "serviceRecordVipCard.servicePriceCardType:" , serviceRecordVipCard.servicePriceCardType  );

          if (  serviceRecordVipCard.servicePriceCardType.valuationUnit.indexOf( "次数" ) > -1  ) {
            // 次卡价格变为标准价格，并且不能修改
            this.currentSelectServiceRecord.servicePrice.promotionPrice=serviceRecordVipCard.servicePriceCardType.vipPrice;
            this.currentSelectServiceRecord.servicePrice.promotionPriceDisabled=true;
            // 如果是次卡  ,用途与项目服务价格不同提示无法用该卡付款
            if (  serviceRecordVipCard.servicePriceId != serviceRecordServicePrice.id ) {
            
              return callBack(new Error( "这个项目使用的VIP次卡项目，请使用对应类型次卡付款，或者使用储值卡或不使用卡"));
            }
          }else {
            // 储蓄卡，并且不是产品类，能够修改价格。自动打折    serviceRecordVipCard.servicePriceCardType 为储蓄卡类型， vipPrice 为折扣比例
            console.log("当前卡的类型",serviceRecordVipCard.servicePriceCardType);
            //项目不是产品类可打折
            if(this.currentSelectServiceRecord.servicePrice.serviceType!='产品部'){
            this.currentSelectServiceRecord.servicePrice.promotionPrice=serviceRecordServicePrice.standardPrice*serviceRecordVipCard.servicePriceCardType.vipPrice/100;
           } 
              this.currentSelectServiceRecord.servicePrice.promotionPriceDisabled=false;
          }
          // 余额是否足够扣款
          let tmpBalance=  serviceRecordVipCard.balance-this.currentSelectServiceRecord.servicePrice.promotionPrice;
            if(tmpBalance<0){
               return callBack(new Error( "该卡余额不足以扣款，需要充值后支付。项目支付需要金额"+this.currentSelectServiceRecord.servicePrice.promotionPrice+"元，当前余额:"+serviceRecordVipCard.balance+"元， 差额:"+-tmpBalance+"元。"));
            }
        }else{
        //没有选择卡
          this.currentSelectServiceRecord.servicePrice.promotionPrice=serviceRecordServicePrice.standardPrice;
          this.currentSelectServiceRecord.servicePrice.promotionPriceDisabled=false;
        }
        // 《——————————————————————————————————————————有卡情况结束》》
        callBack();
        this.settleAccounts();
    };
    return {
      labelPosition: "top",
      customerOptions: {},
      cardTypeOptions: {},
      servicePriceOptions: {},
      allServicePriceOptions: {},
      waiterOptions: {},
      //支付类型
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
          label: "微信支付"
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
        customer: { id: "0", customerName: "", phone: "" },
        customerIsVip: "false",
        serviceRecords: [
          {
            id: "",
            beginTime: new Date(),
            waiter: { id: "", userName: "" },
            serviceTime: 0,
            vipCard: { id: "", cardNumber: "" },
             
            servicePrice: {
              id: "",
              serviceType: "",
              serviceName: "",
              standardPrice: 0,
              promotionPrice: 0,
              promotionPriceDisabled: false,
              employeePercentageAmount: 0,
              remark: ""
            }
          }
        ],
        payType: "3",
        payAmount: 0,
        totalPayAmount: 0,
        payRemark: ""
      },
      // 当前刚刚选中的服务记录，切换服务或者切换卡，都会赋值给他，校验时使用他
      currentSelectServiceRecord:{},
      settleAccountsResult: {
        status: 0,
        errorInfo: "余额不足无法支付"
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
      addFormRules: {
        payAmount: [
          {
            required: false,
            message: "请输入其他付款金额，没有输入0",
            trigger: "blur"
          },
          {
            // 自定义校验规则
            validator: settleAccountsIsSuccess,
            trigger: "blur"
          }
        ],
        vipCard: [
          {
            // 自定义校验规则
            validator: vipCardValidate,
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    this.getOprator();
    this.getCustomerList();
    this.getServicePriceOptions();
    this.getAllServicePriceOptions();
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
      this.cardTypeOptions = {};
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
          if (this.cardTypeOptions.length > 0)
            this.workOrder.customerIsVip = "true";
        });
    },
    // 获取所有价格项目列表
    getServicePriceOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: { servicePurposeType: "2", queryString: "" }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.servicePriceOptions = res.data.data;
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
       console.log("thissettleAccounts----------    servicePriceChange  开始 start ||--------->>>>>>>>>>>>.<<<<<:",this.waiterOptions);
      this.currentSelectServiceRecord=serviceRecord;
       console.log("thissettleAccounts----------    servicePriceChange  中 start ||--------->>>>>>>>>>>>.<<<<<:",this.waiterOptions);
      //根据选择的项目价格变更标准价格
      this.servicePriceOptions.forEach((item, index, arr) => {
        if (item.id == serviceRecord.servicePrice.id) {
          serviceRecord.servicePrice.serviceType = item.serviceType;
          serviceRecord.servicePrice.serviceName = item.serviceName;
          serviceRecord.servicePrice.standardPrice = item.standardPrice;
          serviceRecord.servicePrice.promotionPrice = item.standardPrice;
          serviceRecord.servicePrice.valuationUnit = item.valuationUnit;
          serviceRecord.servicePrice.vipPrice = item.vipPrice;
          serviceRecord.servicePrice.employeePercentageAmount =
            item.employeePercentageAmount;
          serviceRecord.servicePrice.employeePercentageType =
            item.employeePercentageType;
        }
      });
    },
    //Vip卡发生变化变化
    vipCardChange(index, serviceRecord) {
      serviceRecord.currentVipCard=this.getVipCardById(serviceRecord.vipCard.id);
      this.currentSelectServiceRecord=serviceRecord;
         this.settleAccounts();
    },
    // 服务人员发生变化
    waiterChange(index,serviceRecord){

       this.settleAccounts();
    },
    // 支付方式发生变化
    payTypeChange(index,serviceRecord){
    this.settleAccounts();
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
          serviceType: "",
          serviceName: "",
          standardPrice: 0,
          promotionPrice: 0,
          remark:""
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
        console.log("handelCreateWorkOrder1111 提交工单");
      this.$refs.addFormRef.validate(valid => {
        console.log("handelCreateWorkOrder 提交工单");
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
          message: "警告信息：" + data.description,
          type: "warn"
        });
      } else {
        this.$notify({
          title: "错误",
          message: "错误信息：" + data.description,
          type: "error"
        });
      }
    },
    // 结账
    settleAccounts() {
      console.log("正在结账。。。。。。。。。。。。");
      // 遍历所有的服务
      this.workOrder.totalPayAmount=0; this.workOrder.payAmount=0;
      for (let idx = 0; idx < this.workOrder.serviceRecords.length; idx++) {
        let tempIndex = idx + 1;
        let serviceRecord = this.workOrder.serviceRecords[idx];

           //--------------------》服务项目获取开始
        let serviceRecordServicePrice = this.getServicePriceById(serviceRecord.servicePrice.id );
        if(serviceRecordServicePrice==undefined){
        this.settleAccountsResult.status = -1;
        this.settleAccountsResult.errorInfo="第"+tempIndex+"个项目未选择技师";
        return;
        }

        // 校验是否选择服务人员
        if(serviceRecord.waiter.id==undefined||serviceRecord.waiter.id==""){
        this.settleAccountsResult.status = -1;
        this.settleAccountsResult.errorInfo="第"+tempIndex+"个项目未选择技师";
        return;
        }
          serviceRecord.waiter=this.getWaiterById(serviceRecord.waiter.id);
 
        this.workOrder.totalPayAmount= this.workOrder.totalPayAmount+serviceRecord.servicePrice.promotionPrice;
       //获取VIP卡信息
        let serviceRecordVipCard = this.getVipCardById(serviceRecord.vipCard.id);
        // ————————————————————————————————》如果有卡的情况
        if (serviceRecordVipCard != undefined) {
              // 当前卡的余额
          let tmpBalance=  serviceRecordVipCard.balance-serviceRecord.servicePrice.promotionPrice;
          //卡不足扣款则计算到总的支付金额
          if(tmpBalance<0){
            this.workOrder.payAmount=this.workOrder.payAmount+serviceRecord.servicePrice.promotionPrice;
          }
          // 会员卡支付金额
          else serviceRecord.payAmount=serviceRecord.servicePrice.promotionPrice;
        }else{
          //没有会员卡则计算需要扣款金额
            this.workOrder.payAmount=this.workOrder.payAmount+serviceRecord.servicePrice.promotionPrice;
        }
         // 《——————————————————————————————————————————有卡情况结束》》
         // 计算员工提成开始——————————————————》 
         // 手工提成需要根据员工的提成比例计算
        if(serviceRecordServicePrice.employeePercentageType=="手工项目提成"){
        serviceRecord.employeePercentageAmount=serviceRecord.servicePrice.promotionPrice*serviceRecord.waiter.employeePercentageAmount/100;
        }else{
            // 其他提成直接按项目提成计算
            serviceRecord.employeePercentageAmount=serviceRecord.servicePrice.promotionPrice*serviceRecordServicePrice.employeePercentageAmount/100;
        }
        serviceRecord.employeePercentageType=serviceRecordServicePrice.employeePercentageType;
      this.workOrder.serviceRecords[idx]=serviceRecord;
         // 计算员工提成结束《——————————————————
      }

      //汇总
     this.settleAccountsResult.status = 0;
       this.settleAccountsResult.errorInfo="正常支付";
       console.log("结账-----完成------------------>。",this.settleAccountsResult);
    },
    // 分析每条服务记录的信息
     analysisServiceRecord(index,serviceRecord){
         
     },
    //通过ID获取vip卡
    getVipCardById(cardId) {
      for (let idx = 0; idx < this.cardTypeOptions.length; idx++) {
        if (this.cardTypeOptions[idx].id == cardId) {
          return JSON.parse(JSON.stringify(this.cardTypeOptions[idx]));
        }
      }
    },
    //通过id获取服务价格
    getServicePriceById(ServicePriceId) {
      for (let idx = 0; idx < this.allServicePriceOptions.length; idx++) {
        if (this.allServicePriceOptions[idx].id == ServicePriceId) {
          return JSON.parse(JSON.stringify(this.allServicePriceOptions[idx]));
        }
      }
    },
    //通过id查找技师
    getWaiterById(waiterId) {
         for (let idx = 0; idx < this.waiterOptions.length; idx++) {
        if (this.waiterOptions[idx].id == waiterId) {
          return JSON.parse(JSON.stringify(this.waiterOptions[idx]));
        }
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