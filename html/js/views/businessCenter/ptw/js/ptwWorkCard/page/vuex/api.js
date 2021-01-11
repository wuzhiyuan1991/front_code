define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwworkcard/disable'},

		queryWorkPermits : {method: 'GET', url: 'ptwworkcard/workpermits/list/{pageNo}/{pageSize}'},
		saveWorkPermit : {method: 'POST', url: 'ptwworkcard/{id}/workpermit'},
		removeWorkPermits : _.extend({method: 'DELETE', url: 'ptwworkcard/{id}/workpermits'}, apiCfg.delCfg),
		updateWorkPermit : {method: 'PUT', url: 'ptwworkcard/{id}/workpermit'},

		queryWorkHistories : {method: 'GET', url: 'ptwworkcard/workhistories/list/{pageNo}/{pageSize}'},
		saveWorkHistory : {method: 'POST', url: 'ptwworkcard/{id}/workhistory'},
		removeWorkHistories : _.extend({method: 'DELETE', url: 'ptwworkcard/{id}/workhistories'}, apiCfg.delCfg),
		updateWorkHistory : {method: 'PUT', url: 'ptwworkcard/{id}/workhistory'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwworkcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '7080001001',
        // 'edit':   '7080001002',
        // 'delete': '7080001003',
        // 'import': '7080001004',
        // 'export': '7080001005',
        // 'enable': '7080001006',
    };
    return resource;
});