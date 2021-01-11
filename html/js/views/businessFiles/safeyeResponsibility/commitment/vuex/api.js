define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
		updateDisable : {method: 'PUT', url: 'commitment/disable'},
		sign: {method: 'PUT', url: 'commitment/piblish/sign'},
		publish: {method: 'PUT', url: 'commitment/piblish'},
		cancelPlan: {method: 'PUT', url: 'commitment/cancel'},

		queryCommitmentTasks : {method: 'GET', url: 'commitment/commitmenttasks/list/{pageNo}/{pageSize}'},
		saveCommitmentTask : {method: 'POST', url: 'commitment/{id}/commitmenttask'},
		removeCommitmentTasks : _.extend({method: 'DELETE', url: 'commitment/{id}/commitmenttasks'}, apiCfg.delCfg),
		updateCommitmentTask : {method: 'PUT', url: 'commitment/{id}/commitmenttask'},

		queryCommitmentGroups : {method: 'GET', url: 'commitment/commitmentgroups/list/{pageNo}/{pageSize}'},
		saveCommitmentGroup : {method: 'POST', url: 'commitment/{id}/commitmentgroup'},
		removeCommitmentGroups : _.extend({method: 'DELETE', url: 'commitment/{id}/commitmentgroups'}, apiCfg.delCfg),
		updateCommitmentGroup : {method: 'PUT', url: 'commitment/{id}/commitmentgroup'},
		moveCommitmentGroups : {method: 'PUT', url: 'commitment/{id}/commitmentgroups/order'},

		queryUsers : {method: 'GET', url: 'commitment/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'commitment/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'commitment/{id}/users'}, apiCfg.delCfg),


		getGroupList: {method: 'GET', url: 'commitment/{id}/items'},

        saveGroupItem: {method: 'POST', url: 'commitmentgroup/{id}/commitmentitem'},
        updateGroupItem: {method: 'PUT', url: 'commitmentgroup/{id}/commitmentitem'},
		deleteGroupItem: {method: 'DELETE', url: 'commitmentgroup/{id}/commitmentitems'},
		orderGroupItem: {method: 'PUT', url: 'commitmentgroup/{id}/commitmentitems/order'},

		getUsersByDepts: {method: 'GET', url: 'user/posHseList/1/999?disable=0'},
		getTaskList: {method: 'GET', url: 'commitmenttask/list'},

		getSignList: {method: 'GET', url: 'commitment/sign/detail'},
		getTaskWorkList: {method: 'GET', url: 'commitmenttask/{id}/commitmentrecorddetail'},
		sendNotify: {method: 'POST', url: 'commitment/notify/sign'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("commitment"));
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