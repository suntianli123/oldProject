/**
 * ajax实例，如需调用其他服务请单独创建实例
 */


import axios from 'axios';
import config from '../../config/config';
import main from '../../libs/common';
import md5 from 'blueimp-md5';
import utils from '../../libs/utils';

const ajax = axios.create({
    baseURL: config.apiUrlNew,
    timeout: 120000,
	transformRequest: [data => {
		return main.apiSign(data);
	}]
});

// 请求之前做拦截
ajax.interceptors.request.use(
    config => {
        const signSalt = '2018tokenyutang';
        const t = Math.round(new Date().getTime()).toString();
        config.headers.platform = 'Web';
        config.headers.terminal = 'H5';
        config.headers.version = '1.0.0';
        config.headers.t = t;
        config.headers.sign = md5(t + signSalt);
	    config.headers.ticket = utils.getCookie('appTicket');
	    //config.headers.ticket = '543eb366-b9e5-4bce-bea7-dbee5c391652.1556346847693.ff80808160e930f20160e9490b120002.Web.2c23a44dfdd5d8c3032364fc8986cdf2';
        return config;
    },
    error => Promise.reject(error)
);

// 请求之后做拦截
ajax.interceptors.response.use(
    response => {
        let result = response.data;
        if (result && result.ticket) {
            utils.setCookie('appTicket', result.ticket, 24);
        }
        var appTicket = utils.getCookie('appTicket');
        if (appTicket && appTicket.indexOf(localStorage.userId) < 0) {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            if (main.is_weixn()) {
            	setTimeout(function () {
		            window.location.reload();
	            },300)
            } else {
	            if(location.href.indexOf("localhost")>0){
		            location.href = 'login.html';
	            }else{
		            main.jumpIndex();
	            }
            }
        }

        if (result && result.code && result.code >= 995 && result.code <= 999) {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            if (main.is_weixn()) {
	            setTimeout(function () {
		            window.location.reload();
	            },300)
            } else {
                if(location.href.indexOf("localhost")>0){
	                location.href = 'login.html';
                }else{
	                main.jumpIndex();
                }
            }

        }
        return response;
    },
    error => {
        console.log('chuowu');
        return Promise.reject(error);
    }
);

export default ajax;
