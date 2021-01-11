define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'idadutysubject/disable'},
        move: {method: 'PUT', url: 'idadutysubject/order'},

		queryDutyAbilities : {method: 'GET', url: 'idadutysubject/dutyabilities/list/{pageNo}/{pageSize}'},
		saveDutyAbility : {method: 'POST', url: 'idadutysubject/{id}/dutyability'},
		removeDutyAbilities : _.extend({method: 'DELETE', url: 'idadutysubject/{id}/dutyabilities'}, apiCfg.delCfg),
		updateDutyAbility : {method: 'PUT', url: 'idadutysubject/{id}/dutyability'},

		queryUsers : {method: 'GET', url: 'idadutysubject/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'idadutysubject/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'idadutysubject/{id}/users'}, apiCfg.delCfg),

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("idadutysubject"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '4320001001',
        // 'edit':   '4320001002',
        // 'delete': '4320001003',
        // 'import': '4320001004',
        // 'export': '4320001005',
        // 'enable': '4320001006',
    };
    return resource;
});