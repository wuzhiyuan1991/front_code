define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
		updateDisable : {method: 'PUT', url: 'positioninventory/disable'},

		queryPositionInventoryTasks : {method: 'GET', url: 'positioninventory/positioninventorytasks/list/{pageNo}/{pageSize}'},
		savePositionInventoryTask : {method: 'POST', url: 'positioninventory/{id}/positioninventorytask'},
		removePositionInventoryTasks : _.extend({method: 'DELETE', url: 'positioninventory/{id}/positioninventorytasks'}, apiCfg.delCfg),
		updatePositionInventoryTask : {method: 'PUT', url: 'positioninventory/{id}/positioninventorytask'},

		queryPositionInventoryGroups : {method: 'GET', url: 'positioninventory/positioninventorygroups/list/{pageNo}/{pageSize}'},
		savePositionInventoryGroup : {method: 'POST', url: 'positioninventory/{id}/positioninventorygroup'},
		removePositionInventoryGroups : _.extend({method: 'DELETE', url: 'positioninventory/{id}/positioninventorygroups'}, apiCfg.delCfg),
		updatePositionInventoryGroup : {method: 'PUT', url: 'positioninventory/{id}/positioninventorygroup'},
		movePositionInventoryGroups : {method: 'PUT', url: 'positioninventory/{id}/positioninventorygroups/order'},

		queryUsers : {method: 'GET', url: 'positioninventory/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'positioninventory/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'positioninventory/{id}/users'}, apiCfg.delCfg),

        sign: {method: 'PUT', url: 'positioninventory/piblish/sign'},
        publish: {method: 'PUT', url: 'positioninventory/piblish'},
        cancelPlan: {method: 'PUT', url: 'positioninventory/cancel'},
        getGroupList: {method: 'GET', url: 'positioninventory/{id}/items'},

        saveGroupItem: {method: 'POST', url: 'positioninventorygroup/{id}/positioninventoryitem'},
        updateGroupItem: {method: 'PUT', url: 'positioninventorygroup/{id}/positioninventoryitem'},
        deleteGroupItem: {method: 'DELETE', url: 'positioninventorygroup/{id}/positioninventoryitems'},
        orderGroupItem: {method: 'PUT', url: 'positioninventorygroup/{id}/positioninventoryitems/order'},

        getUsersByDepts: {method: 'GET', url: 'user/posHseList/1/999?disable=0'},
        getTaskList: {method: 'GET', url: 'positioninventorytask/list'},

        getSignList: {method: 'GET', url: 'positioninventory/sign/detail'},
        getTaskWorkList: {method: 'GET', url: 'positioninventorytask/{id}/positioninventoryrecorddetail'},
        sendNotify: {method: 'POST', url: 'positioninventory/notify/sign'}

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("positioninventory"));
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