define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'riskassesstask/disable'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        getGroupList: {method: 'GET', url: 'riskassess/{id}/items'},
        getRecordGroupList: {method: 'GET', url: 'riskassesstask/{id}/riskassessrecorddetail'},
        getTaskList: {method: 'GET', url: 'riskassess/{id}/items'},
        getUnderlingList: {method: 'GET', url: 'riskassesstask/underling'},

        saveRecords: {method: 'POST', url: 'riskassessrecord'},
        getTaskWorkList: {method: 'GET', url: 'riskassesstask/{id}/riskassessrecorddetail'},
        getCount: {method: 'GET', url: 'riskassesstask/count/user'}

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskassesstask"));
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