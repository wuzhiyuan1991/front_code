define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        createBatch: {method: 'POST', url: 'rpt/rptkeypost/batch'},
        updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},
        queryTaskStatusParam: {method: 'GET', url: '/lookup/rpt_module_enable_cfg/lookupitem/task_status?_bizModule=code&type=syscfg'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("rpt/rptkeypost"));
    var resource = Vue.resource(null,{}, customActions);

    return resource;
});