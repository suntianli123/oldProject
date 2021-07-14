/**
 * Created by yudeyu on 2018/7/9.
 */

import utils from './utils.js';
import WXCom from '../api/WXCom.js';
import wx from 'weixin-js-sdk';
let wxConfig = {};

wxConfig.init = function (callback) {
	//读取cookie里的ticket
	var ticket = '';
	if (!ticket) {
		WXCom.getJsapiTicket({}).then(data => {
			var obj = data;
			if (obj.code == 0) {
				var ticket = obj.jsapiTicket;
				utils.setCookie('ticket', ticket,2);
				this.doWXConfig(callback);
			} else {
				//获取ticket失败
			}
		});
	} else {
		this.doWXConfig(callback);
	}
};

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;
/* hex output format. 0 - lowercase; 1 - uppercase        */
var chrsz = 8;
/* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
	return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
	/* append padding */
	x[len >> 5] |= 0x80 << 24 - len % 32;
	x[(len + 64 >> 9 << 4) + 15] = len;
	
	var w = Array(80);
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;
	var e = -1009589776;
	
	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		var olde = e;
		
		for (var j = 0; j < 80; j++) {
			if (j < 16) w[j] = x[i + j];
			else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
			var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
				safe_add(safe_add(e, w[j]), sha1_kt(j)));
			e = d;
			d = c;
			c = rol(b, 30);
			b = a;
			a = t;
		}
		
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
		e = safe_add(e, olde);
	}
	return Array(a, b, c, d, e);
	
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
	if (t < 20) return b & c | ~b & d;
	if (t < 40) return b ^ c ^ d;
	if (t < 60) return b & c | b & d | c & d;
	return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
	return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 0xFFFF;
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
	return num << cnt | num >>> 32 - cnt;
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for (var i = 0; i < str.length * chrsz; i += chrsz)
		bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 32 - chrsz - i % 32;
	return bin;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
	var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
	var str = '';
	for (var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 0xF) +
			hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 0xF);
	}
	return str;
}

wxConfig.doWXConfig = function (callback) {
	var wx_nonceStr = Math.ceil(Math.random() * 10000).toString();
	var now = new Date();
	var timestamp = Math.round(now.getTime() / 1000).toString();
	var holeUrl = location.href;
	var arr = holeUrl.split('#');
	if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
		window.entryUrl = location.href.split('#')[0]
	}
	// 进行签名的时候  Android 不用使用之前的链接， ios 需要
	let signLink =  /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl;
	console.log(signLink);
	var pre_url = arr[0];
	
	var signObj = {
		noncestr: wx_nonceStr,
		jsapi_ticket: utils.getCookie("ticket"),
		timestamp: timestamp,
		url: signLink
	};
	var paramArr = [];
	for (var key in signObj) {
		paramArr.push({
			key: key,
			value: signObj[key]
		});
	}
	paramArr.sort(function (a, b) {
		return a.key > b.key ? 1 : -1;
	});
	var str = '';
	for (var i = 0; i < paramArr.length; i++) {
		str += paramArr[i].key + '=' + paramArr[i].value + '&';
	}
	str = str.slice(0, str.length - 1);
	var sign = hex_sha1(str).toString();
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wxb1147afb91920bb6', // 必填，公众号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: wx_nonceStr, // 必填，生成签名的随机串
		signature: sign, // 必填，签名，见附录1
		jsApiList: [
			'openWithSafari',
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'translateVoice',
			'startRecord',
			'stopRecord',
			'onRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard',
			'SupportingResource',
			'translateVoice'
		] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
	//处理验证成功的信息
	wx.ready(function () {
		wx.hideOptionMenu(); //隐藏右上角菜单项
		callback && callback();
	});
};

export default wxConfig;
