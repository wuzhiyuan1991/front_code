define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        deleteByIds:{method: 'DELETE', url: 'hiddenlibrary/ids'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("hiddenlibrary"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2040002001',
        'edit':   '2040002002',
        'delete': '2040002003',
        'import': '2040002004',
        'export': '2040002005',
        // 'enable': '2040002006',


    };
    return resource;
});