define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'gasdetectionrecord/disable'},

		queryGasDetectionDetails : {method: 'GET', url: 'gasdetectionrecord/gasdetectiondetails/list/{pageNo}/{pageSize}'},
		saveGasDetectionDetail : {method: 'POST', url: 'gasdetectionrecord/{id}/gasdetectiondetail'},
		removeGasDetectionDetails : _.extend({method: 'DELETE', url: 'gasdetectionrecord/{id}/gasdetectiondetails'}, apiCfg.delCfg),
		updateGasDetectionDetail : {method: 'PUT', url: 'gasdetectionrecord/{id}/gasdetectiondetail'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("gasdetectionrecord"));
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