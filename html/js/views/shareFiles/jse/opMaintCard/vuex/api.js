define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        submitOpCard: {method: 'PUT', url: 'opmaintcard/submit'}, // 提交审核
        auditOpCard: {method: 'PUT', url: 'opmaintcard/audit'}, // 审核
        quitOpCard: {method: 'PUT', url: 'opmaintcard/quit'}, // 弃审
		queryOpMaintSteps : {method: 'GET', url: 'opmaintcard/opmaintsteps/list/{pageNo}/{pageSize}'},
		saveOpMaintStep : {method: 'POST', url: 'opmaintcard/{id}/opmaintstep'},
		removeOpMaintSteps : _.extend({method: 'DELETE', url: 'opmaintcard/{id}/opmaintsteps'}, apiCfg.delCfg),
		updateOpMaintStep : {method: 'PUT', url: 'opmaintcard/{id}/opmaintstep'},
		moveOpMaintSteps : {method: 'PUT', url: 'opmaintcard/{id}/opmaintsteps/order'},
		
		queryOpMaintStepItems : {method: 'GET', url: 'opmaintstep/opmaintstepitems/list/{pageNo}/{pageSize}'},
		saveOpMaintStepItem : {method: 'POST', url: 'opmaintstep/{id}/opmaintstepitem'},
		removeOpMaintStepItems : _.extend({method: 'DELETE', url: 'opmaintstep/{id}/opmaintstepitems'}, apiCfg.delCfg),
		updateOpMaintStepItem : {method: 'PUT', url: 'opmaintstep/{id}/opmaintstepitem'},
		moveOpMaintStepItems : {method: 'PUT', url: 'opmaintstep/{id}/opmaintstepitems/order'},

        getGroupAndItem: {method:'GET', url: 'opmaintcard/{id}/items'},
        updateDisable:{method: 'PUT', url: 'opmaintcard/disable'},
        create4copy : {method: 'POST', url: 'opmaintcard/{id}/share/copy'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opmaintcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export':'1320001005',
        'copy':'1320001010'
    };
    return resource;
});