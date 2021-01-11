define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    		getUser : {method: 'GET', url: 'user/{id}'},
    		listtask:{method:'GET',url:'traintask/list/{userId}'},
    		queryUserFiles : {method: 'GET', url: 'traintask/statistic/user/list/{currentPage}/{pageSize}'},
            //课程类型
            queryCategorySubjects:{method: 'GET', url: 'subject/category/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("user"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export': '4010008005',
        'exportDetail':'4010008006'
    };
    return resource;
});