/**
 * Created by yudeyu on 2019/4/28.
 */
import wx from 'weixin-js-sdk';
var weiXinTools = {
	/**
	 * 检查是否微信
	 * @returns {boolean}
	 */
	isWeiXin : function () {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 隐藏微信右上角菜单
	 */
	hideOptionMenu : function () {
		wx.hideOptionMenu(); //隐藏右上角菜单项
	},
	/**
	 * 显示右上角菜单项
	 */
	showOptionMenu : function () {
		wx.showOptionMenu(); //显示右上角菜单项
	},
	/**
	 * 显示收藏按钮
	 */
	showFavoriteMenu : function () {
		wx.showMenuItems({
			menuList: [
				'menuItem:favorite' // 显示收藏按钮
			]
		});
	},
	/**
	 * 隐藏收藏按钮
	 */
	hideFavoriteMenu : function () {
		wx.hideMenuItems({
			menuList: [
				'menuItem:favorite'  //隐藏收藏按钮
			]
		});
	},
	/**
	 * 隐藏发送给好友按钮
	 */
	hideAppMessageMenu : function () {
		wx.hideMenuItems({
			menuList: [
				"menuItem:share:appMessage"//隐藏发送给好友按钮
			]
		});
	},
	/**
	 * 显示发送给好友按钮
	 */
	showAppMessageMenu : function (title,desc,link,imgUrl,successFun,type,dataUrl) {
		try {
			wx.showMenuItems({
				menuList: [
					'menuItem:share:appMessage' // 分享到朋友
				]
			});
			if (!type) {
				type = "link";
			}
			wx.onMenuShareAppMessage({    //分享给朋友
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				type: type,
				dataUrl: dataUrl,
				success: function () {
					setTimeout(function () {
						successFun && successFun();
					},500)
				}
			});
		} catch (e) {
			console.error("显示发送给好友按钮,请检查代码")
		}
	},
	/**
	 * 隐藏分享到朋友圈按钮
	 */
	hideTimeLineMenu : function () {
		wx.hideMenuItems({
			menuList: [
				"menuItem:share:timeline"//分享到朋友圈
			]
		});
	},
	/**
	 * 显示分享到朋友圈按钮
	 */
	showTimeLineMenu : function (title,link,imgUrl,successFun) {
		try {
			wx.showMenuItems({
				menuList: [
					'menuItem:share:timeline' // 分享到朋友圈
				]
			});
			wx.onMenuShareTimeline({   //分享到朋友圈
				title: title,
				link: link,
				imgUrl: imgUrl,
				success: function () {
					setTimeout(function () {
						successFun && successFun();
					},500)
				}
			});
		} catch (e) {
			console.error("显示分享到朋友圈按钮,请检查代码")
		}
	},
	/**
	 * 在Safari中打开
	 */
	openWithSafari: function () {
		wx.showMenuItems({
			menuList: [
				"menuItem: openWithSafari",  //在Safari中打开
				"menuItem:openWithQQBrowser", //在Safari中打开
				"menuItem: openWithSafari"  //在Safari中打开
			
			]
		});
	},
	scanQRCode:function (successFun) {
		wx.scanQRCode({
			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				if (result.indexOf("EAN_13") >= 0) {
					var arr = result.split("EAN_13,");
					if (arr.length == 2) {
						let bookcode = arr[1];
						if (bookcode.length == 13) {
							successFun && successFun(bookcode);
						} else {
							successFun && successFun("");
						}
					} else {
						successFun && successFun("");
					}
				} else {
					successFun && successFun("");
				}
				
			}
		})
	}
};

export default weiXinTools;