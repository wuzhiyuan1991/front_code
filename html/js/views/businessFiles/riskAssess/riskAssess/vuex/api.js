define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
		updateDisable : {method: 'PUT', url: 'riskassess/disable'},

		queryRiskAssessTasks : {method: 'GET', url: 'riskassess/riskassesstasks/list/{pageNo}/{pageSize}'},
		saveRiskAssessTask : {method: 'POST', url: 'riskassess/{id}/riskassesstask'},
		removeRiskAssessTasks : _.extend({method: 'DELETE', url: 'riskassess/{id}/riskassesstasks'}, apiCfg.delCfg),
		updateRiskAssessTask : {method: 'PUT', url: 'riskassess/{id}/riskassesstask'},

		queryRiskAssessGroups : {method: 'GET', url: 'riskassess/riskassessgroups/list/{pageNo}/{pageSize}'},
		saveRiskAssessGroup : {method: 'POST', url: 'riskassess/{id}/riskassessgroup'},
		removeRiskAssessGroups : _.extend({method: 'DELETE', url: 'riskassess/{id}/riskassessgroups'}, apiCfg.delCfg),
		updateRiskAssessGroup : {method: 'PUT', url: 'riskassess/{id}/riskassessgroup'},
		moveRiskAssessGroups : {method: 'PUT', url: 'riskassess/{id}/riskassessgroups/order'},

		queryUsers : {method: 'GET', url: 'riskassess/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'riskassess/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'riskassess/{id}/users'}, apiCfg.delCfg),

        sign: {method: 'PUT', url: 'riskassess/piblish/sign'},
        publish: {method: 'PUT', url: 'riskassess/piblish'},
        cancelPlan: {method: 'PUT', url: 'riskassess/cancel'},

        getGroupList: {method: 'GET', url: 'riskassess/{id}/items'},

        saveGroupItem: {method: 'POST', url: 'riskassessgroup/{id}/riskassessitem'},
        updateGroupItem: {method: 'PUT', url: 'riskassessgroup/{id}/riskassessitem'},
        deleteGroupItem: {method: 'DELETE', url: 'riskassessgroup/{id}/riskassessitems'},
        orderGroupItem: {method: 'PUT', url: 'riskassessgroup/{id}/riskassessitems/order'},

        getUsersByDepts: {method: 'GET', url: 'user/posHseList/1/999?disable=0'},
        getTaskList: {method: 'GET', url: 'riskassesstask/list'},

        getSignList: {method: 'GET', url: 'riskassess/sign/detail'},
        getTaskWorkList: {method: 'GET', url: 'riskassesstask/{id}/riskassessrecorddetail'},
        sendNotify: {method: 'POST', url: 'riskassess/notify/sign'}

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskassess"));
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