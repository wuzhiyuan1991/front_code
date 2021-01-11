define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryOpMaintRecordDetails : {method: 'GET', url: 'oprecord/opmaintrecorddetails/list/{pageNo}/{pageSize}'},
		saveOpMaintRecordDetail : {method: 'POST', url: 'oprecord/{id}/opmaintrecorddetail'},
		removeOpMaintRecordDetails : _.extend({method: 'DELETE', url: 'oprecord/{id}/opmaintrecorddetails'}, apiCfg.delCfg),
		updateOpMaintRecordDetail : {method: 'PUT', url: 'oprecord/{id}/opmaintrecorddetail'},

		queryOpStdRecordDetails : {method: 'GET', url: 'oprecord/opstdrecorddetails/list/{pageNo}/{pageSize}'},
		saveOpStdRecordDetail : {method: 'POST', url: 'oprecord/{id}/opstdrecorddetail'},
		removeOpStdRecordDetails : _.extend({method: 'DELETE', url: 'oprecord/{id}/opstdrecorddetails'}, apiCfg.delCfg),
		updateOpStdRecordDetail : {method: 'PUT', url: 'oprecord/{id}/opstdrecorddetail'},

		queryPrincipals : {method: 'GET', url: 'oprecord/principals/list/{pageNo}/{pageSize}'},
		savePrincipals : {method: 'POST', url: 'oprecord/{id}/principals'},
		removePrincipals : _.extend({method: 'DELETE', url: 'oprecord/{id}/principals'}, apiCfg.delCfg),

		querySupervisors : {method: 'GET', url: 'oprecord/supervisors/list/{pageNo}/{pageSize}'},
		saveSupervisors : {method: 'POST', url: 'oprecord/{id}/supervisors'},
		removeSupervisors : _.extend({method: 'DELETE', url: 'oprecord/{id}/supervisors'}, apiCfg.delCfg),

		queryOperators : {method: 'GET', url: 'oprecord/operators/list/{pageNo}/{pageSize}'},
		saveOperators : {method: 'POST', url: 'oprecord/{id}/operators'},
		removeOperators : _.extend({method: 'DELETE', url: 'oprecord/{id}/operators'}, apiCfg.delCfg),


		queryMRecord:{method: 'GET', url: 'oprecord/{id}/maintrecorddetails'}, // 维修卡详情
		querySRecord: {method: 'GET', url: 'oprecord/{id}/stdrecorddetails'}, // 操作票详情
		getSCard: {method: 'GET', url: 'opstdcard/{id}'}, // 获取操作票详情
		getMCard: {method: 'GET', url: 'opmaintcard/{id}'}, // 获取维修卡详情
        getSGroupAndItem: {method:'GET', url: 'opstdcard/{id}/items'},
        getMGroupAndItem: {method:'GET', url: 'opmaintcard/{id}/items'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("oprecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '2020003001',
        // 'edit':   '2020002002',
        // 'delete': '2020002003',
        // 'import': '2020002004',
        // 'export': '2020003005',
    };
    return resource;
});