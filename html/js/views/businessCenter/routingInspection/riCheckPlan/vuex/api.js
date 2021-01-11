define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryRiCheckRecords : {method: 'GET', url: 'richeckplan/richeckrecords/list/{pageNo}/{pageSize}'},
		saveRiCheckRecord : {method: 'POST', url: 'richeckplan/{id}/richeckrecord'},
		removeRiCheckRecords : _.extend({method: 'DELETE', url: 'richeckplan/{id}/richeckrecords'}, apiCfg.delCfg),
		updateRiCheckRecord : {method: 'PUT', url: 'richeckplan/{id}/richeckrecord'},
		queryRiCheckTasks : {method: 'GET', url: 'richeckplan/richecktasks/list/{pageNo}/{pageSize}'},
		saveRiCheckTask : {method: 'POST', url: 'richeckplan/{id}/richecktask'},
		removeRiCheckTasks : _.extend({method: 'DELETE', url: 'richeckplan/{id}/richecktasks'}, apiCfg.delCfg),
		updateRiCheckTask : {method: 'PUT', url: 'richeckplan/{id}/richecktask'},
		queryUsers : {method: 'GET', url: 'richeckplan/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'richeckplan/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'richeckplan/{id}/users'}, apiCfg.delCfg),
        getUser:{method:'GET',url:'user/{id}'},
        getUsers:{method:'GET',url:'richeckplan/users/list'},
        getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        publish: {method: 'PUT', url: 'richeckplan/publish'},
        invalid: {method: 'PUT', url: 'richeckplan/invalid'},
        queryCheckTypes: {method: 'GET', url: 'richecktype/list/{curPage}/{pageSize}'},
        queryCheckTable: {method: 'GET', url: 'richecktable/{id}?_bizModule=rich'},
        queryCheckTableSet: {method:'GET', url: 'richeckplan/{id}/richecktable/{tableId}'},
        saveCheckItems:{method: 'POST', url: 'richeckplan/{id}/table/{tableId}/richeckplanitemrels'},
        queryPlanRoute:{method: 'GET', url: 'richeckplan/richeckareas/list'},
        queryPlanViewRoute: {method:'GET', url: 'richeckplan/{id}/richeckplanitemdetail'},

        submitRiCheckPlan: {method: 'PUT', url: 'richeckplan/submit'}, // 提交审核
        auditRiCheckPlan: {method: 'PUT', url: 'richeckplan/audit'}, // 审核
        quitRiCheckPlan: {method: 'PUT', url: 'richeckplan/quit'}, // 弃审
        excuteOrder: {method: 'PUT', url: 'richeckplan/excuteOrder'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richeckplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6420001001',
        'edit':   '6420001002',
        'delete': '6420001003',
        // 'import': '6420001004',
        // 'export': '6420001005',
    	'publish' : '6420001006',
    	'invalid' : '6420001007',
        'submit':'6420001008',
        'audit':'6420001009',
        'quit':'6420001010',
    };
    return resource;
});