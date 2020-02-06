<template>
  <div class="login_page">
    <el-container>
      <el-main>
        <section class="form_contianer">
          <el-row :gutter="8" class="title">
            <el-col :span="8" :offset="8">
              <h2>管理登录</h2>
            </el-col>
          </el-row>

          <el-row :gutter="8">
            <el-col :span="8" :offset="8">
              <div class="grid-content bg-purple-light">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="用户名:">
                    <el-input prefix-icon="el-icon-user-solid" v-model="form.userName"></el-input>
                  </el-form-item>
                  <el-form-item label="密码:" prop="pass">
                    <el-input
                      prefix-icon="el-icon-s-goods"
                      type="password"
                      v-model="form.password"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
                    <el-button type="primary" @click="submitForm('form')">登录</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </section>
      </el-main>
      <footer>@2019</footer>
    </el-container>
  </div>
</template>


<script>
import qs from "qs";
import Storage from '@/utils/globalStore.js' // storage工具类，简单的封装
import router from ".././router/router.js";
export default {
  data() {
    return {
      form: {
        userName: "admin ",
        password: "admin01",
        rememberMe: false,
        verificationCode: "1"
      }
      // ruleForm: {
      //   pass: "",
      //   checkPass: "",
      // },
      // rules: {r
      //   pass: [{ validato: validatePass, trigger: "blur" }],
      //   checkPass: [{ validator: validatePass2, trigger: "blur" }],
      //   age: [{ validator: checkAge, trigger: "blur" }]
      // }
    };
  },
  created() {
      
     this.form.rememberMe=Storage.localGet("rememberMe");
     if(this.form.rememberMe==undefined)
        this.form.rememberMe=false;
  },
  methods: {
    submitForm(formName) {
        console.log(" this.form.rememberMe:::", this.form.rememberMe)
      //设置本次登录是否记住
      Storage.localSet("rememberMe", this.form.rememberMe);
        if(Storage.localGet("rememberMe")){
           router.push("/index");
           return ;
        }
        console.log("rememberMe------------------------>>>>",this.form.rememberMe);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            ({
              url: "/user/api/rest/admin/user_login",
              method: "post",
              data: qs.stringify(this.form),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
           //   this.$http.defaults.headers['Content-Type'] = 'application/json';
              if (res.status != 200) return this.messag.error("登录异常");
              this.loginHandel(res.data, res.headers);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loginHandel(data, headers) {
      if (data.result != "SUCCESS") {
        this.$messag.error(data.info);
      } else {
        let authorizationInfo={};
        authorizationInfo.authorization=headers.authorization;
        Storage.localSet("authorizationInfo", authorizationInfo);
        Storage.localSet("currentLoginUser", data.data);
        Storage.localSet("rememberMe", this.form.rememberMe);
        router.push("/index");
        this.$messag.success(data.info);
      }
    },
    resetForm(formName) {
      //   this.$refs[formName].resetFields();
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

      console.log("clock" + newTime);
      return newTime;
    },
  }
};
</script>
<style lang="less" scoped>
.login_page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/img/login.jpg) no-repeat center center;
  background-size: 100% 100%;
  color: rgb(0, 0, 0);
}
.form_contianer {
  border-radius: 50px;
  padding-top: 15%;
  text-align: center;
}
</style>