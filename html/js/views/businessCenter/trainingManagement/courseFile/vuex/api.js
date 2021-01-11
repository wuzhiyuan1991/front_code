define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    		queryCourseFiles : {method: 'GET', url: 'traintask/statistic/course/list/{currentPage}/{pageSize}'},
            course:{method: 'GET',url:'course/teachers/list'}//查询讲师姓名
    };
    //traintask
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("course"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export': '4010007005',
        'exportDetail':'4010007006'
    };
    return resource;
});