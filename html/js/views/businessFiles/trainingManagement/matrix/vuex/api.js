define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        list: {method: 'GET', url: 'coursematrix/list{/courseId}'},
        remove:{method:'DELETE', url:'coursematrix/{positionId}/{courseId}'},
        get:{methos:'GET', url:'coursematrix/position/{positionId}'},
        queryCourses: {method: 'GET', url: 'coursematrix/position/courses/list/{pageNo}/{pageSize}'},
        saveCourses: {method: 'POST', url: 'coursematrix/position/{positionId}/courses'},
        saveMatrix: {method: 'POST', url: 'coursematrix/course/{courseId}/positions'},
        listposition: {method:'GET', url:"position/listbyorg/{orgId}"},
        listcourse: {method:'GET',url:'course/list'},
        listAllPosition:{method:'GET',url:'position/list/{currentPage}/{pageSize}'},
        getHse: {method: 'GET', url: 'position/{id}'},

        getCourse: {method: 'GET', url: 'course/{id}'},
        countByCourse: {method: 'GET', url: 'coursematrix/count/course'},//课程详情总计，传course对象
        statisticsByCourse: {method: 'GET', url: 'coursematrix/statistics/course'},//课程详情列表，传course对象
        statisticsByPosition: {method: 'GET', url: 'coursematrix/statistics/position'},//岗位详情列表，传position对象
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("coursematrix"));
    var resource = Vue.resource(null,{}, customActions);

    resource.__auth__ = {
        // 'create': '4020006001',
        // 'edit': '4020006003',
        // 'delete': ''
    };

    return resource;
});