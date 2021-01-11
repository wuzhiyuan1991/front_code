define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'icmriskassessment/disable'},
        getTreeList: {method: 'GET', url: 'icmrisktype/list'},
        createRiskType: {method: 'post', url: 'icmrisktype'},
        updateRiskType: {method: 'put', url: 'icmrisktype'},
        deleteRiskType: {method: 'delete', url: 'icmrisktype'},
        getRiskPointList: {method: 'GET', url: 'icmriskassessment/riskPointList'},
        getTableData: {method: 'GET', url: 'icmriskassessment/list'},
        deleteIcmRiskassessment: {method: 'delete', url: '/icmriskassessment/batch'},
        
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("icmriskassessment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'enable': '_YYYYYYY006',
        'import': '2040007004',
        'export': '2040007005',
        'delete': '2040007003',
        'createType': '2040007006',
        'editType': '2040007007',
        'deleteType': '2040007008',

    };
    return resource;
});