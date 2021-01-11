define(function(require){

    var Vue = require("vue");

    var customActions = {
        queryCommentStatistic : {method: 'GET', url: 'course/coursecomment/statistic'},
        queryCourseComments : {method: 'GET', url: 'course/coursecomment/list/{pageNo}/{pageSize}'},
        saveCourseComment : {method: 'POST', url: 'course/{id}/coursecomment'}
    };

    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {};
    return resource;
});