define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emerplan/disable'},
        deleteBatch: {method: 'DELETE', url: 'emerplan/ids'},//批量删除

		queryEmerPlanVersions : {method: 'GET', url: 'emerplan/emerplanversions/list'},//查询全部版本，入参id

        createEmerPlanHistory: {method: 'POST', url: 'emerplanhistory'},//提交
        createEmerPlanHistories: {method: 'POST', url: 'emerplanhistory/batch'},//批量提交
        queryEmerPlanHistories: {method: 'GET', url: 'emerplanhistory/list'},//查询版本历史, 入参emerPlanVersion.id
        cancelRevise:{method: "PUT", url:'emerplan/cancelRevise'}  ,  // 取消修订
        submitRevise:{method: "PUT", url:'emerplan/revise'}    // 修订
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emerplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020003001',
        // 'edit':   '9020003002',
         'delete': '9020003003',
        // 'import': '9020003004',
        // 'export': '9020003005',
        // 'enable': '9020003006',
        'submit': '9020003007',//提交
        'rollback': '9020003008',//回退
        'revise': '9020003009',
        'cancelRevise': '9020003010',
    };
    return resource;
});