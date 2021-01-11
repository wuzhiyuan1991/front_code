define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emercard/disable'},
		updateAnnouncements:{method: 'PUT', url: 'emercard'},

		queryEmerScenes : {method: 'GET', url: 'emercard/emerscenes/list/1/100'},
		saveEmerScene : {method: 'POST', url: 'emercard/{id}/emerscene'},
		removeEmerScenes : _.extend({method: 'DELETE', url: 'emercard/{id}/emerscenes'}, apiCfg.delCfg),
		updateEmerScene : {method: 'PUT', url: 'emercard/{id}/emerscene'},

		queryEmerContacts : {method: 'GET', url: 'emercard/emercontacts/list/{pageNo}/{pageSize}'},
        saveEmerContacts: {method: 'POST', url: 'emercard/{id}/emercontacts'},
		saveEmerContact : {method: 'POST', url: 'emercard/{id}/emercontact'},
		removeEmerContacts : _.extend({method: 'DELETE', url: 'emercard/{id}/emercontacts'}, apiCfg.delCfg),
		updateEmerContact : {method: 'PUT', url: 'emercard/{id}/emercontact'},

		queryEmerSteps : {method: 'GET', url: 'emercard/emersteps/list'},
		saveEmerStep : {method: 'POST', url: 'emercard/{id}/emerstep'},
		removeEmerSteps : _.extend({method: 'DELETE', url: 'emercard/{id}/emersteps'}, apiCfg.delCfg),
		updateEmerStep : {method: 'PUT', url: 'emercard/{id}/emerstep'},

		queryEmerDuties : {method: 'GET', url: 'emercard/emerduties/list/1/100'},
		saveEmerDuty : {method: 'POST', url: 'emercard/{id}/emerduty'},
		removeEmerDuties : _.extend({method: 'DELETE', url: 'emercard/{id}/emerduties'}, apiCfg.delCfg),
		updateEmerDuty : {method: 'PUT', url: 'emercard/{id}/emerduty'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emercard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020009001',
         'edit':   '9020009002',
         'delete': '9020009003',
         'import': '9020009004',
         'export': '9020009005',
         'enable': '9020009006',
    };
    return resource;
});