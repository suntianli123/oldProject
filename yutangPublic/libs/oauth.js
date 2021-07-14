import utils from './utils.js';

let oauth = {};

oauth.is_weixn = function (obj) {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
};
oauth.openOAuth = function (scope) {
	var realURL = window.location.href;
	localStorage.realURL = realURL;
	var oAuthURL = encodeURIComponent(process.env.VUE_APP_HREF + '/shopOrder/oAuth.html');
	var wxAuthURL = 'https://open.weixin.qq.com/connect/oauth2/authorize' + '?appid=wxb1147afb91920bb6' + '&redirect_uri=' + oAuthURL + '&response_type=code&scope=' + scope + '&state=STATE' + '#wechat_redirect';
	window.open(wxAuthURL, '_self');
};

oauth.init = function () {
	if (oauth.is_weixn()) {
		if (window.noOauth == undefined || window.noOauth != true) {
			var wxAccessToken = utils.getCookie("wxAccessToken");
			if (localStorage.userId == undefined || localStorage.token == undefined) {
				oauth.openOAuth('snsapi_userinfo');
			} else if (wxAccessToken==undefined || wxAccessToken === null || !wxAccessToken) {
				oauth.openOAuth('snsapi_base');
			}
		}
	}
};


export default oauth;













