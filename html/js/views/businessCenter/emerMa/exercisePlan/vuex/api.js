define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'exerciseplan/disable'},
        publish : {method: 'PUT', url:'exerciseplan/publish'},
        invalid : {method: 'PUT', url:'exerciseplan/invalid'},

		queryExerciseSchemes : {method: 'GET', url: 'exerciseplan/exerciseschemes/list/{pageNo}/{pageSize}'},
		saveExerciseScheme : {method: 'POST', url: 'exerciseplan/{id}/exercisescheme'},
		removeExerciseSchemes : _.extend({method: 'DELETE', url: 'exerciseplan/{id}/exerciseschemes'}, apiCfg.delCfg),
		updateExerciseScheme : {method: 'PUT', url: 'exerciseplan/{id}/exercisescheme'},

		queryUsers : {method: 'GET', url: 'exerciseplan/users/list/{pageNo}/{pageSize}'},
        queryUsersList:{method: 'GET', url: 'user/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'exerciseplan/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'exerciseplan/{id}/users'}, apiCfg.delCfg),

        getUUID: {method: 'GET', url: 'helper/getUUID'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("exerciseplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9010001001',
         'edit':   '9010001002',
         'delete': '9010001003',
         'import': '9010001004',
         'export': '9010001005',
         'enable': '9010001006',
         'publish': '9010001007',
         'invalid': '9010001008',
    };
    return resource;
});