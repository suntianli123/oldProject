import base from '../libs/ajax/base';

const DynamicQrBackground = {};

// 根据规则ID和模板ID获取动态二维码
DynamicQrBackground.getDynamicQrCode = params => {
    params.sn = 'DynamicQrBackground';
    params.mn = 'getDynamicQrCode';
    return base.post('', params).then(res => res.data);
};

export default DynamicQrBackground;
