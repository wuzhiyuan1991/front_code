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
        updateShare:{method:'PUT',url:'opstdcard/share'},
        batchShare: {method: 'PUT', url: 'opstdcard/share/list'},
        addPublicDocument: {method: 'POST', url: '/file/list/copy'},
        queryLookupItem: {method: 'GET', url: 'lookup/lookupitems/list?code=audit_process_switch'},
        queryProcessStatus: {method: 'GET', url: 'auditrecord/preview'},
        saveAuditProcessRecord: {method: 'POST', url: 'opstdcard/{id}/auditrecord'},
        getProcessRecordList: {method: 'GET', url: 'opstdcard/auditrecords/list'},
        getUndoCount: {method: 'GET', url: 'opcard/todo/num?type=1'},

        queryOpCraftsProcesses : {method: 'GET', url: 'opstdcard/opcraftsprocesses/list/{pageNo}/{pageSize}'},
        saveOpCraftsProcess : {method: 'POST', url: 'opstdcard/{id}/opcraftsprocess'},
        removeOpCraftsProcesses : _.extend({method: 'DELETE', url: 'opstdcard/{id}/opcraftsprocesses'}, apiCfg.delCfg),
        updateOpCraftsProcess : {method: 'PUT', url: 'opstdcard/{id}/opcraftsprocess'},
        moveOpCraftsProcess:{method: 'PUT', url: 'opcraftsprocess/order'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opstdcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1110003001',
        'edit':   '1110003002',
        'delete': '1110003003',
        'submit':'1110003006',
        'audit':'1110003007',
        'quit':'1110003008',
        'enable':'1110003009',
        'copy':'1110003010',
        'share':'1110003011',
        'import':'1110003004',
        'export':'1110003005',
        'jsa':'1110003013',
        'process':'1110003014',//审批流设置
        'processEdit':'1110003015'//审批流编辑
    };
    return resource;
});