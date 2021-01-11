define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwworkpermit/disable'},

		queryWorkIsolations : {method: 'GET', url: 'ptwworkpermit/workisolations/list/{pageNo}/{pageSize}'},
		saveWorkIsolation : {method: 'POST', url: 'ptwworkpermit/{id}/workisolation'},
		removeWorkIsolations : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/workisolations'}, apiCfg.delCfg),
		updateWorkIsolation : {method: 'PUT', url: 'ptwworkpermit/{id}/workisolation'},

		queryGasDetectionRecords : {method: 'GET', url: 'ptwworkpermit/gasdetectionrecords/list/{pageNo}/{pageSize}'},
		saveGasDetectionRecord : {method: 'POST', url: 'ptwworkpermit/{id}/gasdetectionrecord'},
		removeGasDetectionRecords : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/gasdetectionrecords'}, apiCfg.delCfg),
		updateGasDetectionRecord : {method: 'PUT', url: 'ptwworkpermit/{id}/gasdetectionrecord'},

		queryWorkStuffs : {method: 'GET', url: 'ptwworkpermit/workstuffs/list/{pageNo}/{pageSize}'},
		saveWorkStuff : {method: 'POST', url: 'ptwworkpermit/{id}/workstuff'},
		removeWorkStuffs : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/workstuffs'}, apiCfg.delCfg),
		updateWorkStuff : {method: 'PUT', url: 'ptwworkpermit/{id}/workstuff'},

		querySuperviseRecords : {method: 'GET', url: 'ptwworkpermit/superviserecords/list/{pageNo}/{pageSize}'},
		saveSuperviseRecord : {method: 'POST', url: 'ptwworkpermit/{id}/superviserecord'},
		removeSuperviseRecords : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/superviserecords'}, apiCfg.delCfg),
		updateSuperviseRecord : {method: 'PUT', url: 'ptwworkpermit/{id}/superviserecord'},

		queryWorkpeoplenel : {method: 'GET', url: 'ptwworkpermit/workpeoplenel/list/{pageNo}/{pageSize}'},
		saveWorkPersonnel : {method: 'POST', url: 'ptwworkpermit/{id}/workpersonnel'},
		removeWorkpeoplenel : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/workpeoplenel'}, apiCfg.delCfg),
		updateWorkPersonnel : {method: 'PUT', url: 'ptwworkpermit/{id}/workpersonnel'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwworkpermit"));
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