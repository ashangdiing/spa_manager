<template>
  <div class="index_page">
    <el-container class="index_container">
      <el-header>
        <span>管理系统</span>
        <el-button type="primary" @click="loginOut">退出</el-button>
      </el-header>
      <!-- 左边 -->
      <el-container>
        <el-aside width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
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

        <el-container>
          <el-main>
            <!-- 主体 -->
            <router-view></router-view>
          </el-main>

          <el-footer>@2019</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<script>
import router from ".././router/router.js";
import qs from "qs";
export default {
  data() {
    return {
      menuList: [
        
      ],
      isCollapse: false,
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
      permissionTypesString: "",
       permissionTypes: [0,1],
      currentLoginUser:{},

    };
  },
  created() {
    console.log("activeIndex", window.sessionStorage.getItem("activeIndex"));
    this.activeIndex = window.sessionStorage.getItem("activeIndex");
    this.getPermissionTree();
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
    getPermissionTree() {
      this.queryParams.permissionTypes="";
       this.permissionTypes.forEach((item,index,array )=>{
         this.permissionTypesString=this.permissionTypesString+"&permissionTypes="+item;
       });
       console.log("------->",this.queryParams.permissionTypes)
       this.currentLoginUser =  JSON.parse(window.localStorage.getItem("currentLoginUser"));
        console.log(this.currentLoginUser.id);
      this.$http
        .get("/api/rest/user/"+this.currentLoginUser.id+"/permission?1=1"+this.permissionTypesString, {params: this.queryParams})
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
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
    //点击按钮的切换折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    loginOut() {
      window.localStorage.clear();
      this.$messag.success("退出成功");
      router.push("/login");
    },
    // 保存激活菜单的路径
    saveState(activeIndex) {
      window.sessionStorage.setItem("activeIndex", activeIndex);
      this.activeIndex = activeIndex;
    }
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