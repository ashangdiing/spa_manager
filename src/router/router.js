import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '.././components/Login.vue'
import Index from '.././components/Index.vue'
import EmployeeManager from '.././components/EmployeeManager.vue'
import PermissionManager from '.././components/PermissionManager.vue'
import Workbench from '.././components/Workbench.vue'
import CustomerManager from '.././components/CustomerManager.vue'
import RoleManager from '.././components/RoleManager.vue'
import Transaction from '.././components/Transaction.vue'
import DayReport from '.././components/DayReport.vue'
import WorkOrderManager from '.././components/WorkOrderManager.vue'

import MonthReport from '.././components/MonthReport.vue'
import ProjectManager from '.././components/ProjectManager.vue'
import Storage from '@/utils/globalStore.js' // storage工具类，简单的封装
Vue.use(VueRouter)

var vRouter = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      redirect: '/permissionManager',
      component: Index,
      children: [
        {
          path: '/permissionManager',
          component: PermissionManager
        },
        {
          path: '/roleManager',
          component: RoleManager
        },
        {
          path: '/employeeManager',
          component: EmployeeManager
        },
        {
          path: '/workOrderManager',
          component: WorkOrderManager,
        },
        {
          path: '/workbench',
          component:  Workbench
        }
        ,
        {
          path: '/customerManager',
          component: CustomerManager
        }
        ,
        {
          path: '/transaction',
          component: Transaction
        }
        ,
        {
          path: '/dayReport',
          component: DayReport
        },
        {
          path: '/monthReport',
          component: MonthReport
        },
        {
          path: '/projectManager',
          component: ProjectManager
        }
      ]
    }
  ]
})
//挂载路由导航收尾
vRouter.beforeEach(
  (to, from, next) => {
    // to 将要访问的路径
    //from 从那个路径跳转
    // next  放行 ，next('/login') 强制跳转
    if (to.path == '/login') return next();
    // 如果为空直接返回
    // if (window.localStorage.getItem("authorization") == null) next('/login');
    if (Storage.localGet("authorizationInfo") == null) next('/login');
    next();
  }
)
export default vRouter