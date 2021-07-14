import baseNew from '../libs/ajax/baseNew';

const UserApi = {};
// 获取用户信息
UserApi.getByUserId = params => {
    return baseNew.post('user/userApi/getByUserId', params).then(res => res.data);
};
// 更改用户信息
UserApi.updateUserInfo = params => {
    return baseNew.post('user/userApi/updateUserInfo', params).then(res => res.data);
};

export default UserApi;
