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
        'export': '9020012005',
        'exportDetail':'9020012006'
    };
    return resource;
});