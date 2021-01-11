define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryTpaCheckTasks : {method: 'GET', url: 'tpacheckplan/tpachecktasks/list/{pageNo}/{pageSize}'},
		saveTpaCheckTask : {method: 'POST', url: 'tpacheckplan/{id}/tpachecktask'},
		removeTpaCheckTasks : _.extend({method: 'DELETE', url: 'tpacheckplan/{id}/tpachecktasks'}, apiCfg.delCfg),
		updateTpaCheckTask : {method: 'PUT', url: 'tpacheckplan/{id}/tpachecktask'},
		queryUsers : {method: 'GET', url: 'tpacheckplan/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'tpacheckplan/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'tpacheckplan/{id}/users'}, apiCfg.delCfg),
        queryCheckTasks : {method: 'GET', url: 'tpacheckplan/tpachecktask/list/{pageNo}/{pageSize}'},
        preViewCheckTasks :{method: 'GET', url: 'tpacheckplan/tpachecktask/view/{pageNo}/{pageSize}'},
        saveCheckTask : {method: 'POST', url: 'tpacheckplan/{id}/tpachecktask'},
        removeCheckTasks : _.extend({method: 'DELETE', url: 'tpacheckplan/{id}/tpachecktask'}, apiCfg.delCfg),
        updateCheckTask : {method: 'PUT', url: 'tpacheckplan/{id}/tpachecktask'},
        queryCheckRecords : {method: 'GET', url: 'tpacheckplan/checkrecords/list/{pageNo}/{pageSize}'},
        saveCheckRecord : {method: 'POST', url: 'tpacheckplan/{id}/checkrecord'},
        removeCheckRecords : _.extend({method: 'DELETE', url: 'tpacheckplan/{id}/checkrecords'}, apiCfg.delCfg),
        updateCheckRecord : {method: 'PUT', url: 'tpacheckplan/{id}/checkrecord'},
        publish: {method: 'PUT', url: 'tpacheckplan/publish'},
        getUsers:{method:'GET',url:'tpacheckplan/users/list'},
        getUser:{method:'GET',url:'user/{id}'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        getCheckRecords: {method: 'GET', url: 'checkrecord/list'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpacheckplan"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});