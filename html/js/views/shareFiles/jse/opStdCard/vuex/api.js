define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        submitOpCard: {method: 'PUT', url: 'opstdcard/submit'}, // 提交审核
		auditOpCard: {method: 'PUT', url: 'opstdcard/audit'}, // 审核
		quitOpCard: {method: 'PUT', url: 'opstdcard/quit'}, // 弃审
        queryOpStdSteps : {method: 'GET', url: 'opstdcard/opstdsteps/list/{pageNo}/{pageSize}'},
		saveOpStdStep : {method: 'POST', url: 'opstdcard/{id}/opstdstep'},
		removeOpStdSteps : _.extend({method: 'DELETE', url: 'opstdcard/{id}/opstdsteps'}, apiCfg.delCfg),
		updateOpStdStep : {method: 'PUT', url: 'opstdcard/{id}/opstdstep'},
		moveOpStdSteps : {method: 'PUT', url: 'opstdcard/{id}/opstdsteps/order'},
		
		queryOpStdStepItems : {method: 'GET', url: 'opstdstep/opstdstepitems/list/{pageNo}/{pageSize}'},
		saveOpStdStepItem : {method: 'POST', url: 'opstdstep/{id}/opstdstepitem'},
		removeOpStdStepItems : _.extend({method: 'DELETE', url: 'opstdstep/{id}/opstdstepitems'}, apiCfg.delCfg),
		updateOpStdStepItem : {method: 'PUT', url: 'opstdstep/{id}/opstdstepitem'},
		moveOpStdStepItems : {method: 'PUT', url: 'opstdstep/{id}/opstdstepitems/order'},


        getGroupAndItem: {method:'GET', url: 'opstdcard/{id}/items'},
        updateDisable:{method: 'PUT', url: 'opstdcard/disable'},
        create4copy : {method: 'POST', url: 'opstdcard/{id}/share/copy'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opstdcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export':'1310001005',
        'copy':'1310001010'
    };
    return resource;
});