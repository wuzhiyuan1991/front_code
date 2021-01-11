define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'projthrsimultaneous/disable'},

		queryProjThrSimultaneousTasks : {method: 'GET', url: 'projthrsimultaneous/projthrsimultaneoustasks/list/{pageNo}/{pageSize}'},
		saveProjThrSimultaneousTask : {method: 'POST', url: 'projthrsimultaneous/{id}/projthrsimultaneoustask'},
		removeProjThrSimultaneousTasks : _.extend({method: 'DELETE', url: 'projthrsimultaneous/{id}/projthrsimultaneoustasks'}, apiCfg.delCfg),
		updateProjThrSimultaneousTask : {method: 'PUT', url: 'projthrsimultaneous/{id}/projthrsimultaneoustask'},

        queryProjThrSimultaneousTaskDetails : {method: 'GET', url: 'projthrsimultaneoustask/projthrsimultaneoustaskdetails/list/{pageNo}/{pageSize}'},
        saveProjThrSimultaneousTaskDetail : {method: 'POST', url: 'projthrsimultaneoustask/{id}/projthrsimultaneoustaskdetail'},
        removeProjThrSimultaneousTaskDetails : _.extend({method: 'DELETE', url: 'projthrsimultaneoustask/{id}/projthrsimultaneoustaskdetails'}, apiCfg.delCfg),
        updateProjThrSimultaneousTaskDetail : {method: 'PUT', url: 'projthrsimultaneoustask/{id}/projthrsimultaneoustaskdetail'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("projthrsimultaneous"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2030003001',
        'edit':   '2030003002',
        'delete': '2030003003',
        'import': '2030003004',
        'export': '2030003005',
        // 'enable': '2030003006',
    };
    return resource;
});