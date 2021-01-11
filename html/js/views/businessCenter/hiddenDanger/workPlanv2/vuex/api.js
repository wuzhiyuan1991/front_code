define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'workplan/disable'},

        queryCheckPlans : {method: 'GET', url: 'workplan/checkplans/list/{pageNo}/{pageSize}'},
        queryOperateRecords : {method: 'GET', url: 'workplan/operateRecords/list/{pageNo}/{pageSize}'},
        saveCheckPlans : {method: 'POST', url: 'workplan/{id}/checkplans'},
        removeCheckPlans : _.extend({method: 'DELETE', url: 'workplan/{id}/checkplans'}, apiCfg.delCfg),
        delegate: {method: 'POST', url: 'workplan/delegate'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("workplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'createv2': '2020008001',
        'editv2':   '2020008002',
        'deletev2': '2020008003',
        'delegatev2': '2020008005',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});