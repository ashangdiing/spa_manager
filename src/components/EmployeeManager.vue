<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/employeeManager">员工管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="10" class="search">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryParams.queryString"
            @clear="clearSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <!-- //显示所有用户 -->
        <el-col :span="6">
          <el-radio-group v-model="queryParams.allStatus" size="mini" @change="changeStatus">
            <el-radio-button label="显示所有"></el-radio-button>
            <el-radio-button label="正常"></el-radio-button>
            <el-radio-button label="删除"></el-radio-button>
            <el-radio-button label="锁住"></el-radio-button>
            <el-radio-button label="离职"></el-radio-button>
          </el-radio-group>
        </el-col>

        <!-- 添加用户 -->
        <el-col :span="3">
          <el-button type="primary" @click="handelDialogAddVisibleShow()">添加人员</el-button>
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
        :data="employee.employeeList"
        :border="true"
        :highlight-current-row="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :reserve-selection="true"
      >
        <el-table-column label="编号" type="selection" width="60px"></el-table-column>
        <el-table-column label="编号" type="index" width="60px"></el-table-column>
        <el-table-column label="姓名" prop="custName"></el-table-column>
        <el-table-column label="账户" prop="userName" width="180px"></el-table-column>
        <el-table-column label="证件号码" prop="passportNumber" width="180px"></el-table-column>
        <el-table-column label="生日" prop="birthday" width="100px"></el-table-column>
        <el-table-column label="手机号码" prop="phone" width="120px"></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <div v-if="scope.row.sex==1">男</div>
            <div v-else>女</div>
          </template>
        </el-table-column>
        <el-table-column label="离职时间" prop="leaveOficeTime" width="120px"></el-table-column>
        <el-table-column label="状态">
          <!-- // scop.row 为当前行 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              :disabled="true"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑员工信息" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="handelDialogVisibleUpdateShowRow(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除员工信息" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handelConfirmDelete(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="查看员工信息" placement="top" :enterable="false">
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
        :total="employee.total"
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
          <el-form-item label="姓名" prop="custName">
            <el-input v-model="addForm.custName"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="userName">
            <el-input v-model="addForm.userName" :disabled="addForm.userNameDisabled"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="newPassword">
            <el-input v-model="addForm.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="证件号码" prop="passportNumber">
            <el-input v-model="addForm.passportNumber" :disabled="addForm.passportNumberDisabled"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="7">
              <el-form-item label="角色">
                <el-select v-model="addForm.allRole" value-key="id" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item"
                    default-first-option
                    filterable
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="7">
              <el-form-item label="状态">
                <el-select v-model="addForm.statusType" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in statusOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

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
            <el-form-item label="提成比例" prop="employeePercentageAmount">
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

          <el-row>
            <el-col :span="5">
              <el-form-item label="入职时间" prop="inductionTime">
                <el-date-picker
                  v-model="addForm.inductionTime"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="5">
              <el-form-item label="有效期" prop="expiresTime">
                <el-date-picker
                  v-model="addForm.expiresTime"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
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
  data() {
    //邮箱校验
    var checkEmail = (rule, value, callBack) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return callBack();
      }
      callBack(new Error("请输入合法的邮箱"));
    };
    var isPassword = (rule, value, callBack) => {
      console.log("isPassword", value);
      if (value == null) return callBack();
      if (value.trim().length < 1) return callBack();
      const regPassword = /^[_a-zA-Z0-9]+$/;
      if (regPassword.test(value)) {
        //合法的密码
        return callBack();
      }
      callBack(new Error("密码仅由英文字母，数字以及下划线组成"));
    };
    var isChar = (rule, value, callBack) => {
      const reg = /^[_a-zA-Z0-9]+$/;
      if (reg.test(value)) {
        //合法的密码
        return callBack();
      }
      callBack(new Error("账号仅由英文字母，数字以及下划线组成"));
    };
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
      // 状态枚举
      statusOptions: [
        {
          value: "0",
          label: "初始化"
        },
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "删除"
        },
        {
          value: "3",
          label: "锁住"
        },
        {
          value: "4",
          label: "离职"
        }
      ],

      queryParams: {
        startIndex: 0,
        pageSize: 5,
        status: 1,
        expirestime: "",
        queryString: "",
        currentPage: 1,
        allStatus: "正常"
      },

      addForm: {
        id: 0,
        userName: "dengwei",
        custName: "dengwei",
        newPassword: "@dmin01",
        email: "154926882@qq.com",
        phone: "18627283311",
        birthday: "",
        sex: 1,
        statusType: "1",
        status: "1",
        remark: "1",
        expiresTime: "",
        passportNumber: "421088198509113322",
        leaveOficeTime: "",
        inductionTime: "",
        employeeId: "",
        employeePercentageAmount: 0,
        allRole: [],
        disabled: false
      },
      multipleRoleSelection: [],
      employee: { employeeList: [], total: 0 },
      dialog: { dialogVisible: false, title: "添加" },
      passportNumberDisabled: false,
      userNameDisabled: false,
      roleOptions: [],
      // 多选参数接受属性
      multipleSelection: [],
      addFormRules: {
        userName: [
          { required: false, message: "请输入账号", trigger: "blur" },
          {
            min: 5,
            max: 40,
            message: "长度在 5 到 40 个字符",
            trigger: "blur"
          },
          {
            // 自定义校验规则
            validator: isChar,
            message: "账号仅由英文字母，数字以及下划线组成",
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: false, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          },
          {
            // 自定义校验规则
            validator: isPassword,
            message: "密码仅由英文字母，数字以及下划线组成",
            trigger: "blur"
          }
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
        age: [
          { required: false, message: "年龄不能为空" },
          { type: "number", message: "年龄必须为数字值" }
        ],
        email: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          {
            min: 5,
            max: 50,
            message: "长度在 5 到 50 个字符",
            trigger: "blur"
          },
          {
            // 自定义校验规则
            validator: checkEmail,
            message: "请输入合法的邮箱",
            trigger: "blur"
          }
        ],
        expiresTime: [
          {
            // type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
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
      //
    };
  },
  created() {
    this.getEmployeeList();
    this.getRoleOptions();
  },
  methods: {
    getEmployeeList() {
      this.$http
        .get("/api/rest/employee/?1=1", { params: this.queryParams })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.employee.employeeList = res.data.data;
          this.employee.total = res.data.total;
        });
    },
    getRoleOptions() {
      this.$http
        .get("/api/rest/role/?1=1", {
          params: { startIndex: 0, pageSize: 1000000, status: 1 }
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.roleOptions = res.data.data;
        });
    },
    clearSearch() {
      this.getEmployeeList();
    },
    search() {
      this.getEmployeeList();
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize;
      this.getEmployeeList();
    },
    // 当前页的改变 changeStatus
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryParams.startIndex =
        this.queryParams.pageSize * (this.currentPage - 1);
      this.getEmployeeList();
    },
    // 显示所有人状态 正常 或删除
    changeStatus() {
      if (this.queryParams.allStatus.indexOf("正常") > -1)
        this.queryParams.status = 1;
      else if (this.queryParams.allStatus.indexOf("删除") > -1)
        this.queryParams.status = 2;
      else if (this.queryParams.allStatus.indexOf("锁住") > -1)
        this.queryParams.status = 3;
      else if (this.queryParams.allStatus.indexOf("离职") > -1)
        this.queryParams.status = 4;
      else this.queryParams.status = -1;
      this.queryParams.currentPage = 1;
      this.queryParams.startIndex = 0;
      this.getEmployeeList();
    },
    // 关闭之前的提示
    handleDialogBeforeClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
        this.handelAddUser();
      else if (
        this.dialog.title.indexOf("修改") > -1 ||
        this.dialog.title.indexOf("编辑") > -1
      )
        this.handelUpdateUser();
      else if (this.dialog.title.indexOf("删除") > -1)
        this.handelConfirmDelete();
      this.getEmployeeList();
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
            this.handelDeleteUser(row);
          });
        })
        .catch(_ => {});
    },
    // 显示添加对话框
    handelDialogAddVisibleShow() {
      this.dialog.title = "添加员工信息";
      this.dialog.dialogVisible = true;
      this.addForm.disabled = false;
      this.addForm.passportNumberDisabled = false;
      this.addForm.userNameDisabled = false;
      this.addForm.status = 1;
    },
    // 显示当前数据
    handelDialogVisibleShowRow(row) {
      this.dialog.title = "查看员工信息";
      this.dialog.dialogVisible = true;
      this.dialogInitRow(row);
      this.addForm.disabled = true;
    },
    // 修改前的显示
    handelDialogVisibleUpdateShowRow(row) {
      this.dialog.title = "编辑员工信息";
      this.dialog.dialogVisible = true;
      this.dialogInitRow(row);
      this.addForm.disabled = false;
      this.addForm.passportNumberDisabled = true;
      this.addForm.userNameDisabled = true;
    },
    // 确认删除
    handelConfirmDelete(row) {
      this.dialogInitRow(row);
      this.$confirm("确认删除？")
        .then(_ => {
          // 如果确认则删除
          this.handelDeleteUser(row);
        })
        .catch(_ => {});
    },
    //添加提交
    handelAddUser() {
      // 新加人员 默认生效
      this.addForm.status = this.addForm.statusType;
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 添加用户管理信息
          this.$http.post("/api/rest/user/", this.addForm).then(res => {
            if (res.status > 300)
              return this.$messag.error(
                "添加用户失败：未知异常，resultStatusCode" + res.status
              );
            if (res.data.result != "SUCCESS")
              this.$messag.error(res.data.description);
            else this.$messag.success(res.data.description);
          });

          // 添加用户其他信息
          this.$http.post("/api/rest/employee/", this.addForm).then(res => {
            console.log(res);
            if (res.status > 300)
              return this.$messag.error(
                "添加用户失败：未知异常，resultStatusCode:" + res.status
              );
            this.$messag.success("添加员工信息成功");
          });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 执行删除
    handelDeleteUser(row) {
      this.dialogInitRow(row);
      // 删除用户信息
      this.$http
        .put("/api/rest/user/soft_delete/" + this.addForm.id, this.addForm)
        .then(res => {
          if (res.status > 300)
            return this.messag.error(
              "删除用户失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
        });
      // 删除用户其他信息
      this.$http
        .put("/api/rest/employee/soft_delete/" + row.employeeId, this.addForm)
        .then(res => {
          if (res.status > 300)
            return this.messag.error(
              "删除用户失败：未知异常，resultStatusCode" + res.status
            );
          this.$messag.success("修改员工信息成功");
        });
      this.getEmployeeList();
    },
    // 执行修改
    handelUpdateUser() {
      this.addForm.status = this.addForm.statusType;
      // 修改人员 默认生效
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 修改用户管理信息
          this.$http
            .put("/api/rest/user/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改用户失败：未知异常，resultStatusCode" + res.status
                );
              if (res.data.result != "SUCCESS") {
                this.$messag.error(res.data.description);
              } else {
                this.handelSaveUserRole();
                this.$messag.success(res.data.description);
              }
            });

          // 修改用户其他信息
          this.$http
            .put("/api/rest/employee/" + this.addForm.employeeId, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.messag.error(
                  "修改用户失败：未知异常，resultStatusCode" + res.status
                );
              this.$messag.success("修改员工信息成功");
            });
        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }
      });
    },
    // 给addfrom统一赋值
    dialogInitRow(row) {
      this.addForm.id = row.id;
      this.addForm.userName = row.userName;
       this.addForm.custName = row.custName;
      this.addForm.remark = row.remark;
      this.addForm.newPassword = row.newPassword;
      this.addForm.email = row.email;
      this.addForm.phone = row.phone;
      this.addForm.birthday = row.birthday;
      this.addForm.sex = row.sex;
      this.addForm.status = row.status;
      this.addForm.statusType = row.status + "";
      this.addForm.expiresTime = row.expiresTime;
      this.addForm.passportNumber = row.passportNumber;
      this.addForm.leaveOficeTime = row.leaveOficeTime;
      this.addForm.inductionTime = row.inductionTime;
      this.addForm.employeeId = row.employeeId;
      this.addForm.employeePercentageAmount = row.employeePercentageAmount;
      this.getUserRoles();
    },
    // 根据userid查询角色
    getUserRoles() {
      this.$http
        .get("/api/rest/user/" + this.addForm.id + "/role/?1=1", { params: {} })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.addForm.allRole = res.data.data;
        });
    },
    handelSaveUserRole() {
      let roleids = new Array();
      this.addForm.allRole.forEach((item, index, arry) => {
        roleids.push(item.id);
      });
      console.log("roleids:", roleids);
      this.$http
        .put("/api/rest/user/" + this.addForm.id + "/role/", roleids)
        .then(res => {
          if (res.status != 200)
            return this.messag.error(
              "修改角色失败：未知异常，resultStatusCode" + res.status
            );
          if (res.data.result != "SUCCESS")
            this.$messag.error(res.data.description);
          else this.$messag.success(res.data.description);
        });
    }
  }
};
</script>


<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
</style>
