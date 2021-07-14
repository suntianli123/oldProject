
let utils = {};

//检测是否为微信浏览器
utils.is_weixn = function () {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
};

utils.getCookie = function (name) {
	var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
};
utils.setCookie = function (name, value, Hours) {
	var exp = new Date();
	exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
	document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + '; path=/';
};

//补零
utils.toDub = function (n) {
	return n < 10 ? '0' + n : '' + n;
};

//js替换location.href的参数的方法
utils.replaceQuery = function (para, value) {
	var s = window.location.href;
	var re = new RegExp('.html', 'g');
	var arr = s.match(re);
	var num = arr ? arr.length : 1;
	var search;
	if (num === 1) {
		search = decodeURIComponent(window.location.search);
	} else if (num === 2) {
		search = s.substr(s.lastIndexOf('.html') + 5);
	}
	
	if (search == '') {
		search = '?' + para + '=' + value;
	} else if (search.indexOf(para) == -1) {
		search += '&' + para + '=' + value;
	} else {
		var reg = new RegExp(para + '=[^&]*');
		search = search.replace(reg, para + '=' + value);
	}
	return search;
};

//js获取location.href的参数的方法
utils.getQuery = function (para) {
	var s = window.location.href;
	var re = new RegExp('[.]html', 'g');
	var arr = s.match(re);
	var num = arr ? arr.length : 1;
	var reg = new RegExp('(^|&)' + para + '=([^&]*)(&|$)');
	var search;
	if (num === 1) {
		search = decodeURIComponent(window.location.search);
	} else if (num === 2) {
		search = s.substr(s.lastIndexOf('.html') + 5);
	}
	var r = search.substr(1).match(reg);
	if (r) {
		return unescape(r[2]);
	}
	return '';
};

//把对象转换为字符串拼接
utils.createVarsStrByObj = function (obj) {
	var str = '';
	for (var key in obj) {
		var encodeKeyValue = encodeURIComponent(obj[key]);
		str += key + '=' + encodeKeyValue + '&';
	}
	str = str.slice(0, str.length - 1);
	return str;
};


//更新订单推荐人userId
utils.updateRecommendUserId = function () {
	var recommendUserId = this.getQuery('fromUserId');//formUserId获取
	if (!recommendUserId) {
		return;
	} else {
		sessionStorage.recommendUserId = recommendUserId;
	}
};


utils.toDefaultPage = function (routers, name, route, next) {
	let len = routers.length;
	let i = 0;
	let notHandle = true;
	while (i < len) {
		if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
			route.replace({
				name: routers[i].children[0].name
			});
			notHandle = false;
			next();
			break;
		}
		i++;
	}
	if (notHandle) {
		next();
	}
};

utils.getSymbol = function (strHtml) {
	if (strHtml.indexOf("?") < 0) {
		return "?";
	} else {
		return "&";
	}
}

//判断终端是ios还是安卓
utils.IOSorAndroid=function() {
	var accessTerminal = "";
	var sUserAgent = navigator.userAgent.toLowerCase();
	
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if(bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
		accessTerminal = "android";
	}else{
		accessTerminal = "iospc";
	}
	return accessTerminal;
}

/**
 * 获得随机数
 * 用途：分享连接拼接
 * @returns {string}
 */
utils.getRandomNum = function () {
	return Math.ceil(Math.random() * 10000).toString();
}

//统计工具
utils.StringTools = {
	//转码
	getEncodeURI: function (url) {
		return encodeURIComponent(url);
	},
	//解码
	getDecodeURI: function (url) {
		return decodeURIComponent(url);
	},
	//生成UUID
	generateUUID: function () {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	},
	isEmpty: function (str) {
		if (str === "" || str === null
			|| typeof str === 'undefined' || str == 'undefined') {
			return true;
		}
		return false;
	},
	strlen: function (str) {   //js获取字符串字节数
		var len = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			//单字节加1
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				len++;
			}
			else {
				len += 2;
			}
		}
		return len;
	}
};

//load加载
utils.loadJs=function(loadUrl,callMyFun){
	var loadScript=document.createElement('script');
	loadScript.setAttribute("type","text/javascript");
	loadScript.setAttribute('src',loadUrl);
	document.getElementsByTagName("head")[0].appendChild(loadScript);
	$.getScript(loadUrl).done(function() {callMyFun()});
}


/**
 * 时分秒 格式： 5天 0 9 ：1 9 ： 2 0  7 应用在 天时分秒毫秒  数字都不在一起的情况下
 * num 时间 timer 倒计时秒 millsTimeBool 是否是毫秒
 */
var setTimeMillsTime = 9;
var yutangPublicSetTimeObjDaysSix = '';//第一个对象
var yutangPublicSetTimeObjDayHour = '';//第2个对象
utils._setTimeNumDaysSix = function (num,timer, callback,backOver) {
	yutangPublicSetTimeObjDaysSix = setTimeout(function () {
		if(num>0){
			if(timer == 100){
				if(setTimeMillsTime<1){
					setTimeMillsTime = 9;
					num -= 1;
				}else{
					setTimeMillsTime--;
				}
			}else{
				num -= 1;
			}
			
			var day2 = parseInt(num / 60 / 60 / 24);
			day2 = day2>9?day2:"0"+day2;
			var hours2 = parseInt(num / 60 / 60 % 24);
			hours2 = hours2>9?hours2:"0"+hours2;
			var minutes2 = parseInt(num / 60 % 60);
			minutes2 = minutes2>9?minutes2:"0"+minutes2;
			var seconds2 = parseInt(num % 60);
			seconds2 = seconds2>9?seconds2:"0"+seconds2;
			
			var obj={};
			
			obj.timerCountDown8 = (seconds2).toString().substring(1,2);
			obj.timerCountDown7 = (seconds2).toString().substring(0,1);
			obj.timerCountDown6 = (minutes2).toString().substring(1,2);
			obj.timerCountDown5 = (minutes2).toString().substring(0,1);
			obj.timerCountDown4 = (hours2).toString().substring(1,2);
			obj.timerCountDown3 = (hours2).toString().substring(0,1);
			obj.timerCountDown2 = (day2).toString().substring(1,2);
			obj.timerCountDown1 = (day2).toString().substring(0,1);
			if(timer == 100) {
				obj.millsTime = setTimeMillsTime;
			}
			// num -= 1;
			
			callback && callback(obj);
			utils._setTimeNumDaysSix(num, timer, callback, backOver);
		}else{
			backOver && backOver();
		}
	},timer)
}

/**
 *天 时 分 秒  7 01 02 58   天前面不加0
 */
utils._setTimeDayHour = function(num, timer, callback, backOver){
	var _self = this;
	yutangPublicSetTimeObjDayHour = setTimeout(function () {
		if(num>0){
			var obj={};
			var days = parseInt(num / 60 / 60 / 24);
			obj.days = days;
			var hours = parseInt(num / 60 / 60 % 24);
			obj.hours = hours>9?hours:"0"+hours;
			var minutes = parseInt(num / 60 % 60);
			obj.minutes = minutes>9?minutes:"0"+minutes;
			var seconds = parseInt(num % 60);
			obj.seconds = seconds>9?seconds:"0"+seconds;
			
			num -= 1;
			
			callback && callback(obj);
			utils._setTimeDayHour(num, timer, callback,backOver);
		}else{
			backOver && backOver();
		}
	},timer)
}
//清除定时器
utils.yutangPublicClearTimeout = function () {
	clearTimeout(yutangPublicSetTimeObjDaysSix);
	clearTimeout(yutangPublicSetTimeObjDayHour);
}

export default utils;

//目前tag版本： 0.2.5
