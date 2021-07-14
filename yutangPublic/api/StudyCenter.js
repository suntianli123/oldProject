/**
 * Created by yudeyu on 2019/4/13.
 */
import base from '../libs/ajax/base';
import baseNew from '../libs/ajax/baseNew';

const StudyCenter = {};

// 获取全部标签列表
StudyCenter.collectionOrCancel = params => {
	return baseNew.post('studycenter/collection/collectionOrCancel', params).then(res => res.data);
};

// 获取收藏列表
StudyCenter.getUserCollectionInfo = params => {
    return baseNew.post('studycenter/collection/getUserCollectionInfo', params).then(res => res.data);
};

// 获取升级信息
StudyCenter.getUpgradeInfo = params => {
    params.sn = 'StudyCenter';
    params.mn = 'getUpgradeInfo';
    return base.post('', params).then(res => res.data);
};

// 升级
StudyCenter.upgrade = params => {
    params.sn = 'StudyCenter';
    params.mn = 'upgrade';
    return base.post('', params).then(res => res.data);
};

export default StudyCenter;
