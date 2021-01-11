define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        publish:{method:'PUT', url:'trainplan/publish'},
    	cancelPublish : {method: 'PUT', url:'trainplan/cancel'},
		
		queryUserLatestTrainTasks :{method: 'GET', url: 'trainplan/traintasks/latestlist/{pageNo}/{pageSize}'},
		
		queryTrainTasks : {method: 'GET', url: 'trainplan/traintasks/list/{pageNo}/{pageSize}'},
		saveTrainTasks : {method: 'POST', url: 'trainplan/{id}/traintasks'},
		removeTrainTasks : _.extend({method: 'DELETE', url: 'trainplan/{id}/traintasks'}, apiCfg.delCfg),

        saveCert: {method: 'POST', url: 'cert'},
        updateCert: {method: 'PUT', url: 'cert'},
        queryCertById: {method: 'GET', url: 'cert/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("trainplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4010004001',
        'edit': '4010004002',
        'delete': '4010004003',
        'publish': '4010004201',
        'cancelPublish': '4010004016',
        'removeUser': '4010004019',
        'addCert':'4010004020'
    };
    return resource;
});