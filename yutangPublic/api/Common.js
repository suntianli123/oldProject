import base from '../libs/ajax/base';

const Common = {};

// 获取渠道
Common.getChannelId = params => {
    params.sn = 'Common';
    params.mn = 'getChannelId';
    return base.post('', params).then(res => res.data);
};
// 获取年级字典吗
Common.getDictDataListByCode = params => {
    params.sn = 'Common';
    params.mn = 'getDictDataListByCode';
    return base.post('', params).then(res => res.data);
};



export default Common;
