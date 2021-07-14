/**
 * Created by yudeyu on 2018/5/25.
 */

export default {
	apiURL: process.env.VUE_APP_API_URL, // 老接口地址
	apiUrlNew: process.env.VUE_APP_API_URL_NEW, // 新接口地址
	KEY: process.env.VUE_APP_KEY, // 后台服务验证的KEY_CODE
	//userID: 'ff80808160e930f20160e9490b120002',
	userID: localStorage.userId,
	myselfUserID: localStorage.myselfUserId,
	//token: 'D7343B0E43F1F54512D401472148BC6B',
	token: localStorage.token,
	openid: localStorage.openid
};
