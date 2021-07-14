import base from '../libs/ajax/base';
// 索粉
const LockFans = {};

// 获取用户会员服务
LockFans.addLockFansReocrd = params => {
    params.sn = 'LockFans';
    params.mn = 'addLockFansReocrd';
    return base.post('', params).then(res => res.data);
};


export default LockFans;
