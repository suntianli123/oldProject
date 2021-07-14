import baseNew from '../libs/ajax/baseNew';

const BusinessGoodsTag = {};

//根据code获取数据
BusinessGoodsTag.listByCodeAndType = params => {
    return baseNew.post('system/businessGoodsTag/listByCodeAndType', params).then(res => res.data);
};

export default BusinessGoodsTag;
