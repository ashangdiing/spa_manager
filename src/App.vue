<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" /> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>


#app {
 
  height: 100%;
}
.el-checkbox__inner{
  border: solid 1px #666;
}
.el-table__row--striped{
   color: blue;
}
.box-card {
  width: 100%;
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important ;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}
.search{
  margin-bottom: 20px;
}
 .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
/*
	找到html标签、body标签，和挂载的标签
	都给他们统一设置样式
*/
  html,body,#app,.el-container{
        /*设置内部填充为0，几个布局元素之间没有间距*/
        padding: 0px;
         /*外部间距也是如此设置*/
        margin: 0px;
        /*统一设置高度为100%*/
        height: 100%;
    }

</style>
