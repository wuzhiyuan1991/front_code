define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        // getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet.isLateCheckAllowed'},
        saveDelegateRecord:{method:'POST',url:'checktaskgroup/{id}/delegaterecord'},
        queryDelegateRecords:{method:'GET',url:'checktaskgroup/delegaterecords/list/{currentPage}/{pageSize}'},
        createDelegateRecords:{method:'POST',url:'delegaterecord/batch'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checktaskgroup"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'execute': '2020004022',
        'delegate': '7920001001',
        'delegateBatch': '7920001002',
        'dispatch': '7920001003',//分派
        'dispatchBatch': '7920001004',//批量分派
        'exportPdf': '7920001006',
        'export' : "7920001005"
    };
    return resource;
});