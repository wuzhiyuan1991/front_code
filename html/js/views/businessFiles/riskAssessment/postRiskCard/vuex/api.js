define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {

        //list: {method: 'GET', url: 'position/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'position/{id}'},
        rel: {method: 'GET', url: 'position/rel'},
        //create: {method: 'POST', url: 'position'},
        //update: {method: 'PUT', url: 'position'},
        del: {method: 'DELETE', url: 'position'},
        //初始化组织机构
        //remove : _.extend({method: 'DELETE', url: 'position'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'position/exportExcel'},
        //importExcel : {method: 'POST', url: 'position/importExcel'},

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("position"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        // 'create': '1020004001',
        // 'import': '1020004004',
        // 'export': '1020004005',
        // 'edit': '1020004002',
        // 'delete': '1020004003',
        // 'copy':'1020004010',
        // 'enable':'1020004009'
    };

    return resource;
});