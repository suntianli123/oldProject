/**
 * ajax实例，如需调用其他服务请单独创建实例
 */


import axios from 'axios';
import config from '../../config/config';
import main from '../../libs/common';

const ajax = axios.create({
    baseURL: config.apiURL,
    timeout: 120000,
    transformRequest: [data => {
        return main.apiSign(data);
    }],
});

// // 请求之前做拦截
// ajax.interceptors.request.use(
//     config => {
//         return config;
//     },
//     error => Promise.reject(error)
// );
//
// // 请求之后做拦截
// ajax.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         console.log("chuowu")
//         return Promise.reject(error);
//     }
// );
//
export default ajax;
