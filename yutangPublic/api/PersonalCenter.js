import base from '../libs/ajax/base';

const PersonalCenter = {};

// 获取用户信息
PersonalCenter.getUserInfo = params => {
    params.sn = 'PersonalCenter';
    params.mn = 'getUserInfo';
    return base.post('', params).then(res => res.data);
};

// 获取用户是否关注
PersonalCenter.checkUserSubscribe = params => {
  params.sn = 'PersonalCenter';
  params.mn = 'checkUserSubscribe';
  return base.post('', params).then(res => res.data);
};


export default PersonalCenter;
