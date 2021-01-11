define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'documentlibrary/disable'},
        submit: {method: 'PUT', url: 'documentlibrary/submit'},
        audit: {method: 'PUT', url: 'documentlibrary/audit'},
        recover: {method: 'PUT', url: ''},
        getHistoryList: {method: 'GET', url: 'documentauditordetail/list'},
        deleteLogic:{method: 'DELETE', url: 'documentlibrary/logic'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("documentlibrary"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        'delete': '7060001003,7070003003,7070004003,7070005003',
        'recover': '7060001009,7070005009,7070004009',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
        audit: '7060001007,7070002007,7070005007',
        submit: '7060001008,7070003008,7070005008'
    };
    return resource;
});