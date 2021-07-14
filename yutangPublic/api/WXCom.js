/**
 * Created by yudeyu on 2018/7/9.
 */
import base from '../libs/ajax/base';

const WXCom = {};

// 获取微信签名
WXCom.getJsapiTicket = params => {
    params.sn = 'WXCom';
    params.mn = 'getJsapiTicket';
    return base.post('', params).then(res => res.data);
};


export default WXCom;
