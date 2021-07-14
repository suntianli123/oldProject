import baseNew from '../libs/ajax/baseNew';

// 听故事打卡团
const  ActivityTaskStory= {};

// 获取用户听故事打卡
ActivityTaskStory.getUserStoryTaskPunchStatus = params => {
    return baseNew.post('task/activityTaskStory/getUserStoryTaskPunchStatus', params).then(res => res.data);
};

// 打卡
ActivityTaskStory.goPunch = params => {
    return baseNew.post('task/activityTaskStory/goPunch', params).then(res => res.data);
};

// 加入打卡团
ActivityTaskStory.joinTask = params => {
    return baseNew.post('task/activityTaskStory/joinTask', params).then(res => res.data);
};

// 获取用户打卡信息
ActivityTaskStory.getUserPunchCardData = params => {
    return baseNew.post('task/activityTaskStory/getUserPunchCardData', params).then(res => res.data);
};

// 打卡排行
ActivityTaskStory.storeRanking = params => {
    return baseNew.post('task/activityTaskStory/storeRanking', params).then(res => res.data);
};

// 获取用户打卡累计信息
ActivityTaskStory.getUserPunchCardData = params => {
    return baseNew.post('task/activityTaskStory/getUserPunchCardData', params).then(res => res.data);
};

export default ActivityTaskStory;