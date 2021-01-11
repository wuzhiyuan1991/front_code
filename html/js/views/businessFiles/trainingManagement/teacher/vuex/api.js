define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryCommentStatistic : {method: 'GET', url: 'course/coursecomment/statistic'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("teacher"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4020005001',
        'export': '4020005005',
        'edit': '4020005002',
        'delete': '4020005003'
    };
    return resource;
});