define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'commitmenttask/disable'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        getGroupList: {method: 'GET', url: 'commitmenttask/{id}/commitmentrecorddetail'},
        getTaskList: {method: 'GET', url: 'commitment/{id}/items'},

        saveRecords: {method: 'POST', url: 'commitmentrecord'},

        getCount: {method: 'GET', url: 'commitmenttask/count/user'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("commitmenttask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});