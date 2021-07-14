/**
 * Created by yudeyu on 2019/4/30.
 */
/**
 * Created by yudeyu on 2018/7/9.
 */
import base from '../libs/ajax/base';
import baseNew from '../libs/ajax/baseNew';
const User = {};

// 虚拟货币清零平台埋点
User.recordUserLogin = params => {
	params.sn = 'User';
	params.mn = 'recordUserLogin';
	return base.post('', params).then(res => res.data);
};

//根据终端获取用户登陆信息
User.whetherToLogInByTerminal = params => {
	return baseNew.post('user/userApi/whetherToLogInByTerminal', params).then(res => res.data);
};

//根据用户ID获取是否拥有图书包角色
User.getPicBookPackageRole = params => {
	return baseNew.post('user/userApi/getPicBookPackageRole', params).then(res => res.data);
};

//根据code校验用户是否弹窗
User.verifyNeedRemind = params => {
	return baseNew.post('user/userApi/verifyNeedRemind', params).then(res => res.data);
};
export default User;