define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'adminlicense/disable'},

		queryAdminLicenseProcesses : {method: 'GET', url: 'adminlicense/adminlicenseprocesses/list/{pageNo}/{pageSize}'},
		saveAdminLicenseProcess : {method: 'POST', url: 'adminlicense/{id}/adminlicenseprocess'},
		removeAdminLicenseProcesses : _.extend({method: 'DELETE', url: 'adminlicense/{id}/adminlicenseprocesses'}, apiCfg.delCfg),
		updateAdminLicenseProcess : {method: 'PUT', url: 'adminlicense/{id}/adminlicenseprocess'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        listFile: {method: 'GET', url: 'file/list'},
        deleteFile: {method: 'DELETE', url: 'file'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("adminlicense"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2030001001',
        'edit':   '2030001002',
        'delete': '2030001003',
        'import': '2030001004',
        'export': '2030001005',
        // 'enable': '2030001006',
    };
    return resource;
});