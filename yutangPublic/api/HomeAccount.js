/**
 * Created by yudeyu on 2018/7/9.
 */
import base from '../libs/ajax/base';

const HomeAccount = {};

// 获取用户会员服务
HomeAccount.check = params => {
    params.sn = 'HomeAccount';
    params.mn = 'check';
    return base.post('', params).then(res => res.data);
};


export default HomeAccount;
