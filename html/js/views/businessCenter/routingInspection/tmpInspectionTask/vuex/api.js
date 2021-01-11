define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        // getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet.isLateCheckAllowed'},
        saveDelegateRecord:{method:'POST',url:'ritmpchecktaskgroup/{id}/delegaterecord'},
        queryDelegateRecords:{method:'GET',url:'ritmpchecktaskgroup/delegaterecords/list/{currentPage}/{pageSize}'},
        createDelegateRecords:{method:'POST',url:'delegaterecord/batch'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ritmpchecktaskgroup"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'execute': '6420006022',
        'delegate': '6420006001',
        'delegateBatch': '6420006002',
    };
    return resource;
});