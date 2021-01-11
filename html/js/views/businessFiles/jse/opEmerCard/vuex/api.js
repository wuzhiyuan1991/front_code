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
        updateShare:{method:'PUT',url:'opemercard/share'},
        batchShare: {method: 'PUT', url: 'opemercard/share/list'},
        addPublicDocument: {method: 'POST', url: '/file/list/copy'},
        queryLookupItem: {method: 'GET', url: 'lookup/lookupitems/list?code=audit_process_switch'},

        queryProcessStatus: {method: 'GET', url: 'auditrecord/preview'},
        saveAuditProcessRecord: {method: 'POST', url: 'opemercard/{id}/auditrecord'},
        getProcessRecordList: {method: 'GET', url: 'opemercard/auditrecords/list'},
        getUndoCount: {method: 'GET', url: 'opcard/todo/num?type=3'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opemercard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1130001001',
        'edit':   '1130001002',
        'delete': '1130001003',
        'submit':'1130001006',
        'audit':'1130001007',
        'quit':'1130001008',
        'enable':'1130001009',
        'copy':'1130001010',
        'share':'1130001011',
        'import':'1130001004',
        'export':'1130001005',
        'process':'1130001014',//审批流设置
        'processEdit':'1130001015'//审批流编辑
    };
    return resource;
});