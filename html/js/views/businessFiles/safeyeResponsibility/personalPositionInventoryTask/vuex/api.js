define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'positioninventorytask/disable'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        getGroupList: {method: 'GET', url: 'positioninventorytask/{id}/positioninventoryrecorddetail'},
        getTaskList: {method: 'GET', url: 'positioninventoryitem/group/list'},

        saveRecords: {method: 'POST', url: 'positioninventoryrecord'},
        getCount: {method: 'GET', url: 'positioninventorytask/count/user'}

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("positioninventorytask"));
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