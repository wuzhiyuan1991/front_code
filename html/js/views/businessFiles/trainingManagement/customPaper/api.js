define(function(require){

    var Vue = require("vue");

    var customActions = {
        getQuestionCountByIds: {method: 'GET', url: 'question/countby/exampoint'},
        preview: {method: 'GET', url: 'front/exampaper/preview'},
        create: {method: 'POST', url: 'exampaper'},
        queryExamPoints : {method: 'GET', url: 'exampoint/list'},

        queryExampoint : {method: 'GET', url: 'exampoint/list'},
        // 根据课程查询知识点
        queryExamPointByCourseId: {method: 'GET', url: 'course/exampoints/list/1/999'},
        getCountByType: {method: 'GET', url: 'question/countby/type'},
        getQuetionStatistic:{method:'GET', url:'question/statistic'},
    };
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // create: '4020002001',
        // edit: '4020002002',
        // 'delete': '4020002003'
    };
    return resource;
});