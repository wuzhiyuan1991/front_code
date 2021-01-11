define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwworkpersonnel/disable'},

		queryCloudFiles : {method: 'GET', url: 'ptwworkpersonnel/cloudfiles/list/{pageNo}/{pageSize}'},
		saveCloudFile : {method: 'POST', url: 'ptwworkpersonnel/{id}/cloudfile'},
		removeCloudFiles : _.extend({method: 'DELETE', url: 'ptwworkpersonnel/{id}/cloudfiles'}, apiCfg.delCfg),
		updateCloudFile : {method: 'PUT', url: 'ptwworkpersonnel/{id}/cloudfile'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwworkpersonnel"));
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