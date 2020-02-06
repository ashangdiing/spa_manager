<template>
  <div class="index_page">
    <el-container class="index_container">
      <el-header>
       
           <el-col :span="6"> 
        <span>管理系统</span>
        </el-col>
        
        <el-col :span="4"> 
           <el-link icon="el-icon-user"  @click="handelDialogVisibleUpdateShowRow">{{currentLoginUser.custName}}</el-link>
            <el-divider direction="vertical"></el-divider>
          <el-link icon="el-icon-switch-button"  @click="loginOut"></el-link>
        <!-- <el-button type="primary" @click="loginOut">退出</el-button> -->
        </el-col>
      </el-header>
      <!-- 左边 -->
      <el-container>
        <el-aside width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse" >|||</div>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
           
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse-transition="false"
            :router="true"
          >
            <!-- index 只接收字符串 -->
            <!-- <div v-for="item in menuList" :key="item.id">
              <el-submenu v-if="item.children.length> 0" :index="item.path">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.menuName}}</span>
                </template>

                <el-menu-item
                  :index="subItem.path"
                  v-for="subItem in item.children"
                  :key="subItem.id"
                  @click="saveState(subItem.path)"
                >
                  <template slot="title">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{subItem.menuName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>

              <el-menu-item v-else :index="item.path" :key="item.id" @click="saveState(item.path)">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.menuName}}</span>
                </template>
              </el-menu-item>
            </div>-->

            <!-- <div  v-for="item in menuList" :key="item.id" >
             <el-submenu v-if="item.children.length> 0" :index="item.path">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.menuName}}</span>
              </template>

              <el-menu-item
                :index="subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveState(subItem.path)"
              >
                <template slot="title">
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{subItem.menuName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
           
              <el-menu-item v-else
                :index="item.path"
                :key="item.id"
                 @click="saveState(item.path)"
              >
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.menuName}}</span>
                </template>
              </el-menu-item>
            </div>-->

            <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="item.showIconClass"></i>
                <span slot="title">{{item.label}}</span>
              </template>

              <el-menu-item
                :index="subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveState(subItem.path)"
              >
                <template slot="title">
                  <i :class="subItem.showIconClass"></i>
                  <span slot="title">{{subItem.label}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
         
        <el-container >
          <el-main>
            <!-- 主体 -->
            <div   @mousemove="updateOperateTime"  > 
            <router-view  ></router-view>
            </div>
          </el-main>
  
          <el-footer>@2019   ©  copyright augustwei</el-footer>
        </el-container>
      </el-container>
    </el-container>


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
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          
          <el-form-item label="电话">
            <el-input v-model="addForm.phone"></el-input>
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
         <el-form-item label="备注">
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
import router from ".././router/router.js";
import Storage from '@/utils/globalStore.js' // storage工具类，简单的封装
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
      menuList: [
        
      ],
      isCollapse: false,
      currentLoginUser:{},
      loginTimeOut: 30*60,
      tokenInterval:{},
      initSuccess: false,
      isLoginout:false,
      activeIndex: "/workbench",
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
       addForm: {
        id: 0,
        userName: "dengwei",
        custName: "dengwei",
        newPassword: "@dmin01",
        email: "154926882@qq.com",
        phone: "18627283311",
        birthday: "",
        sex: 1,
        disabled: false,
        userNameDisabled: true
      },
      addFormRules: {
        custName: [
          { required: false, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 40, message: "长度在 5 到 40 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
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
          { required: true, message: "年龄不能为空" },
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
      permissionTypesString: "",
       permissionTypes: [0,1],
      currentLoginUser:{},
      dialog: { dialogVisible: false, title: "修改信息" },
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
      },
    };
  },
  created() {
    console.log("activeIndex", window.sessionStorage.getItem("activeIndex"));
       
    this.activeIndex = window.sessionStorage.getItem("activeIndex");
     this.currentLoginUser = JSON.parse(  window.localStorage.getItem("currentLoginUser"));
       this.refreshUserToken();
      // this.tokenInterval=setInterval(this.refreshUserToken, 5000);
       setInterval(this.refreshUserToken, 5*60*1000);
  },

//   1、qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'indices' })
// // 输出结果：'a[0]=b&a[1]=c'
// 2、qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })
// // 输出结果：'a[]=b&a[]=c'
// 3、qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
// // 输出结果：'a=b&a=c'
// 4、qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'comma' })
// 输出结果：'a=b,c'

  methods: {
    //不偶去权限
    getPermissionTree() {
      this.queryParams.permissionTypes="";
       this.permissionTypes.forEach((item,index,array )=>{
         this.permissionTypesString=this.permissionTypesString+"&permissionTypes="+item;
       });
       console.log("queryParams.permissionTypes------->",this.queryParams.permissionTypes)
       this.currentLoginUser =  JSON.parse(window.localStorage.getItem("currentLoginUser"));
        console.log(this.currentLoginUser.id);
      this.$http
        .get("/api/rest/user/"+this.currentLoginUser.id+"/permission?1=1"+this.permissionTypesString, {params: this.queryParams})
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          console.log(" res.data", res.data)
          this.menuList = res.data.data[0].children;
          console.log("menuList:",this.menuList);
        });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //关闭之后的情况表单
    handleDialogClose(done) {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮的切换折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //鼠标移动事件，更新时间，超时不动退出
    updateOperateTime(){
      // 设置登录时长，超过多久自动退出
        Storage.localSet("lastOperateTime", this.getDateTime());
    },
    // 退出
    loginOut() {
      // 退出不需要发请求
      this.isLoginout=true;
       clearInterval(this.tokenInterval);
      if(!JSON.parse(window.localStorage.getItem("rememberMe")))
      {
        window.localStorage.clear();
      // window.localStorage.removeItem("currentLoginUser");
      //  window.localStorage.removeItem("authorizationInfo");
      //   window.localStorage.removeItem("rememberMe");
        }
      this.$messag.success("退出成功");
      router.push("/login");
    },
        // 修改前的显示
    handelDialogVisibleUpdateShowRow() {
      this.dialog.title = "修改个人信息";
      this.dialog.dialogVisible = true;
      this.dialogInitRow();
      this.addForm.disabled = false;
      this.addForm.userIdDisabled = true;
    },
    // 保存激活菜单的路径
    saveState(activeIndex) {
      window.sessionStorage.setItem("activeIndex", activeIndex);
      this.activeIndex = activeIndex;
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
      // this.getEmployeeList();
    },
        //添加提交
    handelAddUser() {
      // 新加人员 默认生效
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

          // // 添加用户其他信息
          // this.$http.post("/api/rest/employee/", this.addForm).then(res => {
          //   console.log(res);
          //   if (res.status > 300)
          //     return this.$messag.error(
          //       "添加用户失败：未知异常，resultStatusCode:" + res.status
          //     );
          //   this.$messag.success("添加员工信息成功");
          // });

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
          // 修改用户管理信息
          this.$http
            .put("/api/rest/user/updateSelf/" + this.addForm.id, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(
                  "修改用户失败：未知异常，resultStatusCode" + res.status
                );
              if (res.data.result != "SUCCESS") {
                this.$messag.error(res.data.description);
              } else {
                // this.handelSaveUserRole();
                this.$messag.success(res.data.description);
              }
            });

          // // 修改用户其他信息
          // this.$http
          //   .put("/api/rest/employee/" + this.addForm.employeeId, this.addForm)
          //   .then(res => {
          //     if (res.status > 300)
          //       return this.messag.error(
          //         "修改用户失败：未知异常，resultStatusCode" + res.status
          //       );
          //     this.$messag.success("修改员工信息成功");
          //   });

        } else {
          this.$messag.error("填写的信息,校验不通过");
          return false;
        }

      });
    },
    // 给addfrom统一赋值
    dialogInitRow() {
      this.addForm.id = this.currentLoginUser.id;
      this.addForm.userName = this.currentLoginUser.userName;
      this.addForm.custName = this.currentLoginUser.custName;
      this.addForm.remark = this.currentLoginUser.remark;
      this.addForm.userId = this.currentLoginUser.userId;
      this.addForm.newPassword = this.currentLoginUser.newPassword;
      this.addForm.email = this.currentLoginUser.email;
      this.addForm.phone = this.currentLoginUser.phone;
      this.addForm.birthday = this.currentLoginUser.birthday;
      this.addForm.sex = this.currentLoginUser.sex;
      // this.addForm.status = this.currentLoginUser.status;
      // this.addForm.statusType = this.currentLoginUser.status + "";
      this.addForm.expiresTime = this.currentLoginUser.expiresTime;
      // this.addForm.passportNumber = this.currentLoginUser.passportNumber;
      // this.addForm.leaveOficeTime = this.currentLoginUser.leaveOficeTime;
      // this.addForm.inductionTime = this.currentLoginUser.inductionTime;
      // this.addForm.employeeId = this.currentLoginUser.employeeId;
      // this.addForm.employeePercentageAmount = this.currentLoginUser.employeePercentageAmount;
    },
    // 定时刷新token
    refreshUserToken(){
       // 退出不需要发请求
           if(this.isLoginout){
             return ;
           }

        // 设置登录时长，超过多久自动退出
        let lastOperateTime=Storage.localGet("lastOperateTime");
        if(lastOperateTime== undefined){
          lastOperateTime=this.getDateTime();
         Storage.localSet("lastOperateTime", lastOperateTime);
        }
        let timeoutTemp=new Date()-new Date(lastOperateTime);
        timeoutTemp=timeoutTemp/1000;
        console.log("离最后的操作时间为:",timeoutTemp,"秒，最后操作时间：",lastOperateTime,"超时时间设置为:",this.loginTimeOut);
        if(timeoutTemp>this.loginTimeOut){
            this.loginOut();
        }

      let rememberMe=JSON.parse(window.localStorage.getItem("rememberMe"));
         this.$http.put("/api/rest/user/refresh_user_token/" +  this.currentLoginUser.userName+'?rememberMe='+rememberMe, this.addForm)
            .then(res => {
              if (res.status > 300)
                return this.$messag.error(  "获取token失败：未知异常，resultStatusCode" + res.status );
              // this.$messag.success("获取权限信息成功");
              if(res.data.result=="SUCCESS"){
               Storage.localSet("authorizationInfo",res.data.data);
               if(!this.initSuccess)
               {
                this.getPermissionTree();
                this.initSuccess=true;
               }
               }else this.loginOut();
            });
      
    },
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
      return newTime;
    },
  }
};
</script>
<style lang="less" scoped>
.index_page {
  //   background: url(../assets/img/login.jpg) no-repeat center center;
  //   height: 800px;
  height: 100%;
  background-size: 100% 100%;
  //   background-color: rgb(34, 157, 240);
  color: rgb(0, 0, 0);
}

.el-header {
  background-color: #373d41;
  color: rgb(253, 252, 252);
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  // padding-left: 0;
  align-items: center;
}

.el-aside {
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 100%;
  border-right: none;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

// 导航默认配置
.el-menu-vertical-demo {
  min-height: 400px;

  float: left;
  overflow-y: auto;
}
.iconfont {
  margin-left: 10px;
}

.toggle-button {
  background-color: #333744;
  font-size: 10px;
  line-height: 24px;
  color: #e9eef3;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>