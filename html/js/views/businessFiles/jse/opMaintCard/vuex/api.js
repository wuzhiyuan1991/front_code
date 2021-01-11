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

        getGroupAndItem: {method:'GET', url: 'opmaintcard/{id}/items', time:0},
        updateDisable:{method: 'PUT', url: 'opmaintcard/disable'},
        updateShare:{method:'PUT',url:'opmaintcard/share'},
        batchShare: {method: 'PUT', url: 'opmaintcard/share/list'},
        addPublicDocument: {method: 'POST', url: '/file/list/copy'},
        queryLookupItem: {method: 'GET', url: 'lookup/lookupitems/list?code=audit_process_switch'},
        queryProcessStatus: {method: 'GET', url: 'auditrecord/preview'},
        saveAuditProcessRecord: {method: 'POST', url: 'opmaintcard/{id}/auditrecord'},
        getProcessRecordList: {method: 'GET', url: 'opmaintcard/auditrecords/list'},
        getUndoCount: {method: 'GET', url: 'opcard/todo/num?type=2'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opmaintcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1120001001',
        'edit':   '1120001002',
        'delete': '1120001003',
        'submit':'1120001006',
        'audit':'1120001007',
        'quit':'1120001008',
        'enable':'1120001009',
        'copy':'1120001010',
        'share':'1120001011',
        'import':'1120001004',
        'export':'1120001005',
        'jsa':'1120001013',
        'process':'1120001014',//审批流设置
        'processEdit':'1120001015'//审批流编辑
    };
    return resource;
});