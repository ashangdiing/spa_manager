/**
* 全局变量 和 设置 、配置等。。。
*/

import Storage from '@/utils/globalStore.js' // storage工具类，简单的封装
import axios from "axios"
export default function () {
    /* 请求拦截器 */
    axios.interceptors.request.use(function (config) { // 每次请求时会从localStorage中获取token
        let authorizationInfo = Storage.localGet('authorizationInfo');
        // console.log(authorizationInfo, 'authorizationInfo');
        if (authorizationInfo) {
            // 把token加入到默认请求参数中
            config.headers.common['Authorization'] = authorizationInfo;
        }
        return config
    }, function (error) {
        console.log(error);
    })

    /* 响应拦截器 */

    axios.interceptors.response.use(function (response) { // ①10010 token过期（30天） ②10011 token无效
        console.log(response,"response------>");
        if (response.data.code === 10010 || response.data.code === 10011) {
              
            // Storage.localRemove('token') // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）
            // router.replace({
            //     path: '/login' // 到登录页重新获取token
            // })
        }  
        return response
    }, function (error) {
        console.log(error);
    })
}

