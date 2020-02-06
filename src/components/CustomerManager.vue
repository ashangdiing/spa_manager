<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/customerManager">客户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>客户列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="handelDialogAddVisibleShow()">添加客户</el-button>
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
        :data="customer.customerList"
        :border="true"
        :highlight-current-row="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :reserve-selection="true"
        @expand-change="expandChangeHidenArea"
      >
        <el-table-column label="编号" type="selection" width="60px"></el-table-column>

        <el-table-column label="会员等级" prop="level">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.level" :colors="levelColors" :disabled="true"></el-rate>
          </template>
        </el-table-column>

        <el-table-column label="编号" type="index" width="60px"></el-table-column>
        <el-table-column label="姓名" prop="customerName"></el-table-column>
        <!-- <el-table-column label="证件号码" prop="passportNumber" width="200px"></el-table-column> -->
        <el-table-column label="生日" prop="birthday"></el-table-column>
        <el-table-column label="手机号码" prop="phone" width="120px"></el-table-column>

        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <div v-if="scope.row.sex==1">男</div>
            <div v-else>女</div>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" width="180px"></el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑客户信息" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="handelDialogVisibleUpdateShowRow(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除客户信息" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handelConfirmDelete(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="查看客户信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-magic-stick"
                size="mini"
                @click="handelDialogVisibleShowRow(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 隐藏vip卡区域 -->
        <el-table-column type="expand" label="VIP卡信息" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-document-add"
              size="mini"
              @click="handelCardDialogAddVisibleShow"
            >添加</el-button>

            <el-table
              :data="scope.row.cards"
              :border="true"
              :highlight-current-row="true"
              :stripe="true"
              @selection-change="handleSelectionChange"
              :reserve-selection="true"
            v-if="addForm.expandChangeHidenAreaShow" 
            >

             <!-- @expand-change="expandChangeHidenArea" -->
              <el-table-column label="编号" type="index" width="60px"></el-table-column>
              <el-table-column label="卡号" prop="cardNumber"></el-table-column>
              <el-table-column label="卡名称" prop="cardTypeName"></el-table-column>
              <el-table-column label="余额" prop="balance"></el-table-column>
              <el-table-column label="剩余次数" prop="surplusCount"></el-table-column>
              <!-- <el-table-column label="折扣" prop="discount"></el-table-column> -->
              <el-table-column label="最后充值金额" prop="lastRecharge"></el-table-column>
              <el-table-column label="最后充值时间" prop="lastRechargeTime" width="180px"></el-table-column>
              <el-table-column label="累计充值金额" prop="cumulativeRecharge"></el-table-column>
              <el-table-column label="备注" prop="remark"></el-table-column>

            <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit-outline"
                size="mini"
                @click="handelCardDialogVisibleUpdateShowRow(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-document-delete"
                size="mini"
                @click="handelConfirmDeleteCard(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="充值" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-shopping-cart-full"
                size="mini"
                @click="handelCardDialogVisibleRechargeCardShow(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

            </el-table>

            <!-- //循环显示会员卡 -->
            <!-- <el-collapse accordion>
              <div v-for="(item,i) in scope.row.cards" :key="item.id">
                <el-collapse-item>
                  <template slot="title">
                    会员卡
                    <i class="header-icon el-icon-info"></i>
                    {{item.cardNumber}}
                  </template>

                  <el-row :gutter="10">
                    <el-col :span="8">
                      <h1>卡号:</h1>
                      {{item.cardNumber}}
                    </el-col>
                    <el-col :span="8">
                      <h1>卡类型名字:</h1>
                      {{item.cardTypeName}}
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="8">
                      <h1>余额:</h1>
                      {{item.balance}}
                    </el-col>
                    <el-col :span="8">
                      <h1>剩余次数:</h1>
                      {{item.surplusCount}}
                    </el-col>
                    <el-col :span="8">
                      <h1>折扣:</h1>
                      {{item.discount}}
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="8">
                      <h1>最后一次充值金额:</h1>
                      {{item.lastRecharge}}
                    </el-col>
                    <el-col :span="8">
                      <h1>最后一次充值时间:</h1>
                      {{item.lastRechargeTime}}
                    </el-col>
                    <el-col :span="8">
                      <h1>累计充值金额:</h1>
                      {{item.cumulativeRecharge}}
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <h1>备注:</h1>
                      {{item.remark}}
                    </el-col>
                  </el-row>

                  <el-button-group :span="20">
                    <el-row :gutter="6">
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="handelCardDialogVisibleUpdateShowRow(item)"
                        >修改</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="handelConfirmDeleteCard(item)"
                        >删除</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          icon="el-icon-magic-stick"
                          size="mini"
                          @click="handelCardDialogVisibleRechargeCardShow(item)"
                        >充值</el-button>
                      </el-col>
                    </el-row>
                  </el-button-group>
                </el-collapse-item>
              </div>
            </el-collapse> 
            -->
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
        :total="customer.total"
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
          <el-form-item label="姓名" prop="customerName">
            <el-input v-model="addForm.customerName" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="证件号码" prop="passportNumber">
            <el-input v-model="addForm.passportNumber" placeholder="请输入身份证号码"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addForm.phone" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="5">
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="addForm.birthday"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="birthdayPickerOptions"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="性别">
                <el-radio v-model="addForm.sex" :label="1">男</el-radio>
                <el-radio v-model="addForm.sex" :label="2">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="会员等级">
                <el-rate v-model="addForm.level" :colors="levelColors"></el-rate>
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
    <!-- 显示隐藏区域的数据 -->
    <el-dialog
      :title="cardDialog.title"
      :visible.sync="cardDialog.dialogVisible"
      width="60%"
      @close="handleCardDialogClose"
    >
      <span>
        <el-form
          ref="addHidenFormRef"
          :model="addHidenForm"
          label-width="100px"
          :disabled="addHidenForm.disabled"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="卡片类型">
                <el-select
                  @change="cardTypeChange"
                  v-model="addHidenForm.cardTypeId"
                  placeholder="请选择卡片类型"
                >
                  <el-option
                    v-for="(item) in cardTypeOptions"
                    :key="item.id"
                    :label="item.serviceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="卡片消费项目">
                <el-select
                  @change="servicePriceChange"
                  v-model="addHidenForm.servicePriceId"
                  placeholder="请选择卡消费项目"
                  disabled
                >
                  <el-option
                    v-for="(item) in servicePriceOptions"
                    :key="item.id"
                    :label="item.serviceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="5">
              <el-form-item label="充值金额">
                <el-input-number
                  v-model.number="addHidenForm.balance"
                  :min="0"
                  :step="10"
                  autocomplete="off"
                  :disabled="addHidenForm.disabledBalance"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="currentCardType.valuationUnit=='次数'">
            <el-col :span="5">
              <el-form-item label="充值次数">
                <el-input-number
                  v-model.number="addHidenForm.surplusCount"
                  :min="0"
                  :step="10"
                  autocomplete="off"
                  :disabled="addHidenForm.disabledRecharge"
                  @change="surplusCountChange"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-row>
            <el-col :span="5">
              <el-form-item label="折扣">
                <el-input-number
                  v-model.number="addHidenForm.discount"
                  :min="0"
                  :max="100"
                  :step="10"
                  autocomplete="off"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="8">
              <el-form-item label="销售人员">
                <el-select
                  v-model="addHidenForm.sales.id"
                  :multiple="false"
                  filterable
                  default-first-option
                  placeholder="请选择销售姓名"
                >
                  <el-option
                    v-for="item in salesOptions"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

           <el-row>
            <el-col :span="8">
              <el-form-item label="支付类型">
                <el-select
                  v-model="addHidenForm.payType"
                  :multiple="false"
                  filterable
                  default-first-option
                  placeholder="请选择支付类型"
                >
                  <el-option
                    v-for="item in payTypeOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="描述信息">
            <el-input v-model="addHidenForm.remark" placeholder="请输入描述信息"></el-input>
          </el-form-item>

          <!--  form结束 -->
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cardDialog.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handCardDialogSubmit">确 定</el-button>
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
        this.getCustomerList();
      },
      deep: true
    }
  },
  data() {
    var validateIdNo = (rule, value, callBack) => {
      console.log("validateIdNo", value);
      if (value == null) return callBack();
      if (value.trim().length < 1) return callBack();
      console.log("validateIdNo ss", value);
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value)) {
        return callBack();
      }
      callBack(new Error("请输入正确的身份证号码"));
    };

    return {
      queryParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        queryString: "",
        currentPage: 1,
        allStatus: "正常"
      },
      queryHidenParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        customerId: "",
        queryString: "",
        currentPage: 1,
        allStatus: "正常"
      },
      addForm: {
        id: 0,
        customerName: "习近平",
        passportNumber: "42108319500621001x",
        phone: "13419506799",
        birthday: "",
        sex: 1,
        level: 0,
        //备注
        remark: "",
        cardList: [],
        disabled: false,
        expandChangeHidenAreaShow: true
      },
      currentRow: {},
      customer: { customerList: [], total: 0, multipleSelection: [] },
      addFormRules: {
        customerName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        passportNumber: [
          { required: false, message: "请输入身份证号码", trigger: "blur" },
          {
            min: 18,
            max: 20,
            message: "长度在 18 到 20 个字符",
            trigger: "blur"
          },
          {
            // 自定义校验规则
            validator: validateIdNo,
            message: "请输入正确的身份证号码",
            trigger: "blur"
          }
        ],
        phone: [
          { required: false, message: "请输入电话号码", trigger: "blur" },
          {
            min: 8,
            max: 33,
            message: "长度在 8 到 33 个字符",
            trigger: "blur"
          }
        ]
      },
      dialog: { dialogVisible: false, title: "添加" },
      levelColors: {
        2: "#99A9BF",
        4: { value: "#F7BA2A", excluded: true },
        5: "#FF9900"
      },
      //隐藏的表单数据
      addHidenForm: {
        id: 0,
        cardNumber: "8888888888",
        cardTypeId: 1,
        servicePriceId: 1,
        servicePriceName: "其他卡",
        discount: 0,
        balance: 18,
        surplusCount: 1,
        sales: {},
        lastRecharge: 110,
        remark: "",
        payType: "3",
        disabledPayType: false,
        disabledRecharge: false,
        disabledBalance: false
      },
      cardDialog: { dialogVisible: false, title: "添加" },
      card: { cardList: [], total: 0 },
      cardTypeOptions: {},
      salesOptions: {},
      servicePriceOptions: {},
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
      //当前会员卡的类型
      currentCardType: {},
      //   当前会员卡的消费类型
      currentServicePrice: {},
      //生日属性设置
      birthdayPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 3600 * 1000 * 24 * 365 * 18;
        },
        shortcuts: [
          {
            text: "五零后",
            onClick(picker) {
              picker.$emit("pick", "1950-01-01");
            }
          },
          {
            text: "六零后",
            onClick(picker) {
              picker.$emit("pick", "1960-01-01");
            }
          },
          {
            text: "七零后",
            onClick(picker) {
              picker.$emit("pick", "1970-01-01");
            }
          },
          {
            text: "八零后",
            onClick(picker) {
              picker.$emit("pick", "1980-01-01");
            }
          },
          {
            text: "九零后",
            onClick(picker) {
              picker.$emit("pick", "1990-01-01");
            }
          },
          {
            text: "零零后",
            onClick(picker) {
              picker.$emit("pick", "2000-01-01");
            }
          },
          {
            text: "一零后",
            onClick(picker) {
              picker.$emit("pick", "2010-01-01");
            }
          }
        ]
      }
    };
  },
  created() {
    this.getCustomerList();
    this.getCardTypeOptions();
    this.getServicePriceOptions();
    this.getSalesOptions();
  },
  methods: {
    // 获取vip卡的类型
    getCardTypeOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: { servicePurposeType: "", queryString: "VIP卡" }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.cardTypeOptions = res.data.data;
          console.log("cardTypeOptions", this.cardTypeOptions);
        });
    },
    // 获取所有项目列表
    getServicePriceOptions() {
      this.$http
        .get("/api/rest/service_price/query_card_type?1=1", {
          params: { servicePurposeType: "2", queryString: "" }
        })
        .then(res => {
          if (res.status > 300) return this.messag.error("获取数据异常");
          this.servicePriceOptions = res.data.data;
          //初始化现在的卡消费类型
          this.servicePriceChange(this.addHidenForm.servicePriceId);
          console.log("servicePriceId", this.servicePriceOptions);
        });
    },
    //获取所有技师
    getSalesOptions() {
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
          this.salesOptions = res.data.data;
        });
    },
    getCustomerList() {
      this.$http
        .get("/api/rest/customer/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.customer.customerList = res.data.data;
          this.customer.total = res.data.total;
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
      this.getCustomerList();
    },
    // 多选时属性的添加
    handleSelectionChange(val) {
      this.customer.multipleSelection = val;
      console.log("-->", this.customer.multipleSelection);
    },
    // 显示添加对话框
    handelDialogAddVisibleShow() {
      this.dialog.title = "添加客户信息";
      this.dialog.dialogVisible = true;
      this.addForm.disabled = false;
    },
    // 显示当前数据
    handelDialogVisibleShowRow(row) {
      this.dialog.title = "查看客户信息";
      this.dialog.dialogVisible = true;
      this.copyDataToAddForm(row);
      this.addForm.disabled = true;
    },
    // 修改前的显示
    handelDialogVisibleUpdateShowRow(row) {
      this.dialog.title = "编辑客户信息";
      this.dialog.dialogVisible = true;
      this.copyDataToAddForm(row);
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
      else if (
        this.dialog.title.indexOf("修改") > -1 ||
        this.dialog.title.indexOf("编辑") > -1
      )
        this.handelUpdateUser();
      else if (this.dialog.title.indexOf("删除") > -1)
        this.handelConfirmDelete();
      this.getCustomerList();
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
          this.$http.post("/api/rest/customer/", this.addForm).then(res => {
            console.log(res);
            if (res.status > 300)
              return this.$messag.error(
                "添加项目失败：未知异常，resultStatusCode:" + res.status
              );
            this.$messag.success("添加项目信息成功");
            this.getCustomerList();
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
            .put("/api/rest/customer/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改客户失败：未知异常，resultStatusCode" + res.status
                );
              this.$messag.success("修改客户信息成功");
              this.getCustomerList();
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
      // 删除客户信息
      this.$http
        .put("/api/rest/customer/soft_delete/" + this.addForm.id, this.addForm)
        .then(res => {
          console.log(res);
          if (res.status > 300)
            return this.$messag.error(
              "删除用户失败：未知异常，resultStatusCode" + res.status
            );
          this.getCustomerList();
          this.$messag.success("修改员工信息成功");
        });
    },
    copyDataToAddForm(row) {
      this.addForm.id = row.id;
      this.addForm.customerName = row.customerName;
      this.addForm.passportNumber = row.passportNumber;
      this.addForm.phone = row.phone;
      this.addForm.birthday = row.birthday;
      this.addForm.sex = row.sex;
      this.addForm.level = row.level;
      this.addForm.birthday = row.birthday;
      this.addForm.remark = row.remark;
    },
    // vip卡片区域
    // 展开vip卡片
    expandChangeHidenArea(row, expandedRows) {
      this.copyDataToAddForm(row);
      this.currentRow = row;
      this.getCardList();
    },
    //获取当前对象的所有子项
    getCardList() {
      this.queryHidenParams.customerId = this.currentRow.id;
      this.$http
        .get("/api/rest/card/queryCustomerAllCard/?1=1", {
          params: this.queryHidenParams
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          
          this.currentRow.cards = res.data.data;
           this.addForm.expandChangeHidenAreaShow=false;
          this.$nextTick(() => {
           this.addForm.expandChangeHidenAreaShow=true;
            // console.log("重新刷新v-for没生效。。。需要再排查");
            // this.$refs.multipleTable.doLayout();
            this.$forceUpdate();
          });
        });
    },
    // 显示添加对话框
    handelCardDialogAddVisibleShow() {
      this.cardDialog.title = "客户添加会员卡";
      this.cardDialog.dialogVisible = true;
      this.addHidenForm.disabled = false;
      this.addHidenForm.disabledRecharge = false;
      this.addHidenForm.disabledBalance = false;
      this.addHidenForm.balance=0;
    },

    // 修改前的显示
    handelCardDialogVisibleUpdateShowRow(card) {
      this.copyDataToAddHidenForm(card);
      this.cardDialog.title = "修改客户会员卡";
      this.cardDialog.dialogVisible = true;
      this.addHidenForm.disabled = false;
      this.addHidenForm.disabledRecharge = true;
      this.addHidenForm.disabledBalance = true;
    },
    // 充值卡展示
    handelCardDialogVisibleRechargeCardShow(card) {
      this.copyDataToAddHidenForm(card);
      this.cardDialog.title = "充值会员卡";
      this.cardDialog.dialogVisible = true;
      this.addHidenForm.disabled = false;
      this.addHidenForm.disabledRecharge = false;
      this.addHidenForm.disabledBalance = false;
      this.addHidenForm.balance=0;
    },
    //关闭之后的情况表单
    handleCardDialogClose(done) {
      this.$refs.addHidenFormRef.resetFields();
    },
    //对话框提交按钮
    handCardDialogSubmit() {
      console.log("handCardDialogSubmit title", this.cardDialog.title);
      if (
        this.cardDialog.title.indexOf("添加") > -1 ||
        this.cardDialog.title.indexOf("增加") > -1
      ) {
        this.handelAddCardForm();
      } else if (
        this.cardDialog.title.indexOf("修改") > -1 ||
        this.cardDialog.title.indexOf("编辑") > -1
      ) {
        this.handelUpdateCard();
      } else if (this.cardDialog.title.indexOf("充值") > -1)
        this.handelRechargeCard();
    },
    // 添加卡
    handelAddCardForm() {
      this.$refs.addHidenFormRef.validate(valid => {
        if (valid) {
          this.addHidenForm.customer = this.addForm;
          this.addHidenForm.cardNumber = "";
          if (this.currentServicePrice.valuationUnit == "金额") {
            //充值金额,次数变为0
            this.addHidenForm.surplusCount = 0;
          } else {
            // 充值次数,金额转为对应的项目总值
            this.addHidenForm.balance =
              this.addHidenForm.surplusCount *
              this.currentServicePrice.standardPrice;
          }
          // 添加卡信息
          this.$http.post("/api/rest/card/", this.addHidenForm).then(res => {
            if (res.status > 300)
              return this.$messag.error(
                "添加卡失败：未知异常，resultStatusCode:" + res.status
              );
            this.$messag.success("添加卡信息成功");
            this.getCardList();
          });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 修改卡信息
    handelUpdateCard() {
      this.$refs.addHidenFormRef.validate(valid => {
        if (valid) {
          this.addHidenForm.customer = this.addForm;
          // 修改用户其他信息
          this.$http
            .put("/api/rest/card/" + this.addHidenForm.id, this.addHidenForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改客户失败：未知异常，resultStatusCode" + res.status
                );
              this.$messag.success("修改卡信息成功");
              this.getCardList();
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 确认删除卡信息
    handelConfirmDeleteCard(card) {
      this.copyDataToAddHidenForm(card);
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.handelDeleteCard(card);
        })
        .catch(_ => {});
    },
    handelDeleteCard(card) {
      console.log("handelDeleteCard", card);
      this.$http
        .put(
          "/api/rest/card/soft_delete/" + this.addHidenForm.id,
          this.addHidenForm
        )
        .then(res => {
          console.log(res);
          if (res.status > 300)
            return this.$messag.error(
              "删除用户失败：未知异常，resultStatusCode" + res.status
            );
          this.getCardList();
          this.$messag.success("删除卡成功");
        });
    },
    // 充值
    handelRechargeCard() {
      console.log("handelRechargeCard", this.addHidenForm);
      this.$refs.addHidenFormRef.validate(valid => {
        if (valid) {
          this.addHidenForm.customer = this.addForm;
          // 修改用户其他信息
          this.$http
            .put(
              "/api/rest/card/recharge_card/" + this.addHidenForm.id,
              this.addHidenForm
            )
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改客户失败：未知异常，resultStatusCode" + res.status
                );
              this.$messag.success("充值成功");
              this.getCardList();
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    copyDataToAddHidenForm(card) {
      this.addHidenForm.id = card.id;
      this.addHidenForm.cardTypeId = card.cardTypeId;
      this.addHidenForm.cardTypeName = card.cardTypeName;
      this.addHidenForm.servicePriceId = card.servicePriceId;
      this.addHidenForm.servicePriceName = card.servicePriceName;
      this.addHidenForm.discount = card.discount;
      this.addHidenForm.remark = card.remark;
      this.addHidenForm.balance = card.balance;
      this.addHidenForm.surplusCount = card.surplusCount;
    },
    // 卡类型变化
    cardTypeChange(cardId) {
      this.cardTypeOptions.forEach((item, index, arr) => {
        if (cardId == item.id) {
          this.currentCardType = item;

          this.addHidenForm.servicePriceId = Number(
            this.currentCardType.servicePurposeType
          );
          this.servicePriceChange(this.addHidenForm.servicePriceId);
          this.addHidenForm.balance = 0;
          this.addHidenForm.surplusCount = 0;
          console.log("currentCardType", this.currentCardType);
          //如果计数单位为金额则，充值次数为0
          if (this.currentCardType.valuationUnit == "金额") {
            this.addHidenForm.surplusCount = 0;
            this.addHidenForm.disabledBalance = false;
            // 会员卡折扣为VIP价格
             this.addHidenForm.discount=this.currentCardType.vipPrice;
          }
          //如果计数单位为次数，则充值金额为0
          else {
            this.addHidenForm.disabledBalance = true;
          }
        }
      });
    },
    // 消费类型发送变化
    servicePriceChange(servicePriceId) {
      this.servicePriceOptions.forEach((item, index, arr) => {
        if (servicePriceId == item.id) {
          this.currentServicePrice = item;
          // //如果计数单位为金额则，充值次数为0
          // if (this.currentServicePrice.valuationUnit == "金额") {
          //   this.addHidenForm.surplusCount = 0;
          //   this.addHidenForm.disabledBalance=false;
          // }
          // //如果计数单位为次数，则充值金额为0
          // else {
          //   // this.addHidenForm.balance = 0;
          //   this.addHidenForm.disabledBalance=true;
          // }
        }
      });
    },
    // 充值次数发生变化
    surplusCountChange() {
      //充值金额= 次数* 标准价格
      this.addHidenForm.balance =
        this.addHidenForm.surplusCount * this.currentServicePrice.standardPrice;
    }
  }
};
</script>