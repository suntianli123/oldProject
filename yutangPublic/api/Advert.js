import baseNew from '../libs/ajax/baseNew';

const Advert = {};

// 获取广告位
Advert.getAdvertByBanner = params => {
  return baseNew.post('system/advertApi/getListByAdvertCode', params).then(res => res.data);
};

export default Advert;
