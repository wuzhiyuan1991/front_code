define(function(require){

    var Vue = require("vue");

    var customActions = {
        queryCommentStatistic : {method: 'GET', url: 'course/coursecomment/statistic'},
        queryCourseComments : {method: 'GET', url: 'course/coursecomment/list/{pageNo}/{pageSize}'},
        saveCourseComment : {method: 'POST', url: 'course/{id}/coursecomment'},
        getTask: {method: 'GET', url: 'traintask/{id}'},
        getCommentAccessConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=training.commentAccess'}

    };

    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {};
    return resource;
});