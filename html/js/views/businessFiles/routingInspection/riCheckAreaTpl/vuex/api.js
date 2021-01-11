define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'richeckareatpl/disable'},
        unbind: {method: 'PUT', url: 'richeckareatpl/unbind'},
        getTableBatchHandleSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=tableBatchHandle.dataNumLimit'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richeckareatpl"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9720001001',
        'edit':   '9720001002',
        'delete': '9720001003',
        // 'import': '9720001004',
        'export': '9720001005',
    	'enable': '9720001006',
        'importRFID': '9720001007',
        'unbind': '9720001008'
    };
    return resource;
});