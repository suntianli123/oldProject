import base from '../libs/ajax/base';
// 分享实验室
const ShareLaboratory = {};

//
ShareLaboratory.getShareLaboratoryInfo = params => {
  params.sn = 'ShareLaboratory';
  params.mn = 'getShareLaboratoryInfo';
  return base.post('', params).then(res => res.data);
};

ShareLaboratory.shareLaboratoryRecord = params => {
  params.sn = 'ShareLaboratory';
  params.mn = 'shareLaboratoryRecord';
  return base.post('', params).then(res => res.data);
};


export default ShareLaboratory;
