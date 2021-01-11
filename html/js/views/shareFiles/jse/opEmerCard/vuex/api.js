define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        submitOpCard: {method: 'PUT', url: 'opemercard/submit'}, // 提交审核
        auditOpCard: {method: 'PUT', url: 'opemercard/audit'}, // 审核
        quitOpCard: {method: 'PUT', url: 'opemercard/quit'}, // 弃审
		queryOpEmerSteps : {method: 'GET', url: 'opemercard/opemersteps/list/{pageNo}/{pageSize}'},
		saveOpEmerStep : {method: 'POST', url: 'opemercard/{id}/opemerstep'},
		removeOpEmerSteps : _.extend({method: 'DELETE', url: 'opemercard/{id}/opemersteps'}, apiCfg.delCfg),
		updateOpEmerStep : {method: 'PUT', url: 'opemercard/{id}/opemerstep'},
		moveOpEmerSteps : {method: 'PUT', url: 'opemercard/{id}/opemersteps/order'},

		queryOpEmerStepItems : {method: 'GET', url: 'opemerstep/opemerstepitems/list/{pageNo}/{pageSize}'},
		saveOpEmerStepItem : {method: 'POST', url: 'opemerstep/{id}/opemerstepitem'},
		removeOpEmerStepItems : _.extend({method: 'DELETE', url: 'opemerstep/{id}/opemerstepitems'}, apiCfg.delCfg),
		updateOpEmerStepItem : {method: 'PUT', url: 'opemerstep/{id}/opemerstepitem'},
		moveOpEmerStepItems : {method: 'PUT', url: 'opemerstep/{id}/opemerstepitems/order'},

        getGroupAndItem: {method:'GET', url: 'opemercard/{id}/items'},
        updateDisable:{method: 'PUT', url: 'opemercard/disable'},
        create4copy : {method: 'POST', url: 'opemercard/{id}/share/copy'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opemercard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export':'1330001005',
        'copy':'1330001010'
    };
    return resource;
});