/**
 * Created by yudeyu on 2018/7/9.
 */

import config from '../config/config.js';
import utils from './utils.js';
import md5 from 'blueimp-md5';
import querystring from 'querystring';
import LockFans from '../api/LockFans';
import HomeAccount from '../api/HomeAccount';
import PersonalCenter from '../api/PersonalCenter';
import User from '../api/User';
import Common from '../api/Common';
import ShareLaboratory from '../api/ShareLaboratory';
import DynamicQrBackground from '../api/DynamicQrBackground';

let userID = config.userID;
let token = config.token;
let myselfUserID = config.myselfUserID;

let main = {};

main.apiSign = function (data) {
	data = data || {};
	data.uncache = 123 * Math.random();
	data.token = config.token;
	const params = Object.keys(data).sort();
	let sign = '';
	params.forEach(item => {
		sign += data[item];
	});
	sign += config.publicKey;
	data.sign = md5(sign);
	return querystring.stringify(data);
};

// 一进页面即调用的方法
main.init = function () {
	if(utils.getQuery("webPlatform") == 1){
		sessionStorage.webPlatform = 1;
	}
	this.tengxunTotleFun();//腾讯统计
	this.baiduTotleFun();//baidu统计
	this.checkUserInterval();//
	this.appFromSetFun();//App来源
	this.addGio();//gio初始化
	this.dataReporting();//数据10s上报
	this.setChannel();
	this.setBelong();
	this.updateRecommendUserId();
	this.YtrecordUserLogin();    // 虚拟货币清零平台埋点
	this.windowErrorFun();//报错上报
	this.titleChangeFunCookie();//修改页面title 环境提示
	this.fontSizeChangeModel();//Android微信中，借助WeixinJSBridge对象来阻止字体大小调整
	if (userID && myselfUserID && userID !== myselfUserID) {
		main.checkMainAccount();
	}

	var fromUserId = utils.getQuery('fromUserId'); // formUserId获取
	if (fromUserId === null || fromUserId === '') {
		if (sessionStorage.fromUserId !== undefined) {
			fromUserId = sessionStorage.fromUserId;
		} else {
			fromUserId = '';
		}
	} else {
		sessionStorage.fromUserId = fromUserId;
	}

	// 外部链接进入 其他公众号引流 (param outer = 1)  qrPay = 1      qrPay = 2百度分期       qrPay = 3京东白条       qrPay = 4招商分期
	//       qrPay = 5渔塘分期      qrPay = 6咖啡易融SC   qrPay = 7 银联支付
	if (utils.getQuery("outer") && utils.getQuery("outer") == 1) {
		sessionStorage.setItem("qrPay", "1");
	} else if (utils.getQuery("outer") && utils.getQuery("outer") == 2) {
		sessionStorage.setItem("qrPay", "2");
	} else if (utils.getQuery("outer") && utils.getQuery("outer") == 3) {
		sessionStorage.setItem("qrPay", "3");
	} else if (utils.getQuery("outer") && utils.getQuery("outer") == 4) {
		sessionStorage.setItem("qrPay", "4");
	} else if (utils.getQuery("outer") && utils.getQuery("outer") == 5) {
		sessionStorage.setItem("qrPay", "5");
	} else if (utils.getQuery("outer") && utils.getQuery("outer") == 6) {
		sessionStorage.setItem("qrPay", "6");
	} else if(utils.getQuery("outer") && utils.getQuery("outer") == 7){
        sessionStorage.setItem("qrPay", "7");
    }

};

//判断用户是否下载APP
main.whetherToLogInByTerminal = function () {
	return new Promise(function (resolve, reject) {
		let params = {};
		params.terminal = main.getFromApp()? main.getFromApp(): "APP";
		User.whetherToLogInByTerminal(params).then((data) => {
			resolve(data);
		});
	})
}

main.fontSizeChangeModel = function () {
	//Android微信中，借助WeixinJSBridge对象来阻止字体大小调整
	try {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			handleFontSize();
		} else {
			if (document.addEventListener) {
				document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
			} else if (document.attachEvent) {
				//IE浏览器，非W3C规范
				document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
			}
		}
		// noinspection JSAnnotator
		function handleFontSize() {
			// 设置网页字体为默认大小
			WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
			// 重写设置网页字体大小的事件
			WeixinJSBridge.on('menu:setfont', function () {
				WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
			});
		}
	} catch (e) {
	}
}

//
main.YtrecordUserLogin = function () {
	var time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();    // 当前天时间戳
	if (time > (localStorage.getItem('goldResetCommon') || !localStorage.getItem('goldResetCommon'))) {
		var terminal = "", version = navigator.userAgent;
		if (main.browserRedirect() == "pc") {
			if (version.indexOf("Windows") != -1) {
				terminal = "pc-windows";
			} else {
				terminal = "pc-mac";
			}
		} else {
			terminal = "H5";
		}
		var param = {};
		param.userId = userID;
		param.terminal = terminal;
		param.version = "";
		param.network = main.getNetworkType();
		User.recordUserLogin(param).then(data => {
			localStorage.setItem('goldResetCommon', time);
		});
	}
}

//初始化APP来源
main.appFromSetFun = function () {
	var appTicket = utils.getQuery("appTicket");
	if (appTicket) {
		utils.setCookie("appTicket", appTicket, 1);
	}
	var fromApp = utils.getQuery("fromApp"); // IOS\Android
	if (fromApp) {
		utils.setCookie("web_login_cookie", "1",24);//web登陆24小时
		sessionStorage.setItem("fromApp", fromApp);//来自APP
		sessionStorage.setItem("appVersion", utils.getQuery("appVersion"));//来自APP的版本
		sessionStorage.setItem("isSupportPay", utils.getQuery("isSupportPay"));//是否支持支付
	}

	//从APP跳过来
	if (main.isFromApp()) {
		config.userID = utils.getQuery("userID");
		config.token = utils.getQuery("token");
		config.myselfUserID = utils.getQuery("myselfUserId");
		console.log(config.userID);
		if (config.userID) {
			localStorage.userId = config.userID;
		} else {
			config.userID = localStorage.userId;
		}

		if (config.token) {
			localStorage.token = config.token;
		} else {
			config.token = localStorage.token;
		}

		if (config.myselfUserID) {
			localStorage.myselfUserId = config.myselfUserID;
		} else {
			config.myselfUserID = localStorage.myselfUserId;
		}

	} else {
		config.userID = localStorage.userId;
		config.token = localStorage.token;
		config.myselfUserID = localStorage.myselfUserId;
	}

	//是否h5的学习步骤
	var oldStudy = utils.getQuery("oldStudy"); // 1
	if (oldStudy) {
		sessionStorage.setItem("oldStudy", oldStudy);
	}
}
//是否学习老的模式
main.isOldStudy = function () {
	var _oldStudy_ = sessionStorage.getItem("oldStudy");
	if ("1" == _oldStudy_) {
		return true;
	} else {
		return false;
	}
}

//来源于哪个app
main.getFromApp = function () {
	var _fromApp_ = sessionStorage.getItem("fromApp");
	if ("IOS" == _fromApp_) {
		return "IOS";
	} else if ("Android" == _fromApp_) {
		return "Android";
	} else if ("AndroidPad" == _fromApp_) {
		return "AndroidPad";
	} else if ("IOSPad" == _fromApp_) {
		return "IOSPad";
	}
	return "";
}
//是否来自app
main.isFromApp = function () {
	if (main.getFromApp() != "") {
		return true;
	} else {
		return false;
	}
}

//数据10秒上报
main.dataReporting = function () {
	try {
		setTimeout(() => {
			var yt_times = sessionStorage.getItem("yt_times");

			if (utils.StringTools.isEmpty(yt_times)) {
				yt_times = 1;
			} else {
				yt_times = Number(yt_times) + 1;
			}
			sessionStorage.setItem("yt_times", yt_times);
			yt_times = Number(yt_times);


			let yt_belong = sessionStorage.getItem("yt_belong");
			if (!yt_belong) {
				yt_belong = main.getBelong() ? main.getBelong() : 0;
				sessionStorage.setItem("yt_belong", yt_belong);
			}

			let yt_channel = sessionStorage.getItem("yt_channel");
			if (!yt_channel) {
				yt_channel = main.getChannel() ? main.getChannel() : 0;
				sessionStorage.setItem("yt_channel", yt_channel);
			}

			let yt_userId = sessionStorage.getItem("yt_userId");
			if (!yt_userId) {
				yt_userId = config.userID;
				sessionStorage.setItem("yt_userId", yt_userId);
			}

			let yt_uuid = sessionStorage.getItem("yt_uuid");
			if (!yt_uuid) {
				yt_uuid = utils.StringTools.generateUUID();
				sessionStorage.setItem("yt_uuid", yt_uuid);
			}

			let yt_href = window.location.href;
			let yt_preHref = sessionStorage.getItem("yt_href");
			if (!yt_preHref) {
				yt_preHref = '';
				sessionStorage.setItem("yt_href", yt_href);
				sessionStorage.setItem("yt_stopTime", 0);
			}

			let yt_pages = sessionStorage.getItem("yt_pages");
			if (!yt_pages) {
				sessionStorage.setItem("yt_pages", 0);
				yt_pages = 0;
			}

			var yt_stopTime = sessionStorage.getItem("yt_stopTime");
			if (!yt_stopTime) {
				yt_stopTime = 1;
				sessionStorage.setItem("yt_stopTime", yt_stopTime);
			}

			if (yt_href == yt_preHref) {
				yt_stopTime = Number(yt_stopTime) + 1;
				sessionStorage.setItem("yt_stopTime", yt_stopTime);
			} else {//不相同,换页面,结束上一个页面
				//上报
				//yt_userId\yt_uuid\yt_belong\yt_preHref\yt_pages\yt_stopTime
				if (yt_preHref) {
					main.tjFun(yt_userId, yt_uuid, yt_belong, yt_channel, yt_preHref, yt_pages, yt_stopTime);
				}

				yt_pages = Number(yt_pages) + 1;
				sessionStorage.setItem("yt_pages", yt_pages);

				yt_stopTime = 1;
				sessionStorage.setItem("yt_stopTime", yt_stopTime);
				sessionStorage.setItem("yt_href", yt_href);
				yt_times = 0;
			}
			if (yt_times % 10 == 0) {
				main.tjFun(yt_userId, yt_uuid, yt_belong, yt_channel, yt_preHref, yt_pages, yt_stopTime);
				sessionStorage.setItem("yt_times", "1");
			}
			main.dataReporting();
		}, 1000)
	} catch (e) {
	}
}

main.tjFun = function (yt_userId, yt_uuid, yt_belong, yt_channel, yt_href, yt_pages, yt_stopTime) {

	let imgUrl = "//reporttest.dayutang.cn/data/tj.gif?";
	imgUrl = imgUrl + "yt_userId=" + yt_userId;
	imgUrl = imgUrl + "&yt_uuid=" + yt_uuid;
	imgUrl = imgUrl + "&yt_belong=" + yt_belong;
	imgUrl = imgUrl + "&yt_channel=" + yt_channel;
	imgUrl = imgUrl + "&yt_href=" + utils.StringTools.getEncodeURI(yt_href);
	imgUrl = imgUrl + "&yt_pageModuleName=" + utils.StringTools.getEncodeURI(process.env.VUE_APP_MODEL_TYPE);
	imgUrl = imgUrl + "&yt_pages=" + yt_pages;
	imgUrl = imgUrl + "&yt_stopTime=" + yt_stopTime;
	imgUrl = imgUrl + "&screenSize=" + main.getScreenSize();
	imgUrl = imgUrl + "&networkType=" + main.getNetworkType();
	imgUrl = imgUrl + "&terminal=" + main.browserRedirect();
	imgUrl = imgUrl + "&yt_isFollowService=" + sessionStorage.getItem("yt_isFollowService");
	imgUrl = imgUrl + "&yt_isFollowSubscription=" + sessionStorage.getItem("yt_isFollowSubscription");

	let img = new Image();
	img.src = imgUrl;
}

main.checkUserInterval = function () {
	setTimeout(() => {
		if (userID) {
			if (!sessionStorage.getItem("yt_isFollowService")) {
				var data1 = {"userId": userID, "wxAccountId": "11"};
				PersonalCenter.checkUserSubscribe(data1).then(data => {
					if (data.code == 0) {
						var s = "0";
						if (data.subscribe) {
							s = "1";
						}
						sessionStorage.setItem("yt_isFollowService", s);
					}
				})
			}

			if (!sessionStorage.getItem("yt_isFollowSubscription")) {
				var data2 = {"userId": userID, "wxAccountId": "12"};
				PersonalCenter.checkUserSubscribe(data2).then(data => {
					if (data.code == 0) {
						var v = "0";
						if (data.subscribe) {
							v = "1";
						}
						sessionStorage.setItem("yt_isFollowSubscription", v);
					}
				})
			}
		} else {
			main.checkUserInterval();
		}
	}, 1000)
}

//获得用户分辨率
main.getScreenSize = function () {
	return window.screen.width + "*" + window.screen.height;
}
//获得用户上网情况
main.getNetworkType = function () {
	try {
		wx.getNetworkType({
			success: function (res) {
				localStorage.networkType = res.networkType;
			}
		});//缓存用户上网情况
		var networkType = localStorage.getItem("networkType");
		if (networkType == null || networkType == "") {
			networkType = "unknown";
		}
		return networkType;
	} catch (e) {
	}
}

//判断终端是PC还是移动端
main.browserRedirect = function () {
	var accessTerminal = "";
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsNt = sUserAgent.match(/windows nt/i) == "windows nt";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsNt) {
		accessTerminal = "wx";
	} else {
		accessTerminal = "pc";
	}
	return accessTerminal;
}

//添加gio
main.addGio = function () {
	try {
		// !function (e, t, n, g, i) {
		// 	e[i] = e[i] || function () {
		// 			(e[i].q = e[i].q || []).push(arguments)
		// 		}, n = t.createElement("script"), tag = t.getElementsByTagName("script")[0], n.async = 1, n.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + g, tag.parentNode.insertBefore(n, tag)
		// }(window, document, "script", "assets.growingio.com/2.1/gio.js", "gio");

		var gioJS = document.createElement("script");
		gioJS.src = "//assets.growingio.com/2.1/gio.js";
		gioJS.setAttribute("async", "1");
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(gioJS, s);

		var gio_init = setInterval(function () {
			if (gio) {
				gio('init', '98cfddcb1aba9b0b', {});
				gio('config', {'hashtag': true}); //放在init和send之间
				gio('send');
				clearInterval(gio_init);
			}
		}, 1000);


		var gio_setUserId = setInterval(function () {
			if (userID) {
				gio('setUserId', userID);
				clearInterval(gio_setUserId);
			}
		}, 1000);

	} catch (e) {
		console.log(e)
	}
}
/*
 设置gio事件埋点
 eventId :事件ID
 eventLevelVariables：事件级变量的JSON对象 {'gender':'male', 'age':21}
 */
main.setGioFun = function (eventId, eventLevelVariables) {
	if (eventLevelVariables) {
		gio('track', eventId, eventLevelVariables);
	} else {
		gio('track', eventId);
	}
}

window.setGioFun = main.setGioFun;

// 索粉
main.addLockFans_new = function (modular) {
	var fromUserId = utils.getQuery('fromUserId'); // formUserId获取
	if (fromUserId === '' || fromUserId === undefined || fromUserId === userID) {
		return;
	}
	let prame = {};
	prame.userId = userID;
	prame.fromUserId = fromUserId;
	prame.modular = modular;
	LockFans.addLockFansReocrd(prame).then(data => {
		if (data.code === 0) {
		}
	})
};

// 检查是否被主账户踢掉
main.checkMainAccount = function () {
	var prame = {};
	prame.userId = userID;
	prame.myselfUserId = myselfUserID;
	HomeAccount.check(prame).then(data => {
		if (data.code === 0) {
			if (!data.isNormal) {
				localStorage.removeItem('userId');
				localStorage.removeItem('myselfUserId');
				localStorage.removeItem('token');
				localStorage.removeItem('openid');
				location.reload();
				// this.customShowTostFun('您已退出家庭账户<br/>请用自己的账号登录系统',2000,function () {
				//     location.href = '../html/pageBack.html'
				// })
			}
		}
	});
};

// 设置setChannel
main.setChannel = function () {
	var channel = utils.getQuery('_channel');
	var isNumber = /^\+?[1-9][0-9]*$/;　　//判断是否为正整数
	if (channel != "" && channel != undefined && channel != null) {
		if(!isNumber.test(channel)){
			Common.getChannelId({'channelCode': channel}).then(data => {
				utils.setCookie('channel', data._channel,0.5)
			});
		}else{
			utils.setCookie('channel', channel, 0.5);
		}

	}
};

//获取getChannel
main.getChannel = function () {
	var channel = utils.getCookie('channel');
	if (channel != "" && channel != undefined && channel != null) {
		return channel;
	}
	return '';
};

//设置setBelong
main.setBelong = function () {
	var belong = utils.getQuery('_belong');
	if (belong) {
		utils.setCookie('belong', belong,0.5)
	}
};

//获取getBelong
main.getBelong = function () {
	var belong = utils.getCookie('belong');
	if (belong) {
		return belong;
	}
	return '';
};

//跳出到首页
main.jumpIndex = function () {
	location.href = process.env.VUE_APP_HREF;
};

//判断是否登陆
main.isLogin = function () {
	return localStorage.userId != undefined && localStorage.token != undefined;
};

//更新订单推荐人userId
main.updateRecommendUserId = function () {
	var recommendUserId = utils.getQuery('fromUserId');//formUserId获取
	if (!recommendUserId) {
		return;
	} else {
		sessionStorage.recommendUserId = recommendUserId;
	}
};


// 获取实验室信息分享信息
main.getShareLaboratoryInfoFun = function (sharePositionCode, shareTypeCode, successFun) {
	var param = {};
	param.sharePositionCode = sharePositionCode;
	param.shareTypeCode = shareTypeCode;
	ShareLaboratory.getShareLaboratoryInfo(param).then(data => {
		if (data.code == 0) {
			successFun && successFun(data.shareLaboratoryInfo);
		}
	});
};

// 添加实验室信息分享记录
main.shareLaboratoryRecord = function (shareId) {
	let param = {};
	param.userId = userID;
	param.shareLaboratoryVersionId = shareId;
	ShareLaboratory.shareLaboratoryRecord(param).then(data => {
	});
};

//检测是否为微信浏览器
main.is_weixn = function () {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
};

//全平台方法  检测是否为微信浏览器  不是微信浏览器跳转链接
main.is_weixn_href = function() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) != 'micromessenger') {
		location.replace('https://test.dayutang.cn/login/guide.html');
	}
};

//判断没有微信权限的时候显示页面
main.notWXtoImg = function (){
	if(!main.is_weixn() && !main.isFromApp()){
		window.location.href = 'https://test.dayutang.cn/login/guide.html';
		return;
	}
};

//判断是否登录
main.hasOwnUserId = function() {
	if(localStorage.userId==undefined || localStorage.userId.length<10){
		sessionStorage.interlinkage = location.href;
		window.location.href = 'https://test.dayutang.cn/login/login.html';
	}
};

main.isPlatformFun = function () {
	return (main.is_weixn() || main.isFromApp() || sessionStorage.webPlatform == 1)
}

main.windowErrorFun = function () {
	var reported = {};
	window.onerror = function (msg, file, lineno, colno, error) {
		var key = msg + ':' + file + ':' + lineno + ':' + colno;
		if (reported[key] === true) return;

		var yt_userId = sessionStorage.getItem("yt_userId");
		if (utils.StringTools.isEmpty(yt_userId)) {
			yt_userId = userID;
			sessionStorage.setItem("yt_userId", yt_userId);
		}

		var yt_uuid = sessionStorage.getItem("yt_uuid");
		if (utils.StringTools.isEmpty(yt_uuid)) {
			yt_uuid = utils.StringTools.generateUUID();
			sessionStorage.setItem("yt_uuid", yt_uuid);
		}

		var info = {};
		info.message = utils.StringTools.getEncodeURI(msg);
		info.file = utils.StringTools.getEncodeURI(file);
		info.line = lineno || 0;
		info.column = colno || 0;
		info.userAgent = utils.StringTools.getEncodeURI(navigator.userAgent);
		info.error = utils.StringTools.getEncodeURI(error ? error.toString() : undefined);
		info.stack = utils.StringTools.getEncodeURI(error && error.stack ? error.stack : undefined);
		info.userId = yt_userId;
		info.uuid = yt_uuid;
		info.href = utils.StringTools.getEncodeURI(window.location.href);

		var imgUrl = "//reporttest.dayutang.cn/data/error.gif?";
		for(var k in info){
			imgUrl += k + "=" + info[k] + "&";
		}

		var img = new Image();
		img.src = imgUrl;
		reported[key] = true;
	}
}

main.titleChangeFunCookie = function () {
	try {
		var winHref = window.location.href;
		if (winHref.indexOf("www.dayutang.cn") < 0) {

			if (utils.getCookie("cookie_path") != null) {
				document.title = utils.getCookie("cookie_path") + ":" + document.title;
			} else {
				document.title = "预上线环境:" + document.title;
			}
		} else if (utils.getCookie("cookie_path")) {
			var title = utils.getCookie("cookie_path") + ":" + document.title;
			document.title = title;
			try {
				main.GoAppHandlerFun("setWebViewTitle", title);
			} catch (e) {
			}
		}
	} catch (e) {
	}
}


//回调app
main.GoAppHandlerFun = function (method, json) {
	if ("IOS" == main.getFromApp() || "IOSPad" == main.getFromApp()) {
		window.webkit.messageHandlers[method].postMessage(json);
		return;
	}
	if ("Android" == main.getFromApp() || "AndroidPad" == main.getFromApp()) {
		window.YTAndroidWeb[method](json);
		return;
	}
}

main.baiduTotleFun = function () {
	//百度统计
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?c0570dc2b2be8a01bad17d7668dbaf87";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
}

main.tengxunTotleFun = function () {
	var mta = document.createElement("script");
	mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
	mta.setAttribute("name", "MTAH5");
	mta.setAttribute("sid", "500299271");
	mta.setAttribute("cid", "500340812");
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(mta, s);
}

main.getDynamicQrCode = function (ruleCode, backgroundCode, callBack) {
	let pream = {};
	pream.ruleCode = ruleCode;
	pream.backgroundCode = backgroundCode;
	pream.condition = 0;
	DynamicQrBackground.getDynamicQrCode(pream).then(data => {
		callBack && callBack(data);
	})
}

//为APP组织数据传给APP分享内容
var shareForAPPObjFriend, shareForAPPObj; //shareForAPPObjFriend 是朋友 shareForAPPObj是朋友圈
main.shareForAPPFun = function (title, linkURL, imgURL, desc) {
	var pream = {};
	pream.title = title;
	pream.linkURL = linkURL;
	pream.imgURL = imgURL;
	if (sessionStorage.appVersion) {
		//针对app 新版本
		if (main.isFromApp()) {
			if (desc) {
				pream.desc = desc;
				shareForAPPObjFriend = pream;
			} else {
				shareForAPPObj = pream;
			}
		}
	} else {
		//针对app 老版本做兼容
		if (main.isFromApp()) {
			pream.desc = desc;
			shareForAPPObj = pream;
		}
	}
}
//app拿到分享的数据方法
window.shareForAPPObjReturn = function (t) { // t==1 是朋友圈 2 是朋友
	if (sessionStorage.appVersion) {
		//针对app 新版本
		if (t == 1) {
			if (shareForAPPObj) {
				return JSON.stringify(shareForAPPObj);
			} else {
				shareForAPPObj = {};
				shareForAPPObj.code = "appShareDefault";
				shareForAPPObj.linkURL = "https://test.dayutang.cn/commonPage/dynamicQR/dynamicCode.html?ruleCode=FiftyPercentFocus&backgroundCode=CouponAddTeacherQRBG&fromUserId=" + userID + "&addLockFans_new=fromApp";
				return JSON.stringify(shareForAPPObj);
			}
		} else {
			if (shareForAPPObjFriend) {
				return JSON.stringify(shareForAPPObjFriend);
			} else {
				shareForAPPObjFriend = {};
				shareForAPPObjFriend.code = "appShareDefault";
				shareForAPPObjFriend.linkURL = "https://test.dayutang.cn/commonPage/dynamicQR/dynamicCode.html?ruleCode=FiftyPercentFocus&backgroundCode=CouponAddTeacherQRBG&fromUserId=" + userID + "&addLockFans_new=fromApp";
				return JSON.stringify(shareForAPPObjFriend);
			}
		}
	} else {
		//针对app 老版本做兼容
		if (shareForAPPObj) {
			return JSON.stringify(shareForAPPObj);
		} else {
			shareForAPPObj = {};
			shareForAPPObj.code = "appShareDefault";
			shareForAPPObj.linkURL = "https://test.dayutang.cn/commonPage/dynamicQR/dynamicCode.html?ruleCode=FiftyPercentFocus&backgroundCode=CouponAddTeacherQRBG&fromUserId=" + userID + "&addLockFans_new=fromApp";
			return JSON.stringify(shareForAPPObj);
		}
	}
}




export default main;
