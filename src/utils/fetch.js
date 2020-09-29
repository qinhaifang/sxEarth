import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

const AUTHOR = 'Authorization';

// 创建axios实例
const service = axios.create({});

// 添加请求拦截器
// service.interceptors.request.use((config) => {
//     const token = sessionStorage.getItem('token');
//     // 使每个请求都携带token
//     if (token) {
//         config.headers[AUTHOR] ='Bearer '+ 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaW5ncXgiLCJleHAiOjE1Njg3NDgzMDEsIm5iZiI6MTU2ODcwNTEwMX0.foP9HR1J8sibVMcDO07_8UHz3-KRjQMEz5zPczT79mc';
//         config.headers.username =sessionStorage.getItem('username');
//     }
//     return config;
// }, error => Promise.reject(error));

// 添加相应拦截器
service.interceptors.response.use((response) => {
    // 当返回中自定义的代码有权限问题时, 进行相应的控制
    const res = response.data;
    if (response.status === 401 || res.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        sessionStorage.removeItem('token');
        this.$router.push('/login');
      });
      return Promise.reject('error');
    }
    if (response.status !== 200 && res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000,
        showClose: true,
      });
    } else {
      return res;
    }
    return res;
  }, ({ message, response }) => {
    let messageMsg = null;
    if (response) {
      // messageMsg = '操作异常';
      messageMsg = response.data.msg;
      switch (response.data.status) {
        case 404:
          messageMsg = '404-访问资源未发现';
          break;
        case 400:
          messageMsg = '错误的请求';
          break;
        default:
          messageMsg = response.data.message || messageMsg || response.data.status || response.status;
          break;
      }
    } else {
      messageMsg = message;
    }
    Message({
      message: messageMsg,
      type: 'error',
      duration: 5 * 1000,
      showClose: true,
    });
    return Promise.reject(messageMsg);
  });
  export default service;